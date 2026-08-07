import { db } from "@/db/index.ts";
import {
  employees,
  inventory,
  projects,
  settings,
  transactions,
} from "@/db/schema.ts";
import { employeesMock } from "@/content/employees.ts";
import { projectsMock } from "@/content/projects.ts";
import { inventoryMock } from "@/content/inventory.ts";
import { financialMock } from "@/content/financial.ts";
import { settingsMock } from "@/content/settings.ts";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data (optional, but good for idempotency during development)
  await db.delete(projects);
  await db.delete(employees);
  await db.delete(inventory);
  await db.delete(transactions);
  await db.delete(settings);

  console.log("Cleared existing data.");

  // Seed Employees
  console.log("Seeding employees...");
  for (const emp of employeesMock.employees) {
    await db.insert(employees).values({
      id: emp.id,
      name: emp.name,
      contractType: emp.contractType,
      fixedSalary: emp.fixedSalary,
      commissionPercent: emp.commissionPercent,
    });
  }

  // Seed Projects
  console.log("Seeding projects...");
  for (const proj of projectsMock.projects) {
    await db.insert(projects).values({
      id: proj.id,
      name: proj.name,
      employeeId: proj.employeeId,
      createdAt: proj.createdAt,
      deadline: proj.deadline,
      value: proj.value,
      description: proj.description,
      steps: proj.steps,
      currentStepIndex: proj.currentStepIndex,
      status: proj.status,
    });
  }

  // Seed Inventory
  console.log("Seeding inventory...");
  for (const item of inventoryMock.items) {
    await db.insert(inventory).values({
      id: item.id,
      material: item.material,
      unit: item.unit,
      quantity: item.quantity,
      minimum: item.minimum,
      pricePerUnit: item.pricePerUnit,
    });
  }

  // Seed Transactions
  console.log("Seeding transactions...");
  for (const txn of financialMock.transactions) {
    await db.insert(transactions).values({
      id: txn.id,
      description: txn.description,
      type: txn.type,
      category: txn.category || null,
      date: txn.date,
      value: txn.value,
    });
  }

  // Seed Settings
  console.log("Seeding settings...");
  await db.insert(settings).values({
    id: 1,
    companyName: settingsMock.company.name,
    companyPhone: settingsMock.company.phone,
    monthlyRevenueGoal: settingsMock.company.monthlyRevenueGoal,
    defaultCommissionPercent: settingsMock.company.defaultCommissionPercent,
    alertLowInventory: settingsMock.alerts.lowInventory,
    alertDeadlineApproaching: settingsMock.alerts.deadlineApproaching,
    alertPendingPayment: settingsMock.alerts.pendingPayment,
    alertWeeklyFinancialSummary: settingsMock.alerts.weeklyFinancialSummary,
  });

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
