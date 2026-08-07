// Exibe os 4 KPIs principais do módulo financeiro.
// Recebe valores já calculados via props — não faz cálculos, só formata e exibe.

import { KpiCard } from "../../ui/KpiCard.tsx";
import { formatBRL } from "../../../lib/format.ts";

interface FinancialKpisProps {
  revenue: number;
  expenses: number;
  profit: number;
  receivable: number;
  receivablePendingCount: number;
}

export function FinancialKpis({
  revenue,
  expenses,
  profit,
  receivable,
  receivablePendingCount,
}: FinancialKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <KpiCard
        label="Faturamento"
        value={formatBRL(revenue)}
      />
      <KpiCard
        label="Despesas"
        value={formatBRL(expenses)}
        valueColor="red"
      />
      <KpiCard
        label="Lucro líquido"
        value={formatBRL(profit)}
        valueColor="green"
      />
      <KpiCard
        label="A receber"
        value={formatBRL(receivable)}
        valueColor="amber"
        delta={`${receivablePendingCount} pagamentos pendentes`}
        deltaType="neutral"
      />
    </div>
  );
}
