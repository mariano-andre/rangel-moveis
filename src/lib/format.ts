// ── Helpers ──
// Funções utilitárias que hoje operam sobre o mock

import { Transaction } from "./types/index.ts";
import { TransactionType } from "./types/index.ts";

export function getTotalByType(
  transactions: Transaction[],
  type: TransactionType,
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.value, 0);
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
