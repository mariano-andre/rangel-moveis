import { CompanySettings } from "@/lib/types";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons";

interface CompanyFormProps {
  data: CompanySettings;
  onChange: (key: keyof CompanySettings, value: string | number) => void;
  onSave: () => void;
  saved: boolean;
}

const inputClass =
  "w-full bg-bg-elevated border border-border-input rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand transition-colors";

const fields: {
  key: keyof CompanySettings;
  label: string;
  type: "text" | "number";
  placeholder: string;
}[] = [
  { key: "name",                     label: "Nome da marcenaria",          type: "text",   placeholder: "Ex: Rangel Móveis"  },
  { key: "phone",                    label: "Telefone",                    type: "text",   placeholder: "(21) 99999-0000"    },
  { key: "monthlyRevenueGoal",       label: "Meta de faturamento mensal (R$)", type: "number", placeholder: "0"              },
  { key: "defaultCommissionPercent", label: "Comissão padrão (%)",         type: "number", placeholder: "0"                  },
];

export function CompanyForm({ data, onChange, onSave, saved }: CompanyFormProps) {
  return (
    <Card>
      <CardTitle>Informações da empresa</CardTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              {f.label}
            </label>
            <input
              type={f.type}
              value={data[f.key]}
              onChange={(e) =>
                onChange(f.key, f.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
              }
              placeholder={f.placeholder}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={onSave}>
          <Icon name="save" size={18} />
          Salvar alterações
        </Button>
        {saved && (
          <span className="text-xs text-success">
            <Icon name="apply" size={18} /> Salvo com sucesso
          </span>
        )}
      </div>
    </Card>
  );
}
