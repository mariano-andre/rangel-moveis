import { db } from "@/db/index.ts";
import { employees, settings } from "@/db/schema.ts";
import { eq } from "drizzle-orm";

export async function verifyManagerPassword(
  password: string,
): Promise<boolean> {
  const result = await db.select().from(settings).where(eq(settings.id, 1));
  if (result.length === 0) return false;
  return result[0].managerPassword === password;
}

export async function verifyEmployeePassword(
  employeeId: number,
  password: string,
): Promise<boolean> {
  const result = await db.select().from(employees).where(
    eq(employees.id, employeeId),
  );
  if (result.length === 0) return false;
  const dbPassword = result[0].password || "";
  return dbPassword === password;
}
