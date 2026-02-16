import { Repeat } from 'lucide-react';
import type { Transaction } from '../../lib/types';
import { formatCurrency } from '../../lib/analytics';

interface DetectedSubscription {
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  lastCharge: Date;
  occurrences: number;
}

function detectSubscriptions(transactions: Transaction[]): DetectedSubscription[] {
  const patterns = new Map<string, { amounts: number[]; dates: Date[] }>();

  const subs = transactions.filter(
    (tx) => tx.category === 'subscriptions' && tx.amount < 0,
  );

  for (const tx of subs) {
    const key = tx.concept.toLowerCase().replace(/[^a-z]/g, '');
    if (!patterns.has(key)) patterns.set(key, { amounts: [], dates: [] });
    const p = patterns.get(key)!;
    p.amounts.push(Math.abs(tx.amount));
    p.dates.push(tx.date);
  }

  return Array.from(patterns.entries())
    .filter(([, data]) => data.amounts.length >= 2)
    .map(([, data]) => {
      const avgAmount = data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length;
      const sortedDates = data.dates.sort((a, b) => b.getTime() - a.getTime());
      const name = matchSubscriptionName(data.amounts[0], sortedDates[0]) || 'Suscripción';

      return {
        name,
        amount: Math.round(avgAmount * 100) / 100,
        frequency: 'monthly' as const,
        lastCharge: sortedDates[0],
        occurrences: data.amounts.length,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

function matchSubscriptionName(amount: number, _date: Date): string {
  if (Math.abs(amount - 17.99) < 0.5) return 'Spotify Premium';
  if (Math.abs(amount - 0.99) < 0.5) return 'Apple iCloud';
  if (amount >= 18 && amount <= 20) return 'ChatGPT Plus';
  if (Math.abs(amount - 12) < 0.5) return 'Grit Ventures';
  if (Math.abs(amount - 2.36) < 0.5) return 'Apple One';
  return 'Suscripción';
}

interface Props {
  transactions: Transaction[];
}

export default function SubscriptionTracker({ transactions }: Props) {
  const subscriptions = detectSubscriptions(transactions);
  const monthlyTotal = subscriptions.reduce((sum, s) => sum + s.amount, 0);
  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-800/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Suscripciones</h3>
        <div className="text-right">
          <p className="text-sm font-semibold text-expense">{formatCurrency(monthlyTotal)}/mes</p>
          <p className="text-[10px] text-neutral">{formatCurrency(yearlyTotal)}/año</p>
        </div>
      </div>
      <div className="space-y-3">
        {subscriptions.map((sub, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cat-subscriptions/20">
              <Repeat className="h-3.5 w-3.5 text-cat-subscriptions" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">{sub.name}</p>
              <p className="text-[10px] text-neutral">{sub.occurrences} cargos detectados</p>
            </div>
            <span className="text-sm font-medium text-white">{formatCurrency(sub.amount)}</span>
          </div>
        ))}
        {subscriptions.length === 0 && (
          <p className="text-center text-sm text-neutral py-4">
            Sube más datos para detectar suscripciones
          </p>
        )}
      </div>
    </div>
  );
}
