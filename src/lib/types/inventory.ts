export type InventoryUnit =
  | "chapas"
  | "unid."
  | "kg"
  | "caixa"
  | "metro"
  | "litro";

export type InventoryStatus = "ok" | "low" | "critical";

// Linha da tabela "inventory" no banco
export interface InventoryItem {
  id: number;
  material: string;
  unit: InventoryUnit;
  quantity: number; // quantidade atual
  minimum: number; // quantidade mínima antes de alertar
  pricePerUnit: number; // preço por unidade em reais
}

export interface InventoryData {
  items: InventoryItem[];
}
