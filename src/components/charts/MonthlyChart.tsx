import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { MonthlyBreakdown } from '../../lib/types';
import { formatCurrency } from '../../lib/analytics';

interface Props {
  data: MonthlyBreakdown[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-dark-600 bg-dark-800 p-3 shadow-xl">
      <p className="mb-2 text-sm font-semibold text-white">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-neutral">{entry.name}:</span>
          <span className="font-medium text-white">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function MonthlyChart({ data }: Props) {
  const chartData = data.map((m) => ({
    name: m.label,
    Ingresos: Math.round(m.income * 100) / 100,
    Gastos: Math.round(m.expenses * 100) / 100,
  }));

  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Ingresos vs Gastos</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252847" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#252847' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#252847' }}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 12 }}
              formatter={(value) => <span className="text-sm text-neutral">{value}</span>}
            />
            <Bar dataKey="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Gastos" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
