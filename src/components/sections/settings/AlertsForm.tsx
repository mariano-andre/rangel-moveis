import { AlertSettings } from "@/lib/types";
import { Card, CardTitle } from "@/components/ui/Card";

interface AlertsFormProps {
  data: AlertSettings;
  onChange: (key: keyof AlertSettings, value: boolean) => void;
}

const alerts: { key: keyof AlertSettings; label: string }[] = [
  { key: "lowInventory",           label: "Estoque abaixo do mínimo"           },
  { key: "deadlineApproaching",    label: "Prazo de entrega próximo (3 dias)"   },
  { key: "pendingPayment",         label: "Pagamento pendente há mais de 7 dias" },
  { key: "weeklyFinancialSummary", label: "Resumo financeiro semanal"           },
];

export function AlertsForm({ data, onChange }: AlertsFormProps) {
  return (
    <Card>
      <CardTitle icon={<span>🔔</span>}>Alertas automáticos</CardTitle>
      <div className="flex flex-col gap-4">
        {alerts.map((a) => (
          <label
            key={a.key}
            className="flex items-center gap-3 text-sm text-text-secondary cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={data[a.key]}
              onChange={(e) => onChange(a.key, e.target.checked)}
              className="w-4 h-4 rounded accent-brand cursor-pointer"
            />
            {a.label}
          </label>
        ))}
      </div>
    </Card>
  );
}
