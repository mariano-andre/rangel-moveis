import { db } from "@/db/index.ts";
import { inventory } from "@/db/schema.ts";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { inventoryMock } from "@/content/inventory.ts";

export const insertInventorySchema = z.object({
  material: z.string().min(1, "Material é obrigatório").max(
    100,
    "Material muito longo",
  ),
  unit: z.enum(["chapas", "unid.", "kg", "caixa", "metro", "litro"]),
  quantity: z.number().min(0).max(999999, "Quantidade muito alta"),
  minimum: z.number().min(0).max(999999, "Mínimo muito alto"),
  pricePerUnit: z.number().min(0).max(9999999, "Preço muito alto"),
});

export type InsertInventory = z.infer<typeof insertInventorySchema>;

export async function getInventory() {
  const result = await db.select().from(inventory).orderBy(inventory.material);
  if (result.length === 0) {
    const defaultItems = inventoryMock.items.map((item) => ({
      material: item.material,
      unit: item.unit,
      quantity: item.quantity,
      minimum: item.minimum,
      pricePerUnit: item.pricePerUnit,
    }));
    const inserted = await db.insert(inventory).values(defaultItems)
      .returning();
    return inserted.sort((a, b) => a.material.localeCompare(b.material));
  }
  return result;
}

export async function getInventoryById(id: number) {
  const result = await db.select().from(inventory).where(eq(inventory.id, id));
  return result[0] || null;
}

export async function createInventoryItem(data: InsertInventory) {
  const validated = insertInventorySchema.parse(data);
  const result = await db.insert(inventory).values(validated).returning();
  return result[0];
}

export async function updateInventoryItem(
  id: number,
  data: Partial<InsertInventory>,
) {
  const validated = insertInventorySchema.partial().parse(data);
  const result = await db.update(inventory).set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }).where(eq(inventory.id, id)).returning();
  return result[0];
}

export async function deleteInventoryItem(id: number) {
  await db.delete(inventory).where(eq(inventory.id, id));
}
