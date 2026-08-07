import { InventoryItem, InventoryStatus } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { calcInventoryStatus } from "@/lib/calculations";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/icons";

const statusConfig: Record<InventoryStatus, { label: string; variant: "green" | "amber" | "red" }> = {
  ok:       { label: "OK",      variant: "green" },
  low:      { label: "Baixo",   variant: "amber" },
  critical: { label: "Crítico", variant: "red"   },
};

interface InventoryTableProps {
  items: InventoryItem[];
  onEntry:  (item: InventoryItem) => void;
  onEdit:   (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

export function InventoryTable({ items, onEntry, onEdit, onDelete }: InventoryTableProps) {
  return (
    <Card>
      <CardTitle icon={<span className="text-base">⚙</span>}>Materiais</CardTitle>

      {/* Desktop */}
      <table className="w-full text-sm hidden md:table">
        <thead>
          <tr className="text-left">
            {["Material", "Unidade", "Qtd. atual", "Mínimo", "Preço/un.", "Status", ""].map((h, i) => (
              <th
                key={i}
                className={`text-[11px] text-text-muted uppercase font-medium pb-2 border-b border-border-strong ${
                  i >= 2 && i <= 4 ? "text-right" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const status = statusConfig[calcInventoryStatus(item)];
            const isAlert = calcInventoryStatus(item) !== "ok";
            return (
              <tr key={item.id} className="border-b border-border-soft last:border-0">
                <td className="py-3 text-text-primary font-medium">{item.material}</td>
                <td className="py-3 text-text-muted">{item.unit}</td>
                <td className={`py-3 text-right font-medium ${isAlert ? "text-danger" : "text-text-primary"}`}>
                  {item.quantity}
                </td>
                <td className="py-3 text-right text-text-muted">{item.minimum}</td>
                <td className="py-3 text-right text-text-secondary">{formatBRL(item.pricePerUnit)}</td>
                <td className="py-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </td>
                <td className="py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEntry(item)}
                      title="Registrar entrada"
                      className="text-text-muted hover:text-text-primary transition-colors p-1.5"
                    >
                      <Icon name="new" size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      title="Editar"
                      className="text-text-muted hover:text-text-primary transition-colors p-1.5"
                    >
                      <Icon name="edit" size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Remover"
                      className="text-text-muted hover:text-danger transition-colors p-1.5"
                    >
                      <Icon name="cancel" size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="md:hidden">
        {items.map((item) => {
          const status = statusConfig[calcInventoryStatus(item)];
          const isAlert = calcInventoryStatus(item) !== "ok";
          return (
            <div key={item.id} className="py-3 border-b border-border-soft last:border-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-text-primary">{item.material}</span>
                <div className="flex items-center gap-1.5">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <button onClick={() => onEntry(item)}  className="text-text-muted hover:text-text-primary transition-colors p-1">+</button>
                  <button onClick={() => onEdit(item)}   className="text-text-muted hover:text-text-primary transition-colors p-1">
                    <Icon name="edit" size={18} />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="text-text-muted hover:text-danger transition-colors p-1">
                    <Icon name="cancel" size={18} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                <span className={isAlert ? "text-danger font-medium" : ""}>{item.quantity}</span>
                {" "}{item.unit} · mín. {item.minimum} · {formatBRL(item.pricePerUnit)}/un.
              </p>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-text-muted text-center py-10">Nenhum material cadastrado.</p>
      )}
    </Card>
  );
}
