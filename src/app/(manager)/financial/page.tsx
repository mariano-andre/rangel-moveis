// src/app/(manager)/financial/page.tsx
//
// Server Component — busca os dados do mock (futuro: backend) e passa
// para o FinancialClient, que gerencia toda a interatividade da página.

import { financialMock } from "@/content/financial";
import { FinancialClient } from "@/components/sections/financial/FinancialClient";

export default function FinancialPage() {
  const data = financialMock;

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
