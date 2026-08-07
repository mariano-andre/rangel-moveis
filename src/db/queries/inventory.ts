import { db } from "../index.ts";
import { inventory } from "../schema.ts";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const insertInventorySchema = z.object({
  material: z.string().min(1, "Material é obrigatório"),
  unit: z.enum(["chapas", "unid.", "kg", "caixa", "metro", "litro"]),
  quantity: z.number().min(0),
  minimum: z.number().min(0),
  pricePerUnit: z.number().min(0),
});

export type InsertInventory = z.infer<typeof insertInventorySchema>;

export async function getInventory() {
  return await db.select().from(inventory).orderBy(inventory.material);
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
