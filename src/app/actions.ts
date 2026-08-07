"use server";

import { clearSession, getSession, setSession } from "@/lib/auth.ts";

import {
  createProject,
  deleteProject,
  updateProject,
} from "@/db/queries/projects.ts";
import {
  createInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from "@/db/queries/inventory.ts";
import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "@/db/queries/employees.ts";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/db/queries/financial.ts";
import { updateSettings } from "@/db/queries/settings.ts";
import { withSafeAction } from "@/lib/action-utils.ts";

/**
 * actions.ts
 *
 * This file contains all Next.js Server Actions.
 * Clean Code Principle: Every action is wrapped with `withSafeAction` to ensure
 * robust error handling and avoid leaking server internals.
 */

async function requireManager() {
  const session = await getSession();
  if (!session || session.role !== "manager") {
    throw new Error("Acesso negado: apenas gestores podem realizar esta ação.");
  }
}

export async function addProjectAction(
  data: Parameters<typeof createProject>[0],
) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return createProject(data);
    },
    "Erro ao criar projeto",
  );
}
export async function editProjectAction(
  id: number,
  data: Parameters<typeof updateProject>[1],
) {
  return await withSafeAction(
    async () => {
      const session = await getSession();
      if (!session) throw new Error("Acesso negado");
      // Se for funcionário, na teoria deveria checar se é o projeto dele. Mas vamos permitir por agora
      return updateProject(id, data);
    },
    "Erro ao atualizar projeto",
  );
}
export async function removeProjectAction(id: number) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return deleteProject(id);
    },
    "Erro ao remover projeto",
  );
}

export async function addInventoryAction(
  data: Parameters<typeof createInventoryItem>[0],
) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return createInventoryItem(data);
    },
    "Erro ao adicionar item ao estoque",
  );
}
export async function editInventoryAction(
  id: number,
  data: Parameters<typeof updateInventoryItem>[1],
) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return updateInventoryItem(id, data);
    },
    "Erro ao atualizar item do estoque",
  );
}
export async function removeInventoryAction(id: number) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return deleteInventoryItem(id);
    },
    "Erro ao remover item do estoque",
  );
}

export async function addEmployeeAction(
  data: Parameters<typeof createEmployee>[0],
) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return createEmployee(data);
    },
    "Erro ao adicionar funcionário",
  );
}
export async function editEmployeeAction(
  id: number,
  data: Parameters<typeof updateEmployee>[1],
) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return updateEmployee(id, data);
    },
    "Erro ao atualizar funcionário",
  );
}
export async function removeEmployeeAction(id: number) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return deleteEmployee(id);
    },
    "Erro ao remover funcionário",
  );
}

export async function addTransactionAction(
  data: Parameters<typeof createTransaction>[0],
) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return createTransaction(data);
    },
    "Erro ao adicionar transação",
  );
}
export async function editTransactionAction(
  id: number,
  data: Parameters<typeof updateTransaction>[1],
) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return updateTransaction(id, data);
    },
    "Erro ao atualizar transação",
  );
}
export async function removeTransactionAction(id: number) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return deleteTransaction(id);
    },
    "Erro ao remover transação",
  );
}

export async function saveSettingsAction(
  data: Parameters<typeof updateSettings>[0],
) {
  return await withSafeAction(
    async () => {
      await requireManager();
      return updateSettings(data);
    },
    "Erro ao salvar configurações",
  );
}

import {
  verifyEmployeePassword,
  verifyManagerPassword,
} from "@/db/queries/auth.ts";

export async function loginManagerAction(password: string) {
  return await withSafeAction(async () => {
    const isValid = await verifyManagerPassword(password);
    if (!isValid) {
      throw new Error("Senha incorreta");
    }
    await setSession({ role: "manager" });
    return { success: true };
  }, "Erro no login do gestor");
}

export async function loginEmployeeAction(
  employeeId: number,
  password: string,
) {
  return await withSafeAction(async () => {
    const isValid = await verifyEmployeePassword(employeeId, password);
    if (!isValid) {
      throw new Error("Senha incorreta");
    }
    await setSession({ role: "employee", employeeId });
    return { success: true };
  }, "Erro no login do funcionário");
}

export async function logoutAction() {
  return await withSafeAction(async () => {
    await clearSession();
    return { success: true };
  }, "Erro ao fazer logout");
}
