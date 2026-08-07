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
import { withSafeAction } from "../lib/action-utils.ts";

/**
 * actions.ts
 *
 * This file contains all Next.js Server Actions.
 * Clean Code Principle: Every action is wrapped with `withSafeAction` to ensure
 * robust error handling and avoid leaking server internals.
 */

export async function addProjectAction(
  data: Parameters<typeof createProject>[0],
) {
  return await withSafeAction(
    () => createProject(data),
    "Erro ao criar projeto",
  );
}
export async function editProjectAction(
  id: number,
  data: Parameters<typeof updateProject>[1],
) {
  return await withSafeAction(
    () => updateProject(id, data),
    "Erro ao atualizar projeto",
  );
}
export async function removeProjectAction(id: number) {
  return await withSafeAction(
    () => deleteProject(id),
    "Erro ao remover projeto",
  );
}

export async function addInventoryAction(
  data: Parameters<typeof createInventoryItem>[0],
) {
  return await withSafeAction(
    () => createInventoryItem(data),
    "Erro ao adicionar item ao estoque",
  );
}
export async function editInventoryAction(
  id: number,
  data: Parameters<typeof updateInventoryItem>[1],
) {
  return await withSafeAction(
    () => updateInventoryItem(id, data),
    "Erro ao atualizar item do estoque",
  );
}
export async function removeInventoryAction(id: number) {
  return await withSafeAction(
    () => deleteInventoryItem(id),
    "Erro ao remover item do estoque",
  );
}

export async function addEmployeeAction(
  data: Parameters<typeof createEmployee>[0],
) {
  return await withSafeAction(
    () => createEmployee(data),
    "Erro ao adicionar funcionário",
  );
}
export async function editEmployeeAction(
  id: number,
  data: Parameters<typeof updateEmployee>[1],
) {
  return await withSafeAction(
    () => updateEmployee(id, data),
    "Erro ao atualizar funcionário",
  );
}
export async function removeEmployeeAction(id: number) {
  return await withSafeAction(
    () => deleteEmployee(id),
    "Erro ao remover funcionário",
  );
}

export async function addTransactionAction(
  data: Parameters<typeof createTransaction>[0],
) {
  return await withSafeAction(
    () => createTransaction(data),
    "Erro ao adicionar transação",
  );
}
export async function editTransactionAction(
  id: number,
  data: Parameters<typeof updateTransaction>[1],
) {
  return await withSafeAction(
    () => updateTransaction(id, data),
    "Erro ao atualizar transação",
  );
}
export async function removeTransactionAction(id: number) {
  return await withSafeAction(
    () => deleteTransaction(id),
    "Erro ao remover transação",
  );
}

export async function saveSettingsAction(
  data: Parameters<typeof updateSettings>[0],
) {
  return await withSafeAction(
    () => updateSettings(data),
    "Erro ao salvar configurações",
  );
}
