import type {
  Transaction,
  MonthlyBreakdown,
  CategoryBreakdown,
  FinancialSummary,
  TransactionCategory,
} from './types';
import { CATEGORY_CONFIG, MONTH_LABELS_ES } from './types';

export function getMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function getMonthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return `${MONTH_LABELS_ES[month - 1]} ${year}`;
}

export function computeMonthlyBreakdown(transactions: Transaction[]): MonthlyBreakdown[] {
  const map = new Map<string, MonthlyBreakdown>();

  for (const tx of transactions) {
    const key = getMonthKey(tx.date);
    if (!map.has(key)) {
      map.set(key, {
        month: key,
        label: getMonthLabel(key),
        income: 0,
        expenses: 0,
        net: 0,
        byCategory: {} as Record<TransactionCategory, number>,
        transactionCount: 0,
      });
    }
    const m = map.get(key)!;
    if (tx.amount > 0) {
      m.income += tx.amount;
    } else {
      m.expenses += Math.abs(tx.amount);
    }
    m.net = m.income - m.expenses;
    m.transactionCount++;
    m.byCategory[tx.category] = (m.byCategory[tx.category] || 0) + Math.abs(tx.amount);
  }

  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

export function computeCategoryBreakdown(
  transactions: Transaction[],
  type: 'expenses' | 'income' | 'all' = 'expenses',
): CategoryBreakdown[] {
  const filtered = transactions.filter((tx) => {
    if (type === 'expenses') return tx.amount < 0;
    if (type === 'income') return tx.amount > 0;
    return true;
  });

  const map = new Map<TransactionCategory, { total: number; count: number }>();
  for (const tx of filtered) {
    const cat = tx.category;
    if (!map.has(cat)) map.set(cat, { total: 0, count: 0 });
    const entry = map.get(cat)!;
    entry.total += Math.abs(tx.amount);
    entry.count++;
  }

  const grandTotal = Array.from(map.values()).reduce((sum, v) => sum + v.total, 0);
  const months = new Set(filtered.map((tx) => getMonthKey(tx.date))).size || 1;

  return Array.from(map.entries())
    .map(([cat, data]) => ({
      category: cat,
      label: CATEGORY_CONFIG[cat]?.label || cat,
      total: data.total,
      count: data.count,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
      color: CATEGORY_CONFIG[cat]?.color || '#9ca3af',
      icon: CATEGORY_CONFIG[cat]?.icon || 'MoreHorizontal',
      avgPerMonth: data.total / months,
    }))
    .sort((a, b) => b.total - a.total);
}

export function computeFinancialSummary(transactions: Transaction[]): FinancialSummary {
  const months = new Set(transactions.map((tx) => getMonthKey(tx.date)));
  const monthCount = months.size || 1;

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const tx of transactions) {
    if (tx.amount > 0) totalIncome += tx.amount;
    else totalExpenses += Math.abs(tx.amount);
  }

  const categories = computeCategoryBreakdown(transactions, 'expenses');
  const topCategory = categories[0]?.label || 'N/A';

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    avgMonthlyIncome: totalIncome / monthCount,
    avgMonthlyExpenses: totalExpenses / monthCount,
    topExpenseCategory: topCategory,
    monthCount,
    transactionCount: transactions.length,
  };
}

export function getRecentTransactions(transactions: Transaction[], limit = 20): Transaction[] {
  return [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}

export function filterTransactions(
  transactions: Transaction[],
  filters: {
    category?: TransactionCategory;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
    type?: 'income' | 'expense' | 'all';
  },
): Transaction[] {
  return transactions.filter((tx) => {
    if (filters.category && tx.category !== filters.category) return false;
    if (filters.search && !tx.concept.toLowerCase().includes(filters.search.toLowerCase()))
      return false;
    if (filters.dateFrom && tx.date < filters.dateFrom) return false;
    if (filters.dateTo && tx.date > filters.dateTo) return false;
    if (filters.type === 'income' && tx.amount <= 0) return false;
    if (filters.type === 'expense' && tx.amount >= 0) return false;
    return true;
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
