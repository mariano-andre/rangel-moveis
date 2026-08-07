import { getSettings } from "@/db/queries/settings.ts";
import { SettingsClient } from "@/components/sections/settings/SettingsClient.tsx";

export default async function SettingsPage() {
  const settings = await getSettings();
  if (!settings) throw new Error("Settings not found");

  // Map flat settings to nested mock shape if needed by SettingsClient
  const mappedSettings = {
    company: {
      name: settings.companyName,
      phone: settings.companyPhone,
      managerPassword: settings.managerPassword,
      monthlyRevenueGoal: settings.monthlyRevenueGoal,
      defaultCommissionPercent: settings.defaultCommissionPercent,
    },
    alerts: {
      lowInventory: settings.alertLowInventory,
      deadlineApproaching: settings.alertDeadlineApproaching,
      pendingPayment: settings.alertPendingPayment,
      weeklyFinancialSummary: settings.alertWeeklyFinancialSummary,
    },
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-text-primary">Configurações</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Dados da empresa e preferências
        </p>
      </div>
      <SettingsClient initialSettings={mappedSettings} />
    </div>
  );
}
