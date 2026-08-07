// Responsável apenas por gerenciar estado de UI, não contendo lógica complexa de cache ou reversões otimistas de banco de dados (transferidas para useOptimisticData).

"use client";

import { useState } from "react";
import { Employee } from "../../../lib/types/index.ts";
import { formatBRL } from "../../../lib/format.ts";
import { KpiCard } from "../../ui/KpiCard.tsx";
import { EmployeesTable } from "./EmployeesTable.tsx";
import { EmployeeModal } from "./EmployeeModal.tsx";
import { ConfirmModal } from "../../ui/ConfirmModal.tsx";
import {
  addEmployeeAction,
  editEmployeeAction,
  removeEmployeeAction,
} from "../../../app/actions.ts";
import { useOptimisticData } from "../../../lib/hooks/useOptimisticData.ts";

interface EmployeesClientProps {
  initialEmployees: Employee[];
}

export function EmployeesClient({ initialEmployees }: EmployeesClientProps) {
  // Utilizing the generic useOptimisticData hook separates business/optimistic logic from UI state
  const {
    data: employees,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticData<Employee>(initialEmployees);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const totalFolha = employees.reduce((sum, e) => sum + e.fixedSalary, 0);
  const cltCount = employees.filter((e) => e.contractType === "clt").length;
  const commCount =
    employees.filter((e) => e.contractType === "commission").length;

  async function handleSave(data: Omit<Employee, "id">) {
    if (editing) {
      try {
        await optimisticUpdate(
          editing.id,
          data,
          (id, updated) => editEmployeeAction(id as number, updated),
        );
      } catch (_e) {
        // Error already logged by hook, we could show a toast here if we had one
      }
    } else {
      const optimisticId = employees.length > 0
        ? Math.max(...employees.map((e) => e.id)) + 1
        : 1;

      try {
        await optimisticCreate(data, addEmployeeAction, optimisticId);
      } catch (_e) {
        // Toast notification could go here
      }
    }
  }

  async function handleDelete(id: number) {
    try {
      await optimisticDelete(id, (id) => removeEmployeeAction(id as number));
    } catch (_e) {
      // Toast notification could go here
    }
    setConfirmDeleteId(null);
  }

  function openEdit(employee: Employee) {
    setEditing(employee);
    setModalOpen(true);
  }

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  const employeeToDelete = employees.find((e) => e.id === confirmDeleteId);

  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard
          label="Total"
          value={String(employees.length)}
          delta="funcionários"
        />
        <KpiCard label="CLT" value={String(cltCount)} delta="contrato fixo" />
        <KpiCard
          label="Comissionados"
          value={String(commCount)}
          delta="por serviço"
        />
        <KpiCard
          label="Folha fixa"
          value={formatBRL(totalFolha)}
          delta="salários mensais"
        />
      </div>

      {/* Tabela */}
      <EmployeesTable
        employees={employees}
        onAdd={openNew}
        onEdit={openEdit}
        onDelete={setConfirmDeleteId}
      />

      {/* Modal de confirmação de exclusão */}
      {confirmDeleteId !== null && (
        <ConfirmModal
          title="Remover funcionário"
          message={
            <>
              Tem certeza que deseja remover{" "}
              <span className="font-medium text-text-primary">
                {employeeToDelete?.name}
              </span>
              ? Essa ação não pode ser desfeita.
            </>
          }
          confirmLabel="Remover"
          onConfirm={() => handleDelete(confirmDeleteId)}
          onClose={() => setConfirmDeleteId(null)}
        />
      )}

      {/* Modal de criação / edição */}
      {modalOpen && (
        <EmployeeModal
          employee={editing ?? undefined}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
