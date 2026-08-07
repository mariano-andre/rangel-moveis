import { ProjectsClient } from "../../../components/sections/projects/ProjectsClient.tsx";
import { getProjects } from "../../../db/queries/projects.ts";
import { getEmployees } from "../../../db/queries/employees.ts";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const employees = await getEmployees();

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-text-primary">Projetos</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {projects.length} projeto{projects.length !== 1 ? "s" : ""}{" "}
          cadastrado{projects.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ProjectsClient projects={projects} employees={employees} />
    </div>
  );
}
