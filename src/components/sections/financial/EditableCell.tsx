// Alterna entre exibição e input dependendo de isEditing.
// Cada tipo de campo (text, date, number, select) tem seu próprio input.

import { TransactionType } from "@/lib/types";

const INPUT_CLASS =
  "bg-bg-root border border-border-input rounded-md px-2 py-1 text-xs text-text-primary outline-none focus:border-brand transition-colors";

// ── Tipos de célula suportados ──────────────────────────────

interface TextCellProps {
  isEditing: boolean;
  value: string;
  display: React.ReactNode;
  onChange: (v: string) => void;
  className?: string;
}

export function TextCell({ isEditing, value, display, onChange, className = "" }: TextCellProps) {
  if (!isEditing) return <>{display}</>;
  return (
    <input
      className={`${INPUT_CLASS} w-full ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

interface DateCellProps {
  isEditing: boolean;
  value: string;
  display: React.ReactNode;
  onChange: (v: string) => void;
}

export function DateCell({ isEditing, value, display, onChange }: DateCellProps) {
  if (!isEditing) return <>{display}</>;
  return (
    <input
      type="date"
      className={INPUT_CLASS}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

interface NumberCellProps {
  isEditing: boolean;
  value: number;
  display: React.ReactNode;
  onChange: (v: number) => void;
}

export function NumberCell({ isEditing, value, display, onChange }: NumberCellProps) {
  if (!isEditing) return <>{display}</>;
  return (
    <input
      type="number"
      min="0"
      step="0.01"
      className={`${INPUT_CLASS} w-24 text-right`}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    />
  );
}

interface TypeCellProps {
  isEditing: boolean;
  value: TransactionType;
  display: React.ReactNode;
  onChange: (v: TransactionType) => void;
}

export function TypeCell({ isEditing, value, display, onChange }: TypeCellProps) {
  if (!isEditing) return <>{display}</>;
  return (
    <select
      className={INPUT_CLASS}
      value={value}
      onChange={(e) => onChange(e.target.value as TransactionType)}
    >
      <option value="income">Entrada</option>
      <option value="expense">Saída</option>
    </select>
  );
}

// ── Botões de ação (confirmar / cancelar / lápis) ───────────

interface ActionCellProps {
  isEditing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export function ActionCell({ isEditing, onConfirm, onCancel, onEdit }: ActionCellProps) {
  if (isEditing) {
    return (
      <div className="flex justify-end gap-1">
        <button onClick={onConfirm} title="Confirmar" className="text-success hover:opacity-70 transition-opacity text-base px-1 font-bold">✓</button>
        <button onClick={onCancel}  title="Cancelar"  className="text-danger  hover:opacity-70 transition-opacity text-base px-1 font-bold">✕</button>
      </div>
    );
  }
  return (
    <button onClick={onEdit} title="Editar" className="text-text-secondary hover:text-text-muted transition-colors text-sm px-1">
      ✎
    </button>
  );
}
