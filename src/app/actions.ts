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

export async function addProjectAction(data: any) {
  return createProject(data);
}
export async function editProjectAction(id: number, data: any) {
  return updateProject(id, data);
}
export async function removeProjectAction(id: number) {
  return deleteProject(id);
}

export async function addInventoryAction(data: any) {
  return createInventoryItem(data);
}
export async function editInventoryAction(id: number, data: any) {
  return updateInventoryItem(id, data);
}
export async function removeInventoryAction(id: number) {
  return deleteInventoryItem(id);
}

export async function addEmployeeAction(data: any) {
  return createEmployee(data);
}
export async function editEmployeeAction(id: number, data: any) {
  return updateEmployee(id, data);
}
export async function removeEmployeeAction(id: number) {
  return deleteEmployee(id);
}

export async function addTransactionAction(data: any) {
  return createTransaction(data);
}
export async function editTransactionAction(id: number, data: any) {
  return updateTransaction(id, data);
}
export async function removeTransactionAction(id: number) {
  return deleteTransaction(id);
}

export async function saveSettingsAction(data: any) {
  return updateSettings(data);
}
