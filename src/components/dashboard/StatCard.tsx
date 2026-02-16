import { type ReactNode } from 'react';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  accent?: 'income' | 'expense' | 'neutral' | 'luca';
}

const accentColors = {
  income: 'text-income',
  expense: 'text-expense',
  neutral: 'text-neutral',
  luca: 'text-luca-400',
};

const accentBg = {
  income: 'bg-income/10',
  expense: 'bg-expense/10',
  neutral: 'bg-dark-600',
  luca: 'bg-luca-500/10',
};

export default function StatCard({ title, value, subtitle, icon, trend, accent = 'neutral' }: Props) {
  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-5 transition-all hover:border-dark-600">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${accentColors[accent]}`}>{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-neutral">{subtitle}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ${accentBg[accent]}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={`text-xs font-medium ${trend.value >= 0 ? 'text-income' : 'text-expense'}`}
          >
            {trend.value >= 0 ? '+' : ''}
            {trend.value.toFixed(1)}%
          </span>
          <span className="text-xs text-neutral">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
