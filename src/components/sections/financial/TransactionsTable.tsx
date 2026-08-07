// Só estrutura visual — lógica de edição em useTransactionEdit,
// alternância de inputs em EditableCell.

"use client";

import { Card, CardTitle } from "../../ui/Card.tsx";
import { Badge } from "../../ui/Badge.tsx";
import { Button } from "../../ui/Button.tsx";
import { Transaction } from "../../../lib/types/index.ts";
import { formatBRL, formatDateBR } from "../../../lib/format.ts";
import { useTransactionEdit } from "./hooks/useTransactionEdit.ts";
import {
  ActionCell,
  DateCell,
  NumberCell,
  TextCell,
  TypeCell,
} from "./EditableCell.tsx";

interface TransactionsTableProps {
  transactions: Transaction[];
  onAddClick?: () => void;
  onEdit: (updated: Transaction) => void;
}

export function TransactionsTable(
  { transactions, onAddClick, onEdit }: TransactionsTableProps,
) {
  const {
    isEditing,
    draft,
    startEdit,
    cancelEdit,
    confirmEdit,
    setDraftField,
  } = useTransactionEdit(onEdit);

  return (
    <Card>
      <CardTitle>Últimas movimentações</CardTitle>

      {/* ── Desktop ── */}
      <table className="w-full text-sm hidden md:table">
        <thead>
          <tr className="text-left">
            {["Descrição", "Tipo", "Data", "Valor", ""].map((h, i) => (
              <th
                key={i}
                className={`text-[11px] text-text-secondary uppercase font-medium pb-2 border-b border-border-input ${
                  i === 3 ? "text-right" : ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 8).map((t) => {
            const editing = isEditing(t.id);
            return (
              <tr
                key={t.id}
                className={`border-b border-border-strong last:border-0 ${
                  editing ? "bg-bg-elevated/40" : ""
                }`}
              >
                <td className="py-2.5 pr-2">
                  <TextCell
                    isEditing={editing}
                    value={draft?.description ?? ""}
                    display={
                      <span className="text-text-primary/80">
                        {t.description}
                      </span>
                    }
                    onChange={(v) => setDraftField("description", v)}
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <TypeCell
                    isEditing={editing}
                    value={draft?.type ?? t.type}
                    display={
                      <Badge variant={t.type === "income" ? "green" : "red"}>
                        {t.type === "income" ? "Entrada" : "Saída"}
                      </Badge>
                    }
                    onChange={(v) => setDraftField("type", v)}
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <DateCell
                    isEditing={editing}
                    value={draft?.date ?? ""}
                    display={
                      <span className="text-xs text-text-muted">
                        {formatDateBR(t.date)}
                      </span>
                    }
                    onChange={(v) => setDraftField("date", v)}
                  />
                </td>
                <td className="py-2.5 pr-2 text-right">
                  <NumberCell
                    isEditing={editing}
                    value={draft?.value ?? t.value}
                    display={
                      <span
                        className={`font-medium ${
                          t.type === "income" ? "text-success" : "text-danger"
                        }`}
                      >
                        {t.type === "income" ? "+" : "–"} {formatBRL(t.value)}
                      </span>
                    }
                    onChange={(v) => setDraftField("value", v)}
                  />
                </td>
                <td className="py-2.5 text-right">
                  <ActionCell
                    isEditing={editing}
                    onConfirm={confirmEdit}
                    onCancel={cancelEdit}
                    onEdit={() => startEdit(t)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Mobile ── */}
      <div className="md:hidden">
        {transactions.slice(0, 6).map((t) => (
          <div
            key={t.id}
            className="py-3 border-b border-border-strong last:border-0"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-text-primary">
                {t.description.split("—").pop()?.trim()}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    t.type === "income" ? "text-success" : "text-danger"
                  }`}
                >
                  {t.type === "income" ? "+" : "–"} {formatBRL(t.value)}
                </span>
                <button type="button"
                  onClick={() => startEdit(t)}
                  title="Editar"
                  className="text-text-muted hover:text-text-primary transition-colors text-sm"
                >
                  ✎
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={t.type === "income" ? "green" : "red"}>
                {t.type === "income" ? "Entrada" : "Saída"}
              </Badge>
              <span className="text-xs text-text-secondary">
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
