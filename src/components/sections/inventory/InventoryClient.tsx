"use client";

import { useState } from "react";
import { InventoryItem } from "@/lib/types";
import { calcInventoryStatus } from "@/lib/calculations";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { InventoryTable } from "@/components/sections/inventory/InventoryTable";
import { InventoryModal } from "@/components/sections/inventory/InventoryModal";

interface InventoryClientProps {
  initialItems: InventoryItem[];
}

type ModalState =
  | { type: "entry" }
  | { type: "edit"; item: InventoryItem }
  | null;

export function InventoryClient({ initialItems }: InventoryClientProps) {
  const [items, setItems]                     = useState<InventoryItem[]>(initialItems);
  const [modal, setModal]                     = useState<ModalState>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const alertCount   = items.filter((i) => calcInventoryStatus(i) !== "ok").length;
  const itemToDelete = items.find((i) => i.id === confirmDeleteId);

  function handleEntry(itemId: number, quantity: number, pricePerUnit: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, quantity: +(i.quantity + quantity).toFixed(3), pricePerUnit }
          : i
      )
    );
  }

  function handleEdit(id: number, data: Omit<InventoryItem, "id">) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...data } : i));
  }

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <>
      {/* Header com botão */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-text-primary">Estoque</h1>
          <p className="text-sm text-text-muted mt-0.5">Materiais e insumos</p>
        </div>
        <Button variant="primary" onClick={() => setModal({ type: "entry" })}>
          ↓ Registrar entrada
        </Button>
      </div>

      {/* Alerta de itens em alerta */}
      {alertCount > 0 && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 text-sm px-3.5 py-1.5 rounded-lg border border-warning-border text-warning bg-warning-muted">
            ⚠ {alertCount} {alertCount === 1 ? "item em alerta" : "itens em alerta"}
          </span>
        </div>
      )}

      {/* Tabela */}
      <InventoryTable
        items={items}
        onEntry={() => setModal({ type: "entry" })}
        onEdit={(item) => setModal({ type: "edit", item })}
        onDelete={setConfirmDeleteId}
      />

      {/* Modal de entrada */}
      {modal?.type === "entry" && (
        <InventoryModal
          mode="entry"
          items={items}
          onClose={() => setModal(null)}
          onSave={handleEntry}
        />
      )}

      {/* Modal de edição */}
      {modal?.type === "edit" && (
        <InventoryModal
          mode="edit"
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={(data) => handleEdit(modal.item.id, data)}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDeleteId !== null && (
        <ConfirmModal
          title="Remover material"
          message={
            <>
              Tem certeza que deseja remover{" "}
              <span className="font-medium text-text-primary">{itemToDelete?.material}</span>
              ? Essa ação não pode ser desfeita.
            </>
          }
          confirmLabel="Remover"
          onConfirm={() => handleDelete(confirmDeleteId)}
          onClose={() => setConfirmDeleteId(null)}
        />
      )}
    </>
  );
}
