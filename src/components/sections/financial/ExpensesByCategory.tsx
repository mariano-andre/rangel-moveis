import { Card, CardTitle } from "@/components/ui/Card";
import { ExpenseCategory } from "@/lib/types";
import { formatBRL } from "@/lib/format";

interface ExpensesByCategoryProps {
  categories: ExpenseCategory[];
}

const barColors = ["bg-amber-600", "bg-zinc-500", "bg-zinc-600", "bg-zinc-700"];

export function ExpensesByCategory({ categories }: ExpensesByCategoryProps) {
  const maxValue = Math.max(...categories.map((c) => c.value));

  return (
    <Card>
      <CardTitle>Despesas por categoria</CardTitle>
      <div className="space-y-2.5">
        {categories.map((cat, i) => (
          <div key={cat.label} className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 w-24 shrink-0">
              {cat.label}
            </span>
            <div className="flex-1 h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColors[i % barColors.length]}`}
                style={{ width: `${(cat.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-zinc-300 w-16 text-right">
              {formatBRL(cat.value)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
