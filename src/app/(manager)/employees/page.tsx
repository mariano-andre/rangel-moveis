import { getEmployees } from "@/db/queries/employees";
import { EmployeesClient } from "@/components/sections/employees/EmployeesClient";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-text-primary">Funcionários</h1>
        <p className="text-sm text-text-muted mt-0.5">Equipe e remuneração</p>
      </div>
      <EmployeesClient initialEmployees={employees} />
    </div>
  );
}
