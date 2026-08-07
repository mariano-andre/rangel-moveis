/**
 * InventoryClient.tsx
 *
 * Client component for managing Inventory.
 *
 * Clean Code Principles Applied:
 * - Single Responsibility Principle (SRP): UI logic is separated from optimistic state updates.
 * - Extracted sorting and state management to the `useOptimisticData` hook where applicable.
 */

"use client";

import { useState } from "react";
import { InventoryItem } from "@/lib/types/index.ts";
import { calcInventoryStatus } from "@/lib/calculations.ts";
import { Button } from "@/components/ui/Button.tsx";
import { ConfirmModal } from "@/components/ui/ConfirmModal.tsx";
import { InventoryTable } from "@/components/sections/inventory/InventoryTable.tsx";
import { InventoryModal } from "@/components/sections/inventory/InventoryModal.tsx";
import { Icon } from "@/components/icons/index.ts";
import { editInventoryAction, removeInventoryAction } from "@/app/actions.ts";
import { useOptimisticData } from "@/lib/hooks/useOptimisticData.ts";

interface InventoryClientProps {
  initialItems: InventoryItem[];
}

type ModalState =
  | { type: "entry" }
  | { type: "edit"; item: InventoryItem }
  | null;

export function InventoryClient({ initialItems }: InventoryClientProps) {
  // Use generic hook to manage inventory state
  const { data: items, optimisticUpdate, optimisticDelete } = useOptimisticData<
    InventoryItem
  >(initialItems);

  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const alertCount =
    items.filter((i) => calcInventoryStatus(i) !== "ok").length;
  const itemToDelete = items.find((i) => i.id === confirmDeleteId);

  /**
   * Registers a stock entry (adds to quantity).
   * Optimistically updates the UI for immediate feedback.
   */
  async function handleEntry(
    itemId: number,
    quantity: number,
    pricePerUnit: number,
  ) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const newQuantity = +(item.quantity + quantity).toFixed(3);

    try {
      await optimisticUpdate(
        itemId,
        { quantity: newQuantity, pricePerUnit },
        (actionId, updatedData) =>
          editInventoryAction(actionId as number, updatedData),
      );
    } catch (_e) {
      // Handled by hook
    }
  }

  /**
   * Edits the base properties of an inventory item.
   */
  async function handleEdit(id: number, data: Omit<InventoryItem, "id">) {
    try {
      await optimisticUpdate(
        id,
        data,
        (actionId, updatedData) =>
          editInventoryAction(actionId as number, updatedData),
      );
    } catch (_e) {
      // Handled by hook
    }
  }

  /**
   * Optimistically deletes an inventory item.
   */
  async function handleDelete(id: number) {
    try {
      await optimisticDelete(
        id,
        (actionId) => removeInventoryAction(actionId as number),
      );
    } catch (_e) {
      // Handled by hook
    }
    setConfirmDeleteId(null);
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
          <Icon name="new" size={18} />
          Registrar entrada
        </Button>
      </div>

      {/* Alerta de itens em alerta */}
      {alertCount > 0 && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 text-sm px-3.5 py-1.5 rounded-lg border border-warning-border text-warning bg-warning-muted">
            ⚠ {alertCount}{" "}
            {alertCount === 1 ? "item em alerta" : "itens em alerta"}
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
              <span className="font-medium text-text-primary">
                {itemToDelete?.material}
              </span>
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
