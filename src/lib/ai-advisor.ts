import type { Transaction } from './types';
import { computeMonthlyBreakdown, computeCategoryBreakdown, computeFinancialSummary, formatCurrency } from './analytics';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface AIInsight {
  id: string;
  type: 'saving' | 'warning' | 'tax' | 'pattern' | 'tip' | 'goal';
  title: string;
  description: string;
  amount?: number;
  severity: 'info' | 'success' | 'warning' | 'critical';
  icon: string;
}

export interface AIAnalysis {
  summary: string;
  insights: AIInsight[];
  monthlyVerdict: string;
  savingsPotential: number;
  taxEstimate: {
    estimatedIRPF: number;
    estimatedSS: number;
    effectiveRate: number;
    tips: string[];
  };
  spendingScore: number; // 0-100
  loading: boolean;
}

function buildFinancialContext(transactions: Transaction[]): string {
  const summary = computeFinancialSummary(transactions);
  const monthly = computeMonthlyBreakdown(transactions);
  const categories = computeCategoryBreakdown(transactions, 'expenses');
  const incomeCategories = computeCategoryBreakdown(transactions, 'income');

  const last3Months = monthly.slice(-3);
  const topCategories = categories.slice(0, 8);

  const recurringExpenses = findRecurringExpenses(transactions);
  const largeExpenses = transactions
    .filter(tx => tx.amount < -200)
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 10);

  return `
DATOS FINANCIEROS DEL USUARIO (España, autónomo + asalariado):

RESUMEN GENERAL:
- Período analizado: ${summary.monthCount} meses
- Total transacciones: ${summary.transactionCount}
- Ingresos totales: ${formatCurrency(summary.totalIncome)}
- Gastos totales: ${formatCurrency(summary.totalExpenses)}
- Balance neto: ${formatCurrency(summary.netBalance)}
- Media mensual ingresos: ${formatCurrency(summary.avgMonthlyIncome)}
- Media mensual gastos: ${formatCurrency(summary.avgMonthlyExpenses)}

ÚLTIMOS 3 MESES:
${last3Months.map(m => `- ${m.label}: Ingresos ${formatCurrency(m.income)} | Gastos ${formatCurrency(m.expenses)} | Neto ${formatCurrency(m.net)}`).join('\n')}

TOP CATEGORÍAS DE GASTO:
${topCategories.map(c => `- ${c.label}: ${formatCurrency(c.total)} (${c.percentage.toFixed(1)}%) - ${c.count} transacciones - Media ${formatCurrency(c.avgPerMonth)}/mes`).join('\n')}

FUENTES DE INGRESO:
${incomeCategories.map(c => `- ${c.label}: ${formatCurrency(c.total)} (${c.count} transacciones)`).join('\n')}

GASTOS RECURRENTES DETECTADOS:
${recurringExpenses.map(r => `- ${r.name}: ${formatCurrency(r.avgAmount)}/mes (${r.occurrences} veces)`).join('\n')}

GASTOS GRANDES (>200€):
${largeExpenses.map(tx => `- ${tx.concept}: ${formatCurrency(tx.amount)} (${tx.date.toLocaleDateString('es-ES')})`).join('\n')}

SUSCRIPCIONES DETECTADAS:
${transactions.filter(tx => tx.category === 'subscriptions' && tx.amount < 0).slice(0, 15).map(tx => `- ${tx.concept}: ${formatCurrency(tx.amount)}`).join('\n')}
`.trim();
}

function findRecurringExpenses(transactions: Transaction[]): { name: string; avgAmount: number; occurrences: number }[] {
  const grouped = new Map<string, number[]>();
  
  for (const tx of transactions) {
    if (tx.amount >= 0) continue;
    const key = tx.concept.toLowerCase().replace(/[^a-z ]/g, '').trim().split(' ').slice(0, 2).join(' ');
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(Math.abs(tx.amount));
  }

  return Array.from(grouped.entries())
    .filter(([, amounts]) => amounts.length >= 3)
    .map(([name, amounts]) => ({
      name,
      avgAmount: amounts.reduce((a, b) => a + b, 0) / amounts.length,
      occurrences: amounts.length,
    }))
    .sort((a, b) => b.avgAmount * b.occurrences - a.avgAmount * a.occurrences)
    .slice(0, 15);
}

export async function getAIAnalysis(transactions: Transaction[]): Promise<AIAnalysis> {
  const context = buildFinancialContext(transactions);
  
  const prompt = `Eres un asesor financiero personal con IA para un usuario en España. Analiza estos datos financieros y proporciona insights accionables.

${context}

Responde en JSON con esta estructura EXACTA (sin markdown, solo JSON puro):
{
  "summary": "Resumen ejecutivo de 2-3 frases sobre la salud financiera",
  "monthlyVerdict": "Veredicto del último mes en 1 frase (ej: 'Buen mes, gastos controlados' o 'Alerta: gastos un 30% por encima de la media')",
  "spendingScore": 72,
  "savingsPotential": 450,
  "taxEstimate": {
    "estimatedIRPF": 8500,
    "estimatedSS": 3600,
    "effectiveRate": 28.5,
    "tips": ["Tip fiscal 1", "Tip fiscal 2"]
  },
  "insights": [
    {
      "id": "1",
      "type": "saving",
      "title": "Título corto",
      "description": "Descripción detallada y accionable",
      "amount": 150,
      "severity": "warning",
      "icon": "PiggyBank"
    }
  ]
}

REGLAS para los insights:
- Mínimo 6, máximo 10 insights
- Al menos 1 de tipo "tax" con estimación de IRPF para declaración de la renta
- Al menos 2 de tipo "saving" con cantidades concretas que podría ahorrar
- Al menos 1 de tipo "warning" si hay gastos sospechosos o excesivos
- Al menos 1 de tipo "pattern" sobre patrones de gasto detectados
- Al menos 1 de tipo "tip" con consejos prácticos
- severity: "info" = informativo, "success" = bien hecho, "warning" = ojo, "critical" = urgente
- Sé concreto con números, no genérico. Menciona nombres de comercios reales.
- spendingScore de 0 a 100 (100 = salud financiera perfecta)
- savingsPotential = euros/mes que podría ahorrar con cambios razonables
- Para impuestos, calcula sobre los datos de España 2025 (IRPF progresivo + SS autónomos)`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error('No response from Gemini');

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleaned);

    return {
      ...result,
      loading: false,
    };
  } catch (error) {
    console.error('AI Analysis error:', error);
    return getLocalAnalysis(transactions);
  }
}

function getLocalAnalysis(transactions: Transaction[]): AIAnalysis {
  const summary = computeFinancialSummary(transactions);
  const categories = computeCategoryBreakdown(transactions, 'expenses');
  const topCat = categories[0];

  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'pattern',
      title: `Tu mayor gasto: ${topCat?.label}`,
      description: `Gastas una media de ${formatCurrency(topCat?.avgPerMonth || 0)} al mes en ${topCat?.label.toLowerCase()}. Esto supone el ${topCat?.percentage.toFixed(0)}% de tus gastos totales.`,
      amount: topCat?.avgPerMonth,
      severity: 'info',
      icon: 'TrendingUp',
    },
    {
      id: '2',
      type: 'saving',
      title: 'Potencial de ahorro en restaurantes',
      description: `Si reduces un 20% tus gastos en restauración, podrías ahorrar ${formatCurrency((categories.find(c => c.category === 'food')?.avgPerMonth || 0) * 0.2)} al mes.`,
      amount: (categories.find(c => c.category === 'food')?.avgPerMonth || 0) * 0.2,
      severity: 'warning',
      icon: 'PiggyBank',
    },
    {
      id: '3',
      type: 'tax',
      title: 'Estimación IRPF',
      description: `Con tus ingresos medios de ${formatCurrency(summary.avgMonthlyIncome)}/mes, tu tipo efectivo estimado es del ~25%. Revisa tus deducciones autonómicas de Cataluña.`,
      amount: summary.totalIncome * 0.25,
      severity: 'info',
      icon: 'Receipt',
    },
    {
      id: '4',
      type: 'warning',
      title: 'Suscripciones activas',
      description: 'Tienes varias suscripciones activas (Spotify, ChatGPT, Apple). Revisa si las usas todas.',
      severity: 'warning',
      icon: 'AlertTriangle',
    },
    {
      id: '5',
      type: 'tip',
      title: 'Regla 50/30/20',
      description: `Tu ratio actual: ${((summary.avgMonthlyExpenses / summary.avgMonthlyIncome) * 100).toFixed(0)}% gastos sobre ingresos. Objetivo: máximo 80%.`,
      severity: summary.avgMonthlyExpenses > summary.avgMonthlyIncome * 0.8 ? 'critical' : 'success',
      icon: 'Target',
    },
  ];

  return {
    summary: `En ${summary.monthCount} meses analizados, has ingresado ${formatCurrency(summary.totalIncome)} y gastado ${formatCurrency(summary.totalExpenses)}. Tu categoría de gasto principal es "${summary.topExpenseCategory}".`,
    insights,
    monthlyVerdict: `Media de ${formatCurrency(summary.avgMonthlyExpenses)} en gastos mensuales.`,
    savingsPotential: summary.avgMonthlyExpenses * 0.15,
    taxEstimate: {
      estimatedIRPF: summary.totalIncome * 0.25,
      estimatedSS: 3600,
      effectiveRate: 25,
      tips: ['Revisa deducciones por vivienda habitual', 'Los gastos profesionales son deducibles como autónomo'],
    },
    spendingScore: Math.min(100, Math.max(0, Math.round(70 - (summary.avgMonthlyExpenses / summary.avgMonthlyIncome - 0.7) * 100))),
    loading: false,
  };
}
