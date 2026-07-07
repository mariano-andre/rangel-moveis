// Contrato entre frontend e backend.
// Cada interface reflete exatamente o formato que vem do banco de dados.
// Campos calculados (revenue, expenses, profit) não existem aqui —
// são derivados via calculations.ts a partir de transactions.

// ═══════════════════════════════════════════
// FINANCIAL
// ═══════════════════════════════════════════

export type TransactionType = "income" | "expense";

export type ExpenseCategoryLabel =
  | "Material"
  | "Mão de obra"
  | "Aluguel"
  | "Outros";

// Representa uma linha da tabela "transactions" no banco.
export interface Transaction {
  id: number;
  description: string;
  type: TransactionType;
  category?: ExpenseCategoryLabel; // nullable no banco — só preenchido em despesas
  date: string;                    // ISO: YYYY-MM-DD
  value: number;
}

// Derivado via calcExpensesByCategory() — não existe no banco.
export interface ExpenseCategory {
  label: string;
  value: number;
}

// Futuramente calculado no backend agrupando transactions por mês.
export interface MonthlyRevenue {
  month: string;
  value: number;
}

// Formato completo que a página Financial recebe.
// Apenas dados brutos — nada calculado.
export interface FinancialData {
  transactions: Transaction[];
  monthlyHistory: MonthlyRevenue[];
  receivable: number;
  receivablePendingCount: number;
}

// ═══════════════════════════════════════════
// PROJECTS — placeholder
// ═══════════════════════════════════════════

// export type ProjectStatus = "in_progress" | "waiting" | "completed" | "pending";
// export interface Project { ... }

// ═══════════════════════════════════════════
// EMPLOYEES — placeholder
// ═══════════════════════════════════════════

// export type ContractType = "clt" | "commission";
// export interface Employee { ... }

// ═══════════════════════════════════════════
// INVENTORY — placeholder
// ═══════════════════════════════════════════

// export interface InventoryItem { ... }