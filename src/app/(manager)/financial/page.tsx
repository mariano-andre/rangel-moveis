// Server Component — busca os dados do mock (futuro: backend) e passa
// para o FinancialClient, que gerencia toda a interatividade da página.

import { getTransactions } from "@/db/queries/financial";
import { FinancialClient } from "@/components/sections/financial/FinancialClient";

import { getProjects } from "@/db/queries/projects";

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default async function FinancialPage() {
  const transactions = await getTransactions();
  const projects = await getProjects();

  // Calculate receivable from pending projects
  const pendingProjects = projects.filter((p) =>
    p.status === "in_progress" || p.status === "waiting"
  );
  const receivable = pendingProjects.reduce((acc, p) => acc + p.value, 0);
  const receivablePendingCount = pendingProjects.length;

  // Calculate monthly history from income transactions (last 6 months)
  const incomes = transactions.filter((t) => t.type === "income");

  const monthlyHistory = [];
  const today = new Date();

  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthLabel = MONTHS[d.getMonth()];

    // Sum income for this month
    const sum = incomes
      .filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === d.getMonth() &&
          tDate.getFullYear() === d.getFullYear();
      })
      .reduce((acc, t) => acc + t.value, 0);

    monthlyHistory.push({ month: monthLabel, value: sum });
  }

  const data = {
    transactions,
    monthlyHistory,
    receivable,
    receivablePendingCount,
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-zinc-50">Financeiro</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Visão geral · Maio 2025
        </p>
      </div>

      {/* FinancialClient recebe os dados brutos e cuida do resto */}
      <FinancialClient
        initialTransactions={data.transactions}
        monthlyHistory={data.monthlyHistory}
        receivable={data.receivable}
        receivablePendingCount={data.receivablePendingCount}
      />
    </div>
  );
}
