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

export async function addProjectAction(data: unknown) {
  return await createProject(data);
}
export async function editProjectAction(id: number, data: unknown) {
  return await updateProject(id, data);
}
export async function removeProjectAction(id: number) {
  return await deleteProject(id);
}

export async function addInventoryAction(data: unknown) {
  return await createInventoryItem(data);
}
export async function editInventoryAction(id: number, data: unknown) {
  return await updateInventoryItem(id, data);
}
export async function removeInventoryAction(id: number) {
  return await deleteInventoryItem(id);
}

export async function addEmployeeAction(data: unknown) {
  return await createEmployee(data);
}
export async function editEmployeeAction(id: number, data: unknown) {
  return await updateEmployee(id, data);
}
export async function removeEmployeeAction(id: number) {
  return await deleteEmployee(id);
}

export async function addTransactionAction(data: unknown) {
  return await createTransaction(data);
}
export async function editTransactionAction(id: number, data: unknown) {
  return await updateTransaction(id, data);
}
export async function removeTransactionAction(id: number) {
  return await deleteTransaction(id);
}

export async function saveSettingsAction(data: unknown) {
  return await updateSettings(data);
}
