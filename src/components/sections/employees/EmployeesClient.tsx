// Responsável apenas por gerenciar estado e conectar os componentes.

"use client";

import { useState } from "react";
import { Employee } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { KpiCard } from "@/components/ui/KpiCard";
import { EmployeesTable } from "@/components/sections/employees/EmployeesTable";
import { EmployeeModal } from "@/components/sections/employees/EmployeeModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  addEmployeeAction,
  editEmployeeAction,
  removeEmployeeAction,
} from "@/app/actions";

interface EmployeesClientProps {
  initialEmployees: Employee[];
}

export function EmployeesClient({ initialEmployees }: EmployeesClientProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const totalFolha = employees.reduce((sum, e) => sum + e.fixedSalary, 0);
  const cltCount = employees.filter((e) => e.contractType === "clt").length;
  const commCount =
    employees.filter((e) => e.contractType === "commission").length;

  async function handleSave(data: Omit<Employee, "id">) {
    if (editing) {
      const original = employees.find((e) => e.id === editing.id);
      setEmployees((prev) =>
        prev.map((e) => e.id === editing.id ? { ...editing, ...data } : e)
      );
      try {
        await editEmployeeAction(editing.id, data);
      } catch (e) {
        console.error(e);
        if (original) {
          setEmployees((prev) =>
            prev.map((e) => e.id === editing.id ? original : e)
          );
        }
      }
    } else {
      const optimisticId = employees.length > 0
        ? Math.max(...employees.map((e) => e.id)) + 1
        : 1;
      const optimisticEmployee = { id: optimisticId, ...data };
      setEmployees((prev) => [...prev, optimisticEmployee]);
      try {
        const created = await addEmployeeAction(data);
        setEmployees((prev) =>
          prev.map((e) => e.id === optimisticId ? created : e)
        );
      } catch (e) {
        console.error(e);
        setEmployees((prev) => prev.filter((e) => e.id !== optimisticId));
      }
    }
  }

  async function handleDelete(id: number) {
    const original = employees.find((e) => e.id === id);
    if (!original) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    try {
      await removeEmployeeAction(id);
    } catch (e) {
      console.error(e);
      setEmployees((prev) => [...prev, original]);
    }
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
