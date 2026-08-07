import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  ContractType,
  ExpenseCategoryLabel,
  InventoryUnit,
  ProjectStatus,
  TransactionType,
} from "@/lib/types/index.ts";

// Define the employees table with explicit $type to map to frontend types
export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contractType: text("contract_type").$type<ContractType>().notNull(), // 'clt' | 'commission'
  fixedSalary: real("fixed_salary").notNull(),
  commissionPercent: real("commission_percent").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
  updatedAt: text("updated_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id),
  createdAt: text("created_at").notNull(),
  deadline: text("deadline").notNull(),
  value: real("value").notNull(),
  description: text("description").notNull(),
  steps: text("steps", { mode: "json" }).$type<string[]>().notNull(),
  currentStepIndex: integer("current_step_index").notNull(),
  status: text("status").$type<ProjectStatus>().notNull(), // 'in_progress' | 'waiting' | 'completed' | 'paused'
  updatedAt: text("updated_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
});

export const inventory = sqliteTable("inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  material: text("material").notNull(),
  unit: text("unit").$type<InventoryUnit>().notNull(), // 'chapas' | 'unid.' | 'kg' | 'caixa' | 'metro' | 'litro'
  quantity: real("quantity").notNull(),
  minimum: real("minimum").notNull(),
  pricePerUnit: real("price_per_unit").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
  updatedAt: text("updated_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description").notNull(),
  type: text("type").$type<TransactionType>().notNull(), // 'income' | 'expense'
  category: text("category").$type<ExpenseCategoryLabel>(), // 'Material' | 'Mão de obra' | 'Aluguel' | 'Outros' (nullable)
  date: text("date").notNull(),
  value: real("value").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
  updatedAt: text("updated_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }), // Will only have id = 1
  companyName: text("company_name").notNull(),
  companyPhone: text("company_phone").notNull(),
  monthlyRevenueGoal: real("monthly_revenue_goal").notNull(),
  defaultCommissionPercent: real("default_commission_percent").notNull(),
  alertLowInventory: integer("alert_low_inventory", { mode: "boolean" })
    .notNull(),
  alertDeadlineApproaching: integer("alert_deadline_approaching", {
    mode: "boolean",
  }).notNull(),
  alertPendingPayment: integer("alert_pending_payment", { mode: "boolean" })
    .notNull(),
  alertWeeklyFinancialSummary: integer("alert_weekly_financial_summary", {
    mode: "boolean",
  }).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
  updatedAt: text("updated_at").notNull().$defaultFn(() =>
    new Date().toISOString()
  ),
});
