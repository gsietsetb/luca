import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryBreakdown } from '../../lib/types';
import { formatCurrency } from '../../lib/analytics';

interface Props {
  data: CategoryBreakdown[];
  maxItems?: number;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-dark-600 bg-dark-800 p-3 shadow-xl">
      <p className="text-sm font-semibold text-white">{d.label}</p>
      <p className="text-sm text-neutral">
        {formatCurrency(d.total)} ({d.percentage.toFixed(1)}%)
      </p>
      <p className="text-xs text-neutral">{d.count} transacciones</p>
    </div>
  );
}

export default function CategoryChart({ data, maxItems = 8 }: Props) {
  const top = data.slice(0, maxItems);
  const otherTotal = data.slice(maxItems).reduce((s, d) => s + d.total, 0);
  const otherCount = data.slice(maxItems).reduce((s, d) => s + d.count, 0);

  const chartData =
    otherTotal > 0
      ? [
          ...top,
          {
            category: 'other' as const,
            label: 'Otros',
            total: otherTotal,
            count: otherCount,
            percentage: (otherTotal / data.reduce((s, d) => s + d.total, 0)) * 100,
            color: '#9ca3af',
            icon: 'MoreHorizontal',
            avgPerMonth: 0,
          },
        ]
      : top;

  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Gastos por categoría</h3>
      <div className="flex items-center gap-6">
        <div className="h-56 w-56 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                dataKey="total"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {chartData.map((d) => (
            <div key={d.category} className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="flex-1 text-sm text-neutral truncate">{d.label}</span>
              <span className="text-sm font-medium text-white">{formatCurrency(d.total)}</span>
              <span className="w-12 text-right text-xs text-neutral">{d.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
