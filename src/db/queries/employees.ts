import { db } from "@/db/index.ts";
import { employees } from "@/db/schema.ts";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const insertEmployeeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  contractType: z.enum(["clt", "commission"]),
  fixedSalary: z.number().min(0),
  commissionPercent: z.number().min(0).max(100),
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export async function getEmployees() {
  return await db.select().from(employees).orderBy(employees.name);
}

export async function getEmployeeById(id: number) {
  const result = await db.select().from(employees).where(eq(employees.id, id));
  return result[0] || null;
}

export async function createEmployee(data: InsertEmployee) {
  const validated = insertEmployeeSchema.parse(data);
  const result = await db.insert(employees).values(validated).returning();
  return result[0];
}

export async function updateEmployee(
  id: number,
  data: Partial<InsertEmployee>,
) {
  const validated = insertEmployeeSchema.partial().parse(data);
  const result = await db.update(employees).set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }).where(eq(employees.id, id)).returning();
  return result[0];
}

export async function deleteEmployee(id: number) {
  // In a real app we might check if they have projects before deleting
  await db.delete(employees).where(eq(employees.id, id));
}
