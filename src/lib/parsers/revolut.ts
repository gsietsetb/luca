import Papa from 'papaparse';
import type { Transaction } from '../types';
import { categorizeTransaction } from '../categorizer';

interface RevolutRow {
  Date: string;
  Description: string;
  'Money out': string;
  'Money in': string;
  Balance: string;
}

function parseRevolutAmount(raw: string): number {
  if (!raw || raw.trim() === '') return 0;
  return parseFloat(raw.replace(/[€$£,\s]/g, '').replace(',', '.')) || 0;
}

function parseRevolutDate(raw: string): Date | null {
  if (!raw) return null;
  const months: Record<string, number> = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sept: 8, sep: 8, oct: 9, nov: 10, dic: 11,
    jan: 0, apr: 3, aug: 7, dec: 11,
  };
  const parts = raw.trim().split(/\s+/);
  if (parts.length < 3) return null;
  
  const day = parseInt(parts[0]);
  const monthStr = parts[1].toLowerCase().replace(/\./g, '');
  const year = parseInt(parts[2]);
  const month = months[monthStr];
  
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(year, month, day);
}

export function parseRevolutCSV(csvText: string): Transaction[] {
  const sections = csvText.split(/\n(?=Transactions for |Summary for )/);
  const transactions: Transaction[] = [];
  
  for (const section of sections) {
    if (!section.includes('Date,Description,Money out,Money in,Balance')) continue;
    
    const headerIdx = section.indexOf('Date,Description,Money out,Money in,Balance');
    const csvPart = section.slice(headerIdx);
    
    const result = Papa.parse<RevolutRow>(csvPart, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    for (let i = 0; i < result.data.length; i++) {
      const row = result.data[i];
      if (!row.Date || !row.Description) continue;
      
      const date = parseRevolutDate(row.Date);
      if (!date) continue;
      
      if (row.Description.toLowerCase().includes('interés neto pagado')) continue;
      
      const moneyOut = parseRevolutAmount(row['Money out']);
      const moneyIn = parseRevolutAmount(row['Money in']);
      const amount = moneyIn > 0 ? moneyIn : -moneyOut;
      
      if (amount === 0) continue;
      
      const concept = row.Description.replace(/"/g, '').trim();
      
      transactions.push({
        id: `revolut-${i}-${row.Date}`,
        date,
        concept,
        amount,
        balance: parseRevolutAmount(row.Balance),
        category: categorizeTransaction(concept, amount),
        source: 'revolut',
        originalRow: `${row.Date},${row.Description},${row['Money out']},${row['Money in']}`,
      });
    }
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}
