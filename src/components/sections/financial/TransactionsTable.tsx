import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Transaction } from "@/lib/types";
import { formatBRL, formatDateBR } from "@/lib/format";

interface TransactionsTableProps {
  transactions: Transaction[];
  onAddClick?: () => void;
}

export function TransactionsTable({
  transactions,
  onAddClick,
}: TransactionsTableProps) {
  return (
    <Card>
      <CardTitle>Últimas movimentações</CardTitle>

      {/* Tabela — desktop */}
      <table className="w-full text-sm hidden md:table">
        <thead>
          <tr className="text-left">
            <th className="text-[11px] text-zinc-500 uppercase font-medium pb-2 border-b border-zinc-700">
              Descrição
            </th>
            <th className="text-[11px] text-zinc-500 uppercase font-medium pb-2 border-b border-zinc-700">
              Tipo
            </th>
            <th className="text-[11px] text-zinc-500 uppercase font-medium pb-2 border-b border-zinc-700">
              Data
            </th>
            <th className="text-[11px] text-zinc-500 uppercase font-medium pb-2 border-b border-zinc-700 text-right">
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 8).map((t) => (
            <tr key={t.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="py-2.5 text-zinc-200">{t.description}</td>
              <td className="py-2.5">
                <Badge variant={t.type === "income" ? "green" : "red"}>
                  {t.type === "income" ? "Entrada" : "Saída"}
                </Badge>
              </td>
              <td className="py-2.5 text-xs text-zinc-500">
                {formatDateBR(t.date)}
              </td>
              <td
                className={`py-2.5 text-right font-medium ${
                  t.type === "income" ? "text-green-400" : "text-red-400"
                }`}
              >
                {t.type === "income" ? "+" : "–"} {formatBRL(t.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lista — mobile */}
      <div className="md:hidden space-y-0">
        {transactions.slice(0, 6).map((t) => (
          <div
            key={t.id}
            className="py-3 border-b border-zinc-800/60 last:border-0"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-zinc-200">
                {t.description.split("—").pop()?.trim()}
              </span>
              <span
                className={`text-sm font-medium ${
                  t.type === "income" ? "text-green-400" : "text-red-400"
                }`}
              >
                {t.type === "income" ? "+" : "–"} {formatBRL(t.value)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={t.type === "income" ? "green" : "red"}>
                {t.type === "income" ? "Entrada" : "Saída"}
              </Badge>
              <span className="text-xs text-zinc-500">
                {formatDateBR(t.date)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button onClick={onAddClick}>
          <span>+</span> Registrar movimentação
        </Button>
      </div>
    </Card>
  );
}
