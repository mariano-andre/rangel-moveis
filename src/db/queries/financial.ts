import { db } from "@/db/index.ts";
import { transactions } from "@/db/schema.ts";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const insertTransactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  type: z.enum(["income", "expense"]),
  category: z.string().nullable().optional(),
  date: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Formato de data inválido (YYYY-MM-DD)",
  ),
  value: z.number().min(0),
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export async function getTransactions() {
  return await db.select().from(transactions).orderBy(desc(transactions.date));
}

export async function getTransactionById(id: number) {
  const result = await db.select().from(transactions).where(
    eq(transactions.id, id),
  );
  return result[0] || null;
}

export async function createTransaction(data: InsertTransaction) {
  const validated = insertTransactionSchema.parse(data);
  const result = await db.insert(transactions).values(validated).returning();
  return result[0];
}

export async function updateTransaction(
  id: number,
  data: Partial<InsertTransaction>,
) {
  const validated = insertTransactionSchema.partial().parse(data);
  const result = await db.update(transactions).set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }).where(eq(transactions.id, id)).returning();
  return result[0];
}

export async function deleteTransaction(id: number) {
  await db.delete(transactions).where(eq(transactions.id, id));
}
