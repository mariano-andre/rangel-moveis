import { Card, CardTitle } from "@/components/ui/Card.tsx";
import { ExpenseCategory } from "@/lib/types/index.ts";
import { formatBRL } from "@/lib/format.ts";

interface ExpensesByCategoryProps {
  categories: ExpenseCategory[];
}

const barColors = [
  "bg-brand",
  "bg-text-secondary",
  "bg-text-secondary/80",
  "bg-text-secondary/60",
];

export function ExpensesByCategory({ categories }: ExpensesByCategoryProps) {
  const sorted = [...categories].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sorted.map((c) => c.value));

  return (
    <Card>
      <CardTitle>Despesas por categoria</CardTitle>
      <div className="space-y-2.5">
        {sorted.map((cat, i) => (
          <div key={cat.label} className="flex items-center gap-2">
            <span className="text-xs text-text-secondary w-24 shrink-0">
              {cat.label}
            </span>
            <div className="flex-1 h-1.5 bg-bg-card rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  barColors[i % barColors.length]
                }`}
                style={{ width: `${(cat.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-primary/80 w-16 text-right">
              {formatBRL(cat.value)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
