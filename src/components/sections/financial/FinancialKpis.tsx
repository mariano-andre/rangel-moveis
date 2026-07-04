import { KpiCard } from "@/components/ui/KpiCard";
import { formatBRL } from "@/lib/format";

interface FinancialKpisProps {
  revenue: number;
  expenses: number;
  profit: number;
  receivable: number;
  receivablePendingCount: number;
  revenueDeltaPercent: number;
  expensesDeltaPercent: number;
  profitDeltaPercent: number;
}

export function FinancialKpis({
  revenue,
  expenses,
  profit,
  receivable,
  receivablePendingCount,
  revenueDeltaPercent,
  expensesDeltaPercent,
  profitDeltaPercent,
}: FinancialKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      <KpiCard
        label="Faturamento"
        value={formatBRL(revenue)}
        delta={`↑ +${revenueDeltaPercent}% vs mês anterior`}
        deltaType="up"
      />
      <KpiCard
        label="Despesas"
        value={formatBRL(expenses)}
        valueColor="red"
        delta={`↑ +${expensesDeltaPercent}% vs mês anterior`}
        deltaType="down"
      />
      <KpiCard
        label="Lucro líquido"
        value={formatBRL(profit)}
        valueColor="green"
        delta={`↑ +${profitDeltaPercent}% vs mês anterior`}
        deltaType="up"
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
