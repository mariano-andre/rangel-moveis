"use client";

import { useState } from "react";
import { MonthlyRevenue, Transaction } from "@/lib/types";
import {
  calcExpenses,
  calcExpensesByCategory,
  calcRevenue,
} from "@/lib/calculations";
import { FinancialKpis } from "@/components/sections/financial/FinancialKpis";
import { ExpensesByCategory } from "@/components/sections/financial/ExpensesByCategory";
import { MonthlyRevenueChart } from "@/components/sections/financial/MonthlyRevenueChart";
import { TransactionsTable } from "@/components/sections/financial/TransactionsTable";
import { TransactionModal } from "@/components/sections/financial/TransactionModal";
import { addTransactionAction, editTransactionAction } from "@/app/actions";

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
  const [transactions, setTransactions] = useState<Transaction[]>(
    sortByDate(initialTransactions),
  );
  const [modalOpen, setModalOpen] = useState(false);

  const revenue = calcRevenue(transactions);
  const expenses = calcExpenses(transactions);
  const profit = revenue - expenses;
  const expensesByCategory = calcExpensesByCategory(transactions);

  async function handleAddTransaction(data: Omit<Transaction, "id">) {
    const optimisticId = transactions.length > 0
      ? Math.max(...transactions.map((t) => t.id)) + 1
      : 1;
    const newTransaction: Transaction = { ...data, id: optimisticId };

    setTransactions((prev) => sortByDate([...prev, newTransaction]));

    try {
      const created = await addTransactionAction(data);
      setTransactions((prev) =>
        sortByDate(prev.map((t) => (t.id === optimisticId ? created : t)))
      );
    } catch (e) {
      console.error(e);
      setTransactions((prev) => prev.filter((t) => t.id !== optimisticId));
    }
  }

  async function handleEditTransaction(updated: Transaction) {
    const original = transactions.find((t) => t.id === updated.id);
    if (!original) return;

    setTransactions((prev) =>
      sortByDate(prev.map((t) => (t.id === updated.id ? updated : t)))
    );

    try {
      const { id, ...data } = updated;
      const result = await editTransactionAction(id, data);
      setTransactions((prev) =>
        sortByDate(prev.map((t) => (t.id === updated.id ? result : t)))
      );
    } catch (e) {
      console.error(e);
      setTransactions((prev) =>
        sortByDate(prev.map((t) => (t.id === updated.id ? original : t)))
      );
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
        transactions={transactions}
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
