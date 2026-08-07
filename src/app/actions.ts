"use server";

import {
  createProject,
  deleteProject,
  updateProject,
} from "../db/queries/projects.ts";
import {
  createInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from "../db/queries/inventory.ts";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../db/queries/employees.ts";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../db/queries/financial.ts";
import { updateSettings } from "../db/queries/settings.ts";

export async function addProjectAction(data: Parameters<typeof createProject>[0]) {
  return await createProject(data);
}
export async function editProjectAction(id: number, data: Parameters<typeof updateProject>[1]) {
  return await updateProject(id, data);
}
export async function removeProjectAction(id: number) {
  return await deleteProject(id);
}

export async function addInventoryAction(data: Parameters<typeof createInventoryItem>[0]) {
  return await createInventoryItem(data);
}
export async function editInventoryAction(id: number, data: Parameters<typeof updateInventoryItem>[1]) {
  return await updateInventoryItem(id, data);
}
export async function removeInventoryAction(id: number) {
  return await deleteInventoryItem(id);
}

export async function addEmployeeAction(data: Parameters<typeof createEmployee>[0]) {
  return await createEmployee(data);
}
export async function editEmployeeAction(id: number, data: Parameters<typeof updateEmployee>[1]) {
  return await updateEmployee(id, data);
}
export async function removeEmployeeAction(id: number) {
  return await deleteEmployee(id);
}

export async function addTransactionAction(data: Parameters<typeof createTransaction>[0]) {
  return await createTransaction(data);
}
export async function editTransactionAction(id: number, data: Parameters<typeof updateTransaction>[1]) {
  return await updateTransaction(id, data);
}
export async function removeTransactionAction(id: number) {
  return await deleteTransaction(id);
}

export async function saveSettingsAction(data: Parameters<typeof updateSettings>[0]) {
  return await updateSettings(data);
}
