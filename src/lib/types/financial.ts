export type TransactionType = "income" | "expense";

export type ExpenseCategoryLabel =
  | "Material"
  | "Mão de obra"
  | "Aluguel"
  | "Outros";

// Linha da tabela "transactions" no banco
export interface Transaction {
  id: number;
  description: string;
  type: TransactionType;
  category?: ExpenseCategoryLabel; // nullable — só preenchido em despesas
  date: string; // ISO: YYYY-MM-DD
  value: number;
}

// Derivado via calcExpensesByCategory() — não existe no banco
export interface ExpenseCategory {
  label: string;
  value: number;
}

// Futuramente calculado no backend agrupando transactions por mês
export interface MonthlyRevenue {
  month: string;
  value: number;
}

export interface FinancialData {
  transactions: Transaction[];
  monthlyHistory: MonthlyRevenue[];
  receivable: number;
  receivablePendingCount: number;
}
