import type { Transaction } from '../../lib/types';
import { CATEGORY_CONFIG } from '../../lib/types';
import { formatCurrency, formatDate } from '../../lib/analytics';

interface Props {
  transactions: Transaction[];
  limit?: number;
}

export default function TopExpenses({ transactions, limit = 10 }: Props) {
  const topExpenses = [...transactions]
    .filter((tx) => tx.amount < 0)
    .sort((a, b) => a.amount - b.amount)
    .slice(0, limit);

  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Top gastos</h3>
      <div className="space-y-3">
        {topExpenses.map((tx, i) => {
          const catCfg = CATEGORY_CONFIG[tx.category];
          return (
            <div key={tx.id} className="flex items-center gap-3">
              <span className="w-5 text-right text-xs font-bold text-neutral">
                {i + 1}
              </span>
              <div
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: catCfg.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{tx.concept}</p>
                <p className="text-[10px] text-neutral">{formatDate(tx.date)}</p>
              </div>
              <span className="text-sm font-semibold text-expense">
                {formatCurrency(tx.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
