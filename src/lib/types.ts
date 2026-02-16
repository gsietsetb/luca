export type TransactionCategory =
  | 'food'
  | 'supermarket'
  | 'transport'
  | 'housing'
  | 'shopping'
  | 'health'
  | 'entertainment'
  | 'subscriptions'
  | 'travel'
  | 'taxes'
  | 'transfers'
  | 'income'
  | 'diving'
  | 'technology'
  | 'other';

export interface Transaction {
  id: string;
  date: Date;
  concept: string;
  amount: number; // negative = expense, positive = income
  balance: number;
  category: TransactionCategory;
  subcategory?: string;
  source: 'caixabank' | 'revolut' | 'ing' | 'manual';
  originalRow?: string;
}

export interface PayrollEntry {
  id: string;
  company: string;
  period: string;
  periodStart: Date;
  periodEnd: Date;
  grossSalary: number;
  netSalary: number;
  baseSalary: number;
  irpfRate: number;
  irpfAmount: number;
  ssContribution: number;
  extras: { concept: string; amount: number }[];
  deductions: { concept: string; rate: number; amount: number }[];
}

export interface MonthlyBreakdown {
  month: string; // YYYY-MM
  label: string; // "Ene 2025"
  income: number;
  expenses: number;
  net: number;
  byCategory: Record<TransactionCategory, number>;
  transactionCount: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  label: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
  icon: string;
  avgPerMonth: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  avgMonthlyIncome: number;
  avgMonthlyExpenses: number;
  topExpenseCategory: string;
  monthCount: number;
  transactionCount: number;
}

export interface FileUpload {
  id: string;
  name: string;
  type: 'csv' | 'pdf';
  source: Transaction['source'];
  status: 'parsing' | 'done' | 'error';
  transactions: Transaction[];
  error?: string;
  uploadedAt: Date;
}

export const CATEGORY_CONFIG: Record<
  TransactionCategory,
  { label: string; color: string; icon: string }
> = {
  food: { label: 'Restaurantes y bares', color: '#f59e0b', icon: 'UtensilsCrossed' },
  supermarket: { label: 'Supermercado', color: '#84cc16', icon: 'ShoppingCart' },
  transport: { label: 'Transporte', color: '#3b82f6', icon: 'Car' },
  housing: { label: 'Vivienda', color: '#8b5cf6', icon: 'Home' },
  shopping: { label: 'Compras', color: '#ec4899', icon: 'ShoppingBag' },
  health: { label: 'Salud y farmacia', color: '#10b981', icon: 'Heart' },
  entertainment: { label: 'Ocio', color: '#f97316', icon: 'Music' },
  subscriptions: { label: 'Suscripciones', color: '#06b6d4', icon: 'Repeat' },
  travel: { label: 'Viajes', color: '#14b8a6', icon: 'Plane' },
  taxes: { label: 'Impuestos', color: '#ef4444', icon: 'Receipt' },
  transfers: { label: 'Transferencias', color: '#6b7280', icon: 'ArrowLeftRight' },
  income: { label: 'Ingresos', color: '#10b981', icon: 'TrendingUp' },
  diving: { label: 'Buceo', color: '#0ea5e9', icon: 'Waves' },
  technology: { label: 'Tecnología', color: '#a855f7', icon: 'Laptop' },
  other: { label: 'Otros', color: '#9ca3af', icon: 'MoreHorizontal' },
};

export const MONTH_LABELS_ES: Record<number, string> = {
  0: 'Ene', 1: 'Feb', 2: 'Mar', 3: 'Abr', 4: 'May', 5: 'Jun',
  6: 'Jul', 7: 'Ago', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dic',
};
