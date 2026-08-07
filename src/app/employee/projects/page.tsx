import { ProjectsClient } from "@/components/sections/projects/ProjectsClient.tsx";
import { getProjectsByEmployee } from "@/db/queries/projects.ts";
import { getEmployeeById } from "@/db/queries/employees.ts";
import { getSession } from "@/lib/auth.ts";
import { redirect } from "next/navigation";

export default async function EmployeeProjectsPage() {
  const session = await getSession();
  if (!session || !session.employeeId) {
    redirect("/");
  }

  const projects = await getProjectsByEmployee(session.employeeId);
  const employee = await getEmployeeById(session.employeeId);
  const employees = employee ? [employee] : []; // Only pass the current employee

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-text-primary">Meus Projetos</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {projects.length} projeto{projects.length !== 1 ? "s" : ""}{" "}
          atribuído{projects.length !== 1 ? "s" : ""} a você
        </p>
      </div>

      <ProjectsClient projects={projects} employees={employees} />
    </div>
  );
}
