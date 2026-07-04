export type TransactionType = "income" | "expense";

export type ExpenseCategoryLabel =
  | "Material"
  | "Mão de obra"
  | "Aluguel"
  | "Outros";

export interface Transaction {
  id: number;
  description: string;
  type: TransactionType;
  category?: ExpenseCategoryLabel; // só obrigatório em despesas
  date: string;
  value: number;
}

export interface ExpenseCategory {
  label: string;
  value: number;
}

export interface MonthlyRevenue {
  month: string;
  value: number;
}

export interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  receivable: number;
  receivablePendingCount: number;
  revenueDeltaPercent: number;
  expensesDeltaPercent: number;
  profitDeltaPercent: number;
  expensesByCategory: ExpenseCategory[];
  monthlyHistory: MonthlyRevenue[];
  transactions: Transaction[];
}
