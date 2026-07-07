"use client";

import { useState } from "react";
import { Transaction, MonthlyRevenue } from "@/lib/types";
import { calcRevenue, calcExpenses, calcExpensesByCategory } from "@/lib/calculations";
import { FinancialKpis } from "@/components/sections/financial/FinancialKpis";
import { ExpensesByCategory } from "@/components/sections/financial/ExpensesByCategory";
import { MonthlyRevenueChart } from "@/components/sections/financial/MonthlyRevenueChart";
import { TransactionsTable } from "@/components/sections/financial/TransactionsTable";
import { TransactionModal } from "@/components/sections/financial/TransactionModal";

interface FinancialClientProps {
  initialTransactions: Transaction[];
  monthlyHistory: MonthlyRevenue[];
  receivable: number;
  receivablePendingCount: number;
}

export function FinancialClient({
  initialTransactions,
  monthlyHistory,
  receivable,
  receivablePendingCount,
}: FinancialClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [modalOpen, setModalOpen] = useState(false);

  const revenue            = calcRevenue(transactions);
  const expenses           = calcExpenses(transactions);
  const profit             = revenue - expenses;
  const expensesByCategory = calcExpensesByCategory(transactions);

  function handleAddTransaction(data: Omit<Transaction, "id">) {
    const newTransaction: Transaction = {
      ...data,
      id: transactions.length > 0
        ? Math.max(...transactions.map((t) => t.id)) + 1
        : 1,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }

  // Substitui a transação editada mantendo sua posição no array
  function handleEditTransaction(updated: Transaction) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
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