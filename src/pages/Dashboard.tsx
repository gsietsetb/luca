import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
} from 'lucide-react';
import type { Transaction } from '../lib/types';
import {
  computeMonthlyBreakdown,
  computeCategoryBreakdown,
  computeFinancialSummary,
  formatCurrency,
} from '../lib/analytics';
import StatCard from '../components/dashboard/StatCard';
import MonthlyChart from '../components/charts/MonthlyChart';
import CategoryChart from '../components/charts/CategoryChart';
import TopExpenses from '../components/dashboard/TopExpenses';
import SubscriptionTracker from '../components/dashboard/SubscriptionTracker';
import AIInsightsPanel from '../components/dashboard/AIInsights';
import TransactionList from '../components/TransactionList';

interface Props {
  transactions: Transaction[];
}

export default function Dashboard({ transactions }: Props) {
  const summary = useMemo(() => computeFinancialSummary(transactions), [transactions]);
  const monthly = useMemo(() => computeMonthlyBreakdown(transactions), [transactions]);
  const categories = useMemo(
    () => computeCategoryBreakdown(transactions, 'expenses'),
    [transactions],
  );

  const sources = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of transactions) {
      map.set(tx.source, (map.get(tx.source) || 0) + 1);
    }
    return Array.from(map.entries());
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Sources Banner */}
      {sources.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-dark-800/50 border border-dark-700 px-4 py-3">
          <span className="text-xs text-neutral">Fuentes:</span>
          {sources.map(([src, count]) => (
            <span key={src} className="inline-flex items-center gap-1.5 rounded-lg bg-dark-700 px-2.5 py-1 text-xs font-medium text-white">
              <div className={`h-2 w-2 rounded-full ${src === 'caixabank' ? 'bg-blue-400' : src === 'revolut' ? 'bg-purple-400' : 'bg-neutral'}`} />
              {src === 'caixabank' ? 'CaixaBank' : src === 'revolut' ? 'Revolut' : src.toUpperCase()}
              <span className="text-neutral">({count})</span>
            </span>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Ingresos totales"
          value={formatCurrency(summary.totalIncome)}
          subtitle={`Media ${formatCurrency(summary.avgMonthlyIncome)}/mes`}
          icon={<TrendingUp className="h-5 w-5 text-income" />}
          accent="income"
        />
        <StatCard
          title="Gastos totales"
          value={formatCurrency(summary.totalExpenses)}
          subtitle={`Media ${formatCurrency(summary.avgMonthlyExpenses)}/mes`}
          icon={<TrendingDown className="h-5 w-5 text-expense" />}
          accent="expense"
        />
        <StatCard
          title="Balance neto"
          value={formatCurrency(summary.netBalance)}
          subtitle={`${summary.monthCount} meses analizados`}
          icon={<Wallet className="h-5 w-5 text-luca-400" />}
          accent={summary.netBalance >= 0 ? 'income' : 'expense'}
        />
        <StatCard
          title="Transacciones"
          value={summary.transactionCount.toLocaleString('es-ES')}
          subtitle={`Top: ${summary.topExpenseCategory}`}
          icon={<Receipt className="h-5 w-5 text-neutral" />}
          accent="neutral"
        />
      </div>

      {/* AI Advisor */}
      <AIInsightsPanel transactions={transactions} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyChart data={monthly} />
        <CategoryChart data={categories} />
      </div>

      {/* Subscriptions + Top Expenses */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SubscriptionTracker transactions={transactions} />
        <TopExpenses transactions={transactions} />
      </div>

      {/* Full Transaction List */}
      <TransactionList transactions={transactions} />
    </div>
  );
}
