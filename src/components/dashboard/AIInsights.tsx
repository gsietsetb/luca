import { useState } from 'react';
import {
  Sparkles,
  PiggyBank,
  AlertTriangle,
  Receipt,
  TrendingUp,
  Target,
  Lightbulb,
  Shield,
  Loader2,
  Brain,
  Zap,
} from 'lucide-react';
import type { Transaction } from '../../lib/types';
import type { AIAnalysis, AIInsight } from '../../lib/ai-advisor';
import { getAIAnalysis } from '../../lib/ai-advisor';
import { formatCurrency } from '../../lib/analytics';

const ICON_MAP: Record<string, React.ReactNode> = {
  PiggyBank: <PiggyBank className="h-4 w-4" />,
  AlertTriangle: <AlertTriangle className="h-4 w-4" />,
  Receipt: <Receipt className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  Target: <Target className="h-4 w-4" />,
  Lightbulb: <Lightbulb className="h-4 w-4" />,
  Shield: <Shield className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
};

const SEVERITY_STYLES = {
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
};

interface Props {
  transactions: Transaction[];
}

export default function AIInsightsPanel({ transactions }: Props) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAIAnalysis(transactions);
      setAnalysis(result);
    } catch (e) {
      setError('Error al analizar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!analysis && !loading) {
    return (
      <div className="rounded-2xl border border-luca-500/30 bg-gradient-to-br from-luca-500/5 to-dark-800 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-luca-500/20">
          <Brain className="h-8 w-8 text-luca-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Tu Asesor Financiero con IA</h3>
        <p className="mt-2 text-sm text-neutral max-w-md mx-auto">
          Analizo tus {transactions.length} transacciones con Gemini AI para darte insights personalizados: 
          ahorro, impuestos, patrones, alertas y más.
        </p>
        <button
          onClick={runAnalysis}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-luca-500 px-6 py-3 font-semibold text-white transition-all hover:bg-luca-600 hover:shadow-lg hover:shadow-luca-500/25"
        >
          <Sparkles className="h-4 w-4" />
          Analizar con IA
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-luca-500/30 bg-gradient-to-br from-luca-500/5 to-dark-800 p-12 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-luca-400" />
        <p className="mt-4 text-lg font-semibold text-white">Analizando tus finanzas...</p>
        <p className="mt-1 text-sm text-neutral">Gemini AI está procesando {transactions.length} transacciones</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* AI Summary Header */}
      <div className="rounded-2xl border border-luca-500/30 bg-gradient-to-br from-luca-500/5 via-dark-800 to-dark-800 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-luca-500/20">
              <Brain className="h-5 w-5 text-luca-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Análisis IA</h3>
              <p className="text-xs text-neutral">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={runAnalysis}
            className="rounded-lg border border-dark-600 bg-dark-700 px-3 py-1.5 text-xs text-neutral transition-colors hover:border-luca-500 hover:text-white"
          >
            Reanalizar
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral">{analysis.summary}</p>
        
        {/* Score + Verdict */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-dark-700/50 p-4 text-center">
            <div className="relative mx-auto h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1c1f38"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={analysis.spendingScore >= 70 ? '#10b981' : analysis.spendingScore >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${analysis.spendingScore}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {analysis.spendingScore}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-neutral">Salud financiera</p>
          </div>
          <div className="rounded-xl bg-dark-700/50 p-4 text-center">
            <p className="text-2xl font-bold text-income">{formatCurrency(analysis.savingsPotential)}</p>
            <p className="text-[10px] text-neutral">Ahorro potencial/mes</p>
          </div>
          <div className="rounded-xl bg-dark-700/50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{analysis.taxEstimate.effectiveRate}%</p>
            <p className="text-[10px] text-neutral">Tipo efectivo IRPF</p>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-dark-700/50 p-3">
          <p className="text-sm text-white">{analysis.monthlyVerdict}</p>
        </div>
      </div>

      {/* Tax Estimate */}
      <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Estimación fiscal</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-dark-700/50 p-4">
            <p className="text-xs text-neutral">IRPF estimado</p>
            <p className="text-xl font-bold text-amber-400">{formatCurrency(analysis.taxEstimate.estimatedIRPF)}</p>
          </div>
          <div className="rounded-xl bg-dark-700/50 p-4">
            <p className="text-xs text-neutral">Seguridad Social</p>
            <p className="text-xl font-bold text-neutral">{formatCurrency(analysis.taxEstimate.estimatedSS)}</p>
          </div>
        </div>
        {analysis.taxEstimate.tips.length > 0 && (
          <div className="mt-4 space-y-2">
            {analysis.taxEstimate.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-neutral">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {analysis.insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const style = SEVERITY_STYLES[insight.severity];
  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${style.bg} ${style.text}`}>
          {ICON_MAP[insight.icon] || <Sparkles className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
            <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          </div>
          <p className="mt-1 text-xs leading-relaxed text-neutral">{insight.description}</p>
          {insight.amount !== undefined && insight.amount > 0 && (
            <p className={`mt-2 text-sm font-semibold ${style.text}`}>
              {formatCurrency(insight.amount)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
