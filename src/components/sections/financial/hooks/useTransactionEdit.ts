// Hook que encapsula toda a lógica de edição inline de transações.
// A tabela só chama esses handlers — não precisa saber como funcionam.

import { useState } from "react";
import { Transaction } from "../../../../lib/types/index.ts";

export function useTransactionEdit(onEdit: (updated: Transaction) => void) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Transaction | null>(null);

  const isEditing = (id: number) => editingId === id;

  function startEdit(t: Transaction) {
    setEditingId(t.id);
    setDraft({ ...t });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function confirmEdit() {
    if (!draft) return;
    onEdit(draft);
    setEditingId(null);
    setDraft(null);
  }

  function setDraftField<K extends keyof Transaction>(
    key: K,
    value: Transaction[K],
  ) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return {
    isEditing,
    draft,
    startEdit,
    cancelEdit,
    confirmEdit,
    setDraftField,
  };
}
