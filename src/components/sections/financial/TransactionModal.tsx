// Formulário de registro de movimentação financeira.
// Client Component — gerencia o estado do formulário internamente
// e chama onSubmit com os dados preenchidos ao confirmar.

"use client";

import { useState } from "react";
import { Modal } from "../../ui/Modal.tsx";
import {
  ExpenseCategoryLabel,
  Transaction,
  TransactionType,
} from "../../../lib/types/index.ts";

// Categorias fixas do sistema
const FIXED_CATEGORIES: ExpenseCategoryLabel[] = [
  "Material",
  "Mão de obra",
  "Aluguel",
  "Outros",
];

interface TransactionModalProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
}

interface FormState {
  description: string;
  type: TransactionType;
  value: string;
  date: string;
  category: ExpenseCategoryLabel | string;
  isNewCategory: boolean;
  newCategory: string;
}

const EMPTY_FORM: FormState = {
  description: "",
  type: "expense",
  value: "",
  date: new Date().toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  }).split("/").reverse().join("-"),
  category: "Material",
  isNewCategory: false,
  newCategory: "",
};

export function TransactionModal({ onClose, onSubmit }: TransactionModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined })); // limpa erro ao digitar
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.description.trim()) {
      newErrors.description = "Informe uma descrição.";
    }
    if (!form.value || parseFloat(form.value) <= 0) {
      newErrors.value = "Informe um valor válido.";
    }
    if (!form.date) newErrors.date = "Informe a data.";
    if (form.isNewCategory && !form.newCategory.trim()) {
      newErrors.newCategory = "Informe o nome da nova categoria.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const resolvedCategory = form.isNewCategory
      ? (form.newCategory.trim() as ExpenseCategoryLabel)
      : (form.category as ExpenseCategoryLabel);

    onSubmit({
      description: form.description.trim(),
      type: form.type,
      value: parseFloat(form.value),
      date: form.date,
      // categoria só se aplica a despesas
      ...(form.type === "expense" ? { category: resolvedCategory } : {}),
    });

    onClose();
  }

  const isExpense = form.type === "expense";

  return (
    <Modal title="Registrar movimentação" onClose={onClose}>
      <div className="space-y-4">
        {/* Descrição */}
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Descrição
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Ex: Compra de MDF 15mm"
            className="w-full bg-bg-elevated border border-border-input rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand transition-colors"
          />
          {errors.description && (
            <p className="text-xs text-danger mt-1">{errors.description}</p>
          )}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Tipo
          </label>
          <div className="flex gap-2">
            {(["expense", "income"] as TransactionType[]).map((t) => (
              <button type="button"
                key={t}
                onClick={() => set("type", t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  form.type === t
                    ? t === "income"
                      ? "bg-success-muted border-success-border text-success"
                      : "bg-danger-muted border-danger-border text-danger"
                    : "bg-bg-elevated border-border-input text-text-secondary hover:text-text-primary"
                }`}
              >
                {t === "income" ? "Entrada" : "Saída"}
              </button>
            ))}
          </div>
        </div>

        {/* Valor e Data — lado a lado */}
        <div className="grid grid-cols-2 gap-3">
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
              className="w-full bg-bg-elevated border border-border-input rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand transition-colors"
            />
            {errors.value && (
              <p className="text-xs text-danger mt-1">{errors.value}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Data
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full bg-bg-elevated border border-border-input rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand transition-colors"
            />
            {errors.date && (
              <p className="text-xs text-danger mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Categoria — só aparece em despesas */}
        {isExpense && (
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
              Categoria
            </label>
            <select
              value={form.isNewCategory ? "__new__" : form.category}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  set("isNewCategory", true);
                } else {
                  set("isNewCategory", false);
                  set("category", e.target.value as ExpenseCategoryLabel);
                }
              }}
              className="w-full bg-bg-elevated border border-border-input rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-brand transition-colors"
            >
              {FIXED_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="__new__">+ Nova categoria...</option>
            </select>

            {/* Campo de nova categoria */}
            {form.isNewCategory && (
              <div className="mt-2">
                <input
                  type="text"
                  value={form.newCategory}
                  onChange={(e) => set("newCategory", e.target.value)}
                  placeholder="Nome da nova categoria"
                  autoFocus
                  className="w-full bg-bg-elevated border border-brand rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
                {errors.newCategory && (
                  <p className="text-xs text-danger mt-1">
                    {errors.newCategory}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2 justify-end pt-1">
          <button type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-text-secondary border border-border-input bg-bg-elevated hover:text-text-primary transition-colors"
          >
            Cancelar
          </button>
          <button type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-brand text-text-inverted hover:bg-brand-hover transition-colors"
          >
            Registrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
