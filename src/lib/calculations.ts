import { InventoryItem, InventoryStatus, Transaction } from "@/lib/types";

// Soma todas as entradas
export function calcRevenue(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.value, 0);
}

// Soma todas as saídas
export function calcExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.value, 0);
}

// Agrupa despesas por categoria, calculado a partir das transações
export function calcExpensesByCategory(transactions: Transaction[]) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
    const label = t.category ?? "Outros";
    acc[label] = (acc[label] ?? 0) + t.value;
    return acc;
  }, {});

  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}

export function calcInventoryStatus(item: InventoryItem): InventoryStatus {
  if (item.quantity <= item.minimum * 0.5) return "critical";
  if (item.quantity < item.minimum) return "low";
  return "ok";
}
