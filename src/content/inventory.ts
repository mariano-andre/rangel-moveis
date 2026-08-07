import { InventoryData } from "@/lib/types";

export const inventoryMock: InventoryData = {
  items: [
    {
      id: 1,
      material: "MDF 15mm",
      unit: "chapas",
      quantity: 14,
      minimum: 10,
      pricePerUnit: 92,
    },
    {
      id: 2,
      material: "MDF 18mm",
      unit: "chapas",
      quantity: 3,
      minimum: 8,
      pricePerUnit: 105,
    },
    {
      id: 3,
      material: "Dobradiças",
      unit: "unid.",
      quantity: 86,
      minimum: 20,
      pricePerUnit: 4.50,
    },
    {
      id: 4,
      material: "Cola para MDF",
      unit: "kg",
      quantity: 2.5,
      minimum: 5,
      pricePerUnit: 18,
    },
    {
      id: 5,
      material: "Puxadores",
      unit: "unid.",
      quantity: 40,
      minimum: 15,
      pricePerUnit: 12,
    },
    {
      id: 6,
      material: "Parafusos 3,5×35",
      unit: "caixa",
      quantity: 5,
      minimum: 3,
      pricePerUnit: 22,
    },
  ],
};
