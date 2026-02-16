import { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Filter,
} from 'lucide-react';
import type { Transaction, TransactionCategory } from '../lib/types';
import { CATEGORY_CONFIG } from '../lib/types';
import { formatCurrency, formatDate, filterTransactions } from '../lib/analytics';

interface Props {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | ''>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);

  const filtered = useMemo(
    () =>
      filterTransactions(transactions, {
        search: search || undefined,
        category: selectedCategory || undefined,
        type: typeFilter === 'all' ? undefined : typeFilter,
      }),
    [transactions, search, selectedCategory, typeFilter],
  );

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-800/50">
      <div className="flex items-center justify-between border-b border-dark-700 p-4">
        <h3 className="text-lg font-semibold text-white">
          Transacciones{' '}
          <span className="text-sm font-normal text-neutral">({filtered.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-dark-600 bg-dark-700 py-2 pl-9 pr-3 text-sm text-white placeholder-neutral outline-none focus:border-luca-500 w-48"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-lg border p-2 transition-colors ${
              showFilters ? 'border-luca-500 bg-luca-500/10 text-luca-400' : 'border-dark-600 bg-dark-700 text-neutral hover:text-white'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 border-b border-dark-700 p-4">
          <div className="flex gap-1">
            {(['all', 'expense', 'income'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === t
                    ? 'bg-luca-500/20 text-luca-400'
                    : 'bg-dark-700 text-neutral hover:text-white'
                }`}
              >
                {t === 'all' ? 'Todos' : t === 'income' ? 'Ingresos' : 'Gastos'}
              </button>
            ))}
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TransactionCategory | '')}
            className="rounded-lg border border-dark-600 bg-dark-700 px-3 py-1.5 text-xs text-white outline-none focus:border-luca-500"
          >
            <option value="">Todas las categorías</option>
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="divide-y divide-dark-700/50">
        {visible.map((tx) => {
          const catCfg = CATEGORY_CONFIG[tx.category];
          return (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-dark-700/30"
            >
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: catCfg.color + '20' }}
              >
                {tx.amount > 0 ? (
                  <TrendingUp className="h-4 w-4" style={{ color: catCfg.color }} />
                ) : (
                  <TrendingDown className="h-4 w-4" style={{ color: catCfg.color }} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{tx.concept}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral">{formatDate(tx.date)}</span>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: catCfg.color + '20',
                      color: catCfg.color,
                    }}
                  >
                    {catCfg.label}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    tx.amount > 0 ? 'text-income' : 'text-expense'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}
                  {formatCurrency(tx.amount)}
                </p>
                <p className="text-[10px] text-neutral">Saldo: {formatCurrency(tx.balance)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount((v) => v + 50)}
          className="flex w-full items-center justify-center gap-2 border-t border-dark-700 py-3 text-sm text-luca-400 transition-colors hover:bg-dark-700/30"
        >
          <ChevronDown className="h-4 w-4" />
          Ver más ({filtered.length - visibleCount} restantes)
        </button>
      )}
    </div>
  );
}
