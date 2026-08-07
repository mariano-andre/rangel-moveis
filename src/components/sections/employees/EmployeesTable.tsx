import { Employee } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EmployeesTableProps {
  employees: Employee[];
  onAdd: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

export function EmployeesTable(
  { employees, onAdd, onEdit, onDelete }: EmployeesTableProps,
) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>Equipe</CardTitle>
        <Button variant="primary" onClick={onAdd}>+ Adicionar</Button>
      </div>

      {/* Desktop */}
      <table className="w-full text-sm hidden md:table">
        <thead>
          <tr className="text-left">
            {["Funcionário", "Contrato", "Salário fixo", "Comissão", ""].map((
              h,
              i,
            ) => (
              <th
                key={i}
                className={`text-[11px] text-text-muted uppercase font-medium pb-2 border-b border-border-strong ${
                  i >= 2 && i < 4 ? "text-right" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="border-b border-border-soft last:border-0"
            >
              <td className="py-3 text-text-primary font-medium">{emp.name}</td>
              <td className="py-3">
                <Badge variant={emp.contractType === "clt" ? "green" : "gray"}>
                  {emp.contractType === "clt" ? "CLT" : "Comissão"}
                </Badge>
              </td>
              <td className="py-3 text-right text-text-secondary">
                {emp.fixedSalary > 0 ? formatBRL(emp.fixedSalary) : "—"}
              </td>
              <td className="py-3 text-right text-text-secondary">
                {emp.commissionPercent > 0 ? `${emp.commissionPercent}%` : "—"}
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(emp)}
                    title="Editar"
                    className="text-text-muted hover:text-text-primary transition-colors p-1.5"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onDelete(emp.id)}
                    title="Remover"
                    className="text-text-muted hover:text-danger transition-colors p-1.5"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="md:hidden">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="py-3 border-b border-border-soft last:border-0"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-text-primary">
                {emp.name}
              </span>
              <div className="flex items-center gap-1">
                <Badge variant={emp.contractType === "clt" ? "green" : "gray"}>
                  {emp.contractType === "clt" ? "CLT" : "Comissão"}
                </Badge>
                <button
                  onClick={() => onEdit(emp)}
                  className="text-text-muted hover:text-text-primary transition-colors p-1"
                >
                  ✎
                </button>
                <button
                  onClick={() => onDelete(emp.id)}
                  className="text-text-muted hover:text-danger transition-colors p-1"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-xs text-text-muted">
              {emp.fixedSalary > 0 ? formatBRL(emp.fixedSalary) : "Sem fixo"}
              {emp.commissionPercent > 0
                ? ` · ${emp.commissionPercent}% de comissão`
                : ""}
            </p>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <p className="text-sm text-text-muted text-center py-10">
          Nenhum funcionário cadastrado.
        </p>
      )}
    </Card>
  );
}
