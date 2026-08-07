/**
 * FinancialClient.tsx
 *
 * Client component for managing Transactions and Financial KPIs.
 *
 * Clean Code Principles Applied:
 * - Single Responsibility Principle (SRP): UI logic is separated from optimistic state updates.
 * - Extracted sorting and state management to the `useOptimisticData` hook where applicable.
 */

"use client";

import { useState } from "react";
import { MonthlyRevenue, Transaction } from "../../../lib/types/index.ts";
import {
  calcExpenses,
  calcExpensesByCategory,
  calcRevenue,
} from "../../../lib/calculations.ts";
import { FinancialKpis } from "./FinancialKpis.tsx";
import { ExpensesByCategory } from "./ExpensesByCategory.tsx";
import { MonthlyRevenueChart } from "./MonthlyRevenueChart.tsx";
import { TransactionsTable } from "./TransactionsTable.tsx";
import { TransactionModal } from "./TransactionModal.tsx";
import {
  addTransactionAction,
  editTransactionAction,
} from "../../../app/actions.ts";
import { useOptimisticData } from "../../../lib/hooks/useOptimisticData.ts";

interface FinancialClientProps {
  initialTransactions: Transaction[];
  monthlyHistory: MonthlyRevenue[];
  receivable: number;
  receivablePendingCount: number;
}

// Ordena por data decrescente (mais recente no topo)
function sortByDate(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function FinancialClient({
  initialTransactions,
  monthlyHistory,
  receivable,
  receivablePendingCount,
}: FinancialClientProps) {
  // Use generic hook to manage transactions state
  const {
    data: transactions,
    optimisticCreate,
    optimisticUpdate,
  } = useOptimisticData<Transaction>(sortByDate(initialTransactions));

  const [modalOpen, setModalOpen] = useState(false);

  // Derived state (calculated directly from the transactions array)
  const revenue = calcRevenue(transactions);
  const expenses = calcExpenses(transactions);
  const profit = revenue - expenses;
  const expensesByCategory = calcExpensesByCategory(transactions);

  /**
   * Optimistically add a transaction.
   */
  async function handleAddTransaction(data: Omit<Transaction, "id">) {
    const temporaryId = transactions.length > 0
      ? Math.max(...transactions.map((t) => t.id)) + 1
      : 1;

    try {
      await optimisticCreate(data, addTransactionAction, temporaryId);
    } catch (_e) {
      // Automatic rollback inside useOptimisticData
    }
  }

  /**
   * Optimistically edit a transaction.
   */
  async function handleEditTransaction(updated: Transaction) {
    try {
      const { id, ...data } = updated;
      await optimisticUpdate(
        id,
        data,
        (actionId, updatedData) =>
          editTransactionAction(actionId as number, updatedData),
      );
    } catch (_e) {
      // Automatic rollback inside useOptimisticData
    }
  }

  return (
    <>
      <FinancialKpis
        revenue={revenue}
        expenses={expenses}
        profit={profit}
        receivable={receivable}
        receivablePendingCount={receivablePendingCount}
      />

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <ExpensesByCategory categories={expensesByCategory} />
        <MonthlyRevenueChart history={monthlyHistory} />
      </div>

      <TransactionsTable
        transactions={sortByDate(transactions)} // ensure we keep sort if dates changed
        onAddClick={() => setModalOpen(true)}
        onEdit={handleEditTransaction}
      />

      {modalOpen && (
        <TransactionModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </>
  );
}
