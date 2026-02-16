import { supabase, isSupabaseConfigured } from './supabase';
import type { Transaction } from './types';

/**
 * Save an upload record + its transactions to Supabase.
 * Falls back to localStorage if not authenticated.
 */
export async function saveUpload(
  userId: string,
  filename: string,
  source: string,
  transactions: Transaction[]
) {
  if (!isSupabaseConfigured()) {
    saveToLocalStorage(transactions);
    return { uploadId: null, saved: transactions.length };
  }

  const dateRange = transactions.reduce(
    (acc, t) => ({
      from: t.date < acc.from ? t.date : acc.from,
      to: t.date > acc.to ? t.date : acc.to,
    }),
    { from: transactions[0]?.date ?? new Date(), to: transactions[0]?.date ?? new Date() }
  );

  // Create upload record
  const { data: upload, error: uploadErr } = await supabase
    .from('luca_uploads')
    .insert({
      user_id: userId,
      filename,
      source,
      transaction_count: transactions.length,
      date_range_from: dateRange.from instanceof Date
        ? dateRange.from.toISOString().split('T')[0]
        : String(dateRange.from),
      date_range_to: dateRange.to instanceof Date
        ? dateRange.to.toISOString().split('T')[0]
        : String(dateRange.to),
    })
    .select('id')
    .single();

  if (uploadErr) {
    console.error('Error saving upload:', uploadErr);
    saveToLocalStorage(transactions);
    return { uploadId: null, saved: 0 };
  }

  // Batch insert transactions (upsert to skip duplicates)
  const rows = transactions.map((t) => ({
    user_id: userId,
    upload_id: upload.id,
    date: t.date instanceof Date ? t.date.toISOString().split('T')[0] : String(t.date),
    concept: t.concept,
    amount: t.amount,
    balance: t.balance ?? null,
    category: t.category,
    source: t.source ?? source,
    is_income: t.amount > 0,
  }));

  // Insert in batches of 500
  let saved = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const { error, count } = await supabase
      .from('luca_transactions')
      .upsert(batch, {
        onConflict: 'user_id,date,concept,amount,source',
        ignoreDuplicates: true,
        count: 'exact',
      });
    if (error) console.error('Batch error:', error);
    else saved += count ?? batch.length;
  }

  return { uploadId: upload.id, saved };
}

/**
 * Load all transactions for a user from Supabase.
 */
export async function loadTransactions(userId: string): Promise<Transaction[]> {
  if (!isSupabaseConfigured()) {
    return loadFromLocalStorage();
  }

  const { data, error } = await supabase
    .from('luca_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(5000);

  if (error) {
    console.error('Error loading transactions:', error);
    return loadFromLocalStorage();
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    date: new Date(row.date),
    concept: row.concept,
    amount: Number(row.amount),
    balance: row.balance ? Number(row.balance) : 0,
    category: row.category,
    source: row.source,
  }));
}

/**
 * Load uploads history for a user.
 */
export async function loadUploads(userId: string) {
  if (!isSupabaseConfigured()) return [];

  const { data } = await supabase
    .from('luca_uploads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return data ?? [];
}

/**
 * Save AI analysis result.
 */
export async function saveAnalysis(userId: string, result: unknown, transactionCount: number) {
  if (!isSupabaseConfigured()) return;

  await supabase.from('luca_analyses').insert({
    user_id: userId,
    result,
    transaction_count: transactionCount,
  });
}

// ---- localStorage fallback for non-authenticated users ----

const LS_KEY = 'luca_transactions';

function saveToLocalStorage(transactions: Transaction[]) {
  try {
    const existing = loadFromLocalStorage();
    const merged = mergeTransactions(existing, transactions);
    localStorage.setItem(LS_KEY, JSON.stringify(merged));
  } catch {
    console.warn('localStorage full or unavailable');
  }
}

function loadFromLocalStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((t: Record<string, unknown>) => ({
      ...t,
      date: new Date(t.date as string),
    }));
  } catch {
    return [];
  }
}

function mergeTransactions(existing: Transaction[], incoming: Transaction[]): Transaction[] {
  const seen = new Set(existing.map((t) => `${t.date}-${t.concept}-${t.amount}`));
  const unique = incoming.filter((t) => !seen.has(`${t.date}-${t.concept}-${t.amount}`));
  return [...existing, ...unique];
}
