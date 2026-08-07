"use client";

import { useState } from "react";
import { ContractType, Employee } from "../../../lib/types/index.ts";
import { Modal } from "../../ui/Modal.tsx";
import { Button } from "../../ui/Button.tsx";

interface EmployeeModalProps {
  employee?: Employee;
  onClose: () => void;
  onSave: (data: Omit<Employee, "id">) => void;
}

interface FormState {
  name: string;
  contractType: ContractType;
  fixedSalary: string;
  commissionPercent: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const inputClass = (hasError: boolean) =>
  `w-full bg-bg-elevated border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors ${
    hasError ? "border-danger" : "border-border-input focus:border-brand"
  }`;

export function EmployeeModal(
  { employee, onClose, onSave }: EmployeeModalProps,
) {
  const [form, setForm] = useState<FormState>({
    name: employee?.name ?? "",
    contractType: employee?.contractType ?? "clt",
    fixedSalary: employee ? String(employee.fixedSalary) : "",
    commissionPercent: employee ? String(employee.commissionPercent) : "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function set(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) {
      e.name = "Informe o nome do funcionário.";
    }
    if (form.fixedSalary !== "" && parseFloat(form.fixedSalary) < 0) {
      e.fixedSalary = "Salário não pode ser negativo.";
    }
    const comm = parseFloat(form.commissionPercent);
    if (form.commissionPercent !== "" && (comm < 0 || comm > 100)) {
      e.commissionPercent = "Informe um percentual entre 0 e 100.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      contractType: form.contractType,
      fixedSalary: parseFloat(form.fixedSalary) || 0,
      commissionPercent: parseFloat(form.commissionPercent) || 0,
    });
    onClose();
  }

  return (
    <Modal
      title={employee ? "Editar funcionário" : "Novo funcionário"}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        {/* Nome */}
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Nome
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ex: Carlos Silva"
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p className="text-xs text-danger mt-1">{errors.name}</p>
          )}
        </div>

        {/* Tipo de contrato */}
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Tipo de contrato
          </label>
          <div className="flex gap-2">
            {(["clt", "commission"] as ContractType[]).map((t) => (
              <button
                key={t}
                onClick={() => set("contractType", t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.contractType === t
                    ? "bg-brand-muted border-brand-border text-brand"
                    : "bg-bg-elevated border-border-input text-text-secondary hover:text-text-primary"
                }`}
              >
                {t === "clt" ? "CLT" : "Comissionado"}
              </button>
            ))}
          </div>
        </div>

        {/* Salário e Comissão */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Salário fixo (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.fixedSalary}
              onChange={(e) => set("fixedSalary", e.target.value)}
              placeholder="0,00"
              className={inputClass(!!errors.fixedSalary)}
            />
            {errors.fixedSalary && (
              <p className="text-xs text-danger mt-1">{errors.fixedSalary}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Comissão (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.commissionPercent}
              onChange={(e) => set("commissionPercent", e.target.value)}
              placeholder="0"
              className={inputClass(!!errors.commissionPercent)}
            />
            {errors.commissionPercent && (
              <p className="text-xs text-danger mt-1">
                {errors.commissionPercent}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1">
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>
            {employee ? "Salvar alterações" : "Adicionar funcionário"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
