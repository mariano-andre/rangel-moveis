import { db } from "@/db/index.ts";
import { projects } from "@/db/schema.ts";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const insertProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  employeeId: z.number().int().positive(),
  createdAt: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Formato de data inválido (YYYY-MM-DD)",
  ),
  deadline: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Formato de data inválido (YYYY-MM-DD)",
  ),
  value: z.number().min(0),
  description: z.string(),
  steps: z.array(z.string()),
  currentStepIndex: z.number().int().min(0),
  status: z.enum(["in_progress", "waiting", "completed", "paused"]),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;

export async function getProjects() {
  return await db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function getProjectById(id: number) {
  const result = await db.select().from(projects).where(eq(projects.id, id));
  return result[0] || null;
}

export async function getProjectsByEmployee(employeeId: number) {
  return await db.select().from(projects).where(
    eq(projects.employeeId, employeeId),
  ).orderBy(desc(projects.createdAt));
}

export async function createProject(data: InsertProject) {
  const validated = insertProjectSchema.parse(data);
  const result = await db.insert(projects).values(validated).returning();
  return result[0];
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const validated = insertProjectSchema.partial().parse(data);
  const result = await db.update(projects).set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }).where(eq(projects.id, id)).returning();
  return result[0];
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id));
}
