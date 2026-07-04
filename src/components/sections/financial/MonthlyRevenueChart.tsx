import { Card, CardTitle } from "@/components/ui/Card";
import { MonthlyRevenue } from "@/lib/types";

interface MonthlyRevenueChartProps {
  history: MonthlyRevenue[];
}

export function MonthlyRevenueChart({ history }: MonthlyRevenueChartProps) {
  const maxValue = Math.max(...history.map((h) => h.value));
  const isLastMonthBest =
    history[history.length - 1].value === maxValue;

  return (
    <Card>
      <CardTitle>Faturamento mensal</CardTitle>
      <div className="flex items-end gap-1.5 h-14">
        {history.map((h, i) => {
          const isLast = i === history.length - 1;
          return (
            <div
              key={h.month}
              title={`${h.month}: R$ ${h.value.toLocaleString("pt-BR")}`}
              className={`flex-1 min-w-2 rounded-t-sm ${
                isLast ? "bg-amber-600" : "bg-amber-600/40"
              }`}
              style={{ height: `${(h.value / maxValue) * 100}%` }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-zinc-500 mt-1.5">
        {history.map((h) => (
          <span key={h.month}>{h.month}</span>
        ))}
      </div>
      {isLastMonthBest && (
        <p className="text-xs text-zinc-500 mt-3">
          Melhor mês dos últimos {history.length} meses.
        </p>
      )}
    </Card>
  );
}
