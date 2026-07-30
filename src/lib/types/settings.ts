export interface CompanySettings {
  name: string;
  phone: string;
  monthlyRevenueGoal: number;
  defaultCommissionPercent: number;
}

export interface AlertSettings {
  lowInventory: boolean;
  deadlineApproaching: boolean;
  pendingPayment: boolean;
  weeklyFinancialSummary: boolean;
}

export interface Settings {
  company: CompanySettings;
  alerts: AlertSettings;
}
