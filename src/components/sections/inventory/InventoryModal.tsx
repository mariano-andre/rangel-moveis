// Modal reutilizado para:
// - Registrar entrada (adiciona quantidade a item existente ou cria novo)
// - Editar item (altera propriedades do item)
// O modo é determinado pela prop "mode".

"use client";

import { useState } from "react";
import { InventoryItem, InventoryUnit } from "@/lib/types/index.ts";
import { formatBRL } from "@/lib/format.ts";
import { Modal } from "@/components/ui/Modal.tsx";
import { Button } from "@/components/ui/Button.tsx";

const UNITS: InventoryUnit[] = [
  "chapas",
  "unid.",
  "kg",
  "caixa",
  "metro",
  "litro",
];

// ── Modo: registrar entrada ──────────────────────────────────

interface EntryModalProps {
  mode: "entry";
  items: InventoryItem[];
  onClose: () => void;
  onSave: (itemId: number, quantity: number, pricePerUnit: number) => void;
}

// ── Modo: editar item ────────────────────────────────────────

interface EditModalProps {
  mode: "edit";
  item: InventoryItem;
  onClose: () => void;
  onSave: (updated: Omit<InventoryItem, "id">) => void;
}

type InventoryModalProps = EntryModalProps | EditModalProps;

const inputClass = (hasError: boolean) =>
  `w-full bg-bg-elevated border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors ${
    hasError ? "border-danger" : "border-border-input focus:border-brand"
  }`;

// ── Entry form ───────────────────────────────────────────────

function EntryForm({ items, onClose, onSave }: Omit<EntryModalProps, "mode">) {
  const [selectedId, setSelectedId] = useState<string>(
    String(items[0]?.id ?? ""),
  );
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedItem = items.find((i) => i.id === parseInt(selectedId));

  function validate() {
    const e: Record<string, string> = {};
    if (!selectedId) e.item = "Selecione um material.";
    if (!quantity || parseFloat(quantity) <= 0) {
      e.quantity = "Informe a quantidade.";
    }
    if (!price || parseFloat(price) <= 0) e.price = "Informe o preço unitário.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave(parseInt(selectedId), parseFloat(quantity), parseFloat(price));
    onClose();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Material */}
      <div>
        <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
          Material
        </label>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            const item = items.find((i) => i.id === parseInt(e.target.value));
            if (item) setPrice(String(item.pricePerUnit));
          }}
          className={inputClass(!!errors.item)}
        >
          {items.map((i) => (
            <option key={i.id} value={i.id}>{i.material}</option>
          ))}
        </select>
        {errors.item && (
          <p className="text-xs text-danger mt-1">{errors.item}</p>
        )}
        {selectedItem && (
          <p className="text-xs text-text-muted mt-1">
            Estoque atual: {selectedItem.quantity} {selectedItem.unit}
          </p>
        )}
      </div>

      {/* Quantidade e Preço */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Qtd. a adicionar {selectedItem ? `(${selectedItem.unit})` : ""}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            className={inputClass(!!errors.quantity)}
          />
          {errors.quantity && (
            <p className="text-xs text-danger mt-1">{errors.quantity}</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Preço/un. (R$)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0,00"
            className={inputClass(!!errors.price)}
          />
          {errors.price && (
            <p className="text-xs text-danger mt-1">{errors.price}</p>
          )}
        </div>
      </div>

      {/* Total estimado */}
      {quantity && price && parseFloat(quantity) > 0 && parseFloat(price) > 0 &&
        (
          <div className="bg-bg-elevated rounded-lg px-3 py-2.5 text-sm">
            <span className="text-text-muted">Total da entrada:</span>
            <span className="text-text-primary font-medium">
              {formatBRL(parseFloat(quantity) * parseFloat(price))}
            </span>
          </div>
        )}

      <div className="flex justify-end gap-2 pt-1">
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>
          Registrar entrada
        </Button>
      </div>
    </div>
  );
}

// ── Edit form ────────────────────────────────────────────────

function EditForm({ item, onClose, onSave }: Omit<EditModalProps, "mode">) {
  const [form, setForm] = useState({
    material: item.material,
    unit: item.unit as InventoryUnit,
    quantity: String(item.quantity),
    minimum: String(item.minimum),
    pricePerUnit: String(item.pricePerUnit),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined as unknown as string }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.material.trim()) e.material = "Informe o nome do material.";
    if (!form.quantity || parseFloat(form.quantity) < 0) {
      e.quantity = "Informe a quantidade.";
    }
    if (!form.minimum || parseFloat(form.minimum) < 0) {
      e.minimum = "Informe o estoque mínimo.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      material: form.material.trim(),
      unit: form.unit,
      quantity: parseFloat(form.quantity) || 0,
      minimum: parseFloat(form.minimum) || 0,
      pricePerUnit: parseFloat(form.pricePerUnit) || 0,
    });
    onClose();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Material
          </label>
          <input
            type="text"
            value={form.material}
            onChange={(e) => set("material", e.target.value)}
            className={inputClass(!!errors.material)}
          />
          {errors.material && (
            <p className="text-xs text-danger mt-1">{errors.material}</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Unidade
          </label>
          <select
            value={form.unit}
            onChange={(e) => set("unit", e.target.value)}
            className={inputClass(false)}
          >
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Qtd. atual
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            className={inputClass(!!errors.quantity)}
          />
          {errors.quantity && (
            <p className="text-xs text-danger mt-1">{errors.quantity}</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Mínimo
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.minimum}
            onChange={(e) => set("minimum", e.target.value)}
            className={inputClass(!!errors.minimum)}
          />
          {errors.minimum && (
            <p className="text-xs text-danger mt-1">{errors.minimum}</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-text-muted uppercase tracking-wide mb-1.5">
            Preço/un.
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.pricePerUnit}
            onChange={(e) => set("pricePerUnit", e.target.value)}
            placeholder="0,00"
            className={inputClass(false)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────

export function InventoryModal(props: InventoryModalProps) {
  const title = props.mode === "entry"
    ? "Registrar entrada"
    : "Editar material";

  return (
    <Modal title={title} onClose={props.onClose}>
      {props.mode === "entry"
        ? (
          <EntryForm
            items={props.items}
            onClose={props.onClose}
            onSave={props.onSave}
          />
        )
        : (
          <EditForm
            item={props.item}
            onClose={props.onClose}
            onSave={props.onSave}
          />
        )}
    </Modal>
  );
}
