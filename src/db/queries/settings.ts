import { db } from "@/db/index.ts";
import { settings } from "@/db/schema.ts";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const updateSettingsSchema = z.object({
  companyName: z.string().min(1, "Nome é obrigatório"),
  companyPhone: z.string(),
  monthlyRevenueGoal: z.number().min(0),
  defaultCommissionPercent: z.number().min(0).max(100),
  alertLowInventory: z.boolean(),
  alertDeadlineApproaching: z.boolean(),
  alertPendingPayment: z.boolean(),
  alertWeeklyFinancialSummary: z.boolean(),
});

export type UpdateSettings = z.infer<typeof updateSettingsSchema>;

export async function getSettings() {
  const result = await db.select().from(settings).where(eq(settings.id, 1));
  if (result.length === 0) {
    const defaultSettings = await db.insert(settings).values({
      id: 1,
      companyName: "Minha Marcenaria",
      companyPhone: "",
      monthlyRevenueGoal: 10000,
      defaultCommissionPercent: 10,
      alertLowInventory: true,
      alertDeadlineApproaching: true,
      alertPendingPayment: true,
      alertWeeklyFinancialSummary: true,
    }).returning();
    return defaultSettings[0];
  }
  return result[0];
}

export async function updateSettings(data: Partial<UpdateSettings>) {
  const validated = updateSettingsSchema.partial().parse(data);
  const result = await db.update(settings).set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }).where(eq(settings.id, 1)).returning();
  return result[0];
}
