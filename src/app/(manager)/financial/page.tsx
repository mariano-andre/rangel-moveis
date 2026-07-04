import { financialMock } from "@/content/financial";
import { FinancialKpis } from "@/components/sections/financial/FinancialKpis";
import { ExpensesByCategory } from "@/components/sections/financial/ExpensesByCategory";
import { MonthlyRevenueChart } from "@/components/sections/financial/MonthlyRevenueChart";
import { TransactionsTable } from "@/components/sections/financial/TransactionsTable";

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

      {/* KPIs */}
      <FinancialKpis
        revenue={data.revenue}
        expenses={data.expenses}
        profit={data.profit}
        receivable={data.receivable}
        receivablePendingCount={data.receivablePendingCount}
        revenueDeltaPercent={data.revenueDeltaPercent}
        expensesDeltaPercent={data.expensesDeltaPercent}
        profitDeltaPercent={data.profitDeltaPercent}
      />

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <ExpensesByCategory categories={data.expensesByCategory} />
        <MonthlyRevenueChart history={data.monthlyHistory} />
      </div>

      {/* Transactions */}
      <TransactionsTable transactions={data.transactions} />
    </div>
  );
}
