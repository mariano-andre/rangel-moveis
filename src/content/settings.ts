import { Settings } from "@/lib/types";

export const settingsMock: Settings = {
  company: {
    name: "Rangel Móveis",
    phone: "(21) 99999-0000",
    monthlyRevenueGoal: 20000,
    defaultCommissionPercent: 12,
  },
  alerts: {
    lowInventory: true,
    deadlineApproaching: true,
    pendingPayment: false,
    weeklyFinancialSummary: true,
  },
};
