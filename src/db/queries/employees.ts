import { db } from "@/db/index.ts";
import { employees } from "@/db/schema.ts";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const insertEmployeeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  contractType: z.enum(["clt", "commission"]),
  password: z.union([
    z.string().min(4, "Senha muito curta").max(100, "Senha muito longa"),
    z.literal(""),
  ]).optional(),
  fixedSalary: z.number().min(0).max(999999, "Salário muito alto"),
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

import { projects } from "@/db/schema.ts";

export async function deleteEmployee(id: number) {
  // Check if they have projects before deleting
  const existingProjects = await db.select().from(projects).where(
    eq(projects.employeeId, id),
  ).limit(1);
  if (existingProjects.length > 0) {
    throw new Error(
      "Não é possível remover: o funcionário possui projetos associados. Reatribua-os ou conclua-os primeiro.",
    );
  }
  await db.delete(employees).where(eq(employees.id, id));
}
