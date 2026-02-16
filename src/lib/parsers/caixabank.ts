import Papa from 'papaparse';
import type { Transaction } from '../types';
import { categorizeTransaction } from '../categorizer';

interface CaixaBankRow {
  Concepto: string;
  Fecha: string;
  Importe: string;
  Saldo: string;
}

function parseSpanishAmount(raw: string): number {
  const cleaned = raw.replace('EUR', '').trim().replace(/\./g, '').replace(',', '.');
  const sign = cleaned.startsWith('+') ? 1 : cleaned.startsWith('-') ? -1 : 1;
  const abs = parseFloat(cleaned.replace(/^[+-]/, ''));
  return sign * abs;
}

function parseSpanishDate(raw: string): Date {
  const [day, month, year] = raw.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function parseCaixaBankCSV(csvText: string): Transaction[] {
  const result = Papa.parse<CaixaBankRow>(csvText, {
    header: true,
    delimiter: ';',
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (result.errors.length > 0) {
    console.warn('CSV parse warnings:', result.errors);
  }

  return result.data
    .filter((row) => row.Concepto && row.Fecha && row.Importe)
    .map((row, index) => {
      const amount = parseSpanishAmount(row.Importe);
      const concept = row.Concepto.trim();

      return {
        id: `caixa-${index}-${row.Fecha}`,
        date: parseSpanishDate(row.Fecha),
        concept,
        amount,
        balance: parseSpanishAmount(row.Saldo),
        category: categorizeTransaction(concept, amount),
        source: 'caixabank' as const,
        originalRow: `${row.Concepto};${row.Fecha};${row.Importe};${row.Saldo}`,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
