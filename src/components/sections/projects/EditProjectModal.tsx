"use client";

import { useState } from "react";
import { Employee, Project } from "@/lib/types/index.ts";
import { Modal } from "@/components/ui/Modal.tsx";
import { Button } from "@/components/ui/Button.tsx";

interface EditProjectModalProps {
  project: Project;
  employees: Employee[];
  onClose: () => void;
  onSave: (updated: Project) => void;
}

interface FormState {
  name: string;
  description: string;
  employeeId: string;
  deadline: string;
  value: string;
  stepsRaw: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function EditProjectModal(
  { project, employees, onClose, onSave }: EditProjectModalProps,
) {
  const [form, setForm] = useState<FormState>({
    name: project.name,
    description: project.description,
    employeeId: String(project.employeeId),
    deadline: project.deadline,
    value: String(project.value),
    stepsRaw: project.steps.join("\n"),
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function set(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Informe o nome do projeto.";
    if (!form.employeeId) e.employeeId = "Selecione um responsável.";
    if (!form.deadline) e.deadline = "Informe o prazo de entrega.";
    if (!form.value || parseFloat(form.value) <= 0) {
      e.value = "Informe um valor válido.";
    }
    const steps = form.stepsRaw.split("\n").map((s) => s.trim()).filter(
      Boolean,
    );
    if (steps.length === 0) e.stepsRaw = "Informe ao menos uma etapa.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const steps = form.stepsRaw.split("\n").map((s) => s.trim()).filter(
      Boolean,
    );

    // Se as etapas mudaram, reseta o índice para não ficar fora dos limites
    const currentStepIndex = steps.length > project.currentStepIndex
      ? project.currentStepIndex
      : 0;

    onSave({
      ...project,
      name: form.name.trim(),
      description: form.description.trim(),
      employeeId: parseInt(form.employeeId),
      deadline: form.deadline,
      value: parseFloat(form.value),
      steps,
      currentStepIndex,
    });
    onClose();
  }

  const inputClass = (hasError: boolean) =>
    `w-full bg-bg-elevated border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors ${
      hasError ? "border-danger" : "border-border-input focus:border-brand"
    }`;

  return (
    <Modal title="Editar projeto" onClose={onClose} size="lg">
      <div className="flex flex-col gap-4">
        {/* Nome */}
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Nome do projeto / cliente
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ex: Cozinha planejada — Família Silva"
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p className="text-xs text-danger mt-1">{errors.name}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Descrição
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Descreva os detalhes do projeto..."
            rows={3}
            className={`${inputClass(false)} resize-none`}
          />
        </div>

        {/* Responsável */}
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Responsável
          </label>
          <select
            value={form.employeeId}
            onChange={(e) => set("employeeId", e.target.value)}
            className={inputClass(!!errors.employeeId)}
          >
            <option value="">Selecionar funcionário...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          {errors.employeeId && (
            <p className="text-xs text-danger mt-1">{errors.employeeId}</p>
          )}
        </div>

        {/* Prazo e Valor */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Prazo de entrega
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
              className={inputClass(!!errors.deadline)}
            />
            {errors.deadline && (
              <p className="text-xs text-danger mt-1">{errors.deadline}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Valor (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.value}
              onChange={(e) => set("value", e.target.value)}
              placeholder="0,00"
              className={inputClass(!!errors.value)}
            />
            {errors.value && (
              <p className="text-xs text-danger mt-1">{errors.value}</p>
            )}
          </div>
        </div>

        {/* Etapas */}
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Etapas <span className="normal-case">(uma por linha)</span>
          </label>
          <textarea
            value={form.stepsRaw}
            onChange={(e) => set("stepsRaw", e.target.value)}
            rows={5}
            className={`${
              inputClass(!!errors.stepsRaw)
            } resize-none font-mono text-xs`}
          />
          {errors.stepsRaw && (
            <p className="text-xs text-danger mt-1">{errors.stepsRaw}</p>
          )}
          {form.stepsRaw && (
            <p className="text-[11px] text-text-muted mt-1">
              {form.stepsRaw.split("\n").filter((s) => s.trim()).length}{" "}
              etapa(s) definida(s)
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1">
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar alterações
          </Button>
        </div>
      </div>
    </Modal>
  );
}
