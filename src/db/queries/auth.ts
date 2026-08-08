import { db } from "@/db/index.ts";
import { employees } from "@/db/schema.ts";
import { eq } from "drizzle-orm";
import { getSettings } from "@/db/queries/settings.ts";

export async function verifyManagerPassword(
  password: string,
): Promise<boolean> {
  const settingsRow = await getSettings();
  return settingsRow.managerPassword === password;
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
