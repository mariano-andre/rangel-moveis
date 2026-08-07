"use client";

import { useState } from "react";
import { Employee, Project, ProjectStatus } from "../../../lib/types/index.ts";
import { ProjectCard } from "./ProjectCard.tsx";
import { NewProjectModal } from "./NewProjectModal.tsx";
import { Button } from "../../ui/Button.tsx";
import { addProjectAction, editProjectAction } from "../../../app/actions.ts";

type Filter = "all" | ProjectStatus;
type SortKey = "createdAt" | "deadline";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "in_progress", label: "Em andamento" },
  { value: "waiting", label: "Aguardando" },
  { value: "completed", label: "Concluído" },
  { value: "paused", label: "Pausado" },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "createdAt", label: "Data de criação" },
  { value: "deadline", label: "Prazo" },
];

function sortProjects(projects: Project[], key: SortKey): Project[] {
  return [...projects].sort((a, b) => {
    if (key === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

interface ProjectsClientProps {
  projects: Project[];
  employees: Employee[];
}

export function ProjectsClient(
  { projects: initialProjects, employees }: ProjectsClientProps,
) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [newModalOpen, setNewModalOpen] = useState(false);

  async function handleAdvanceStep(projectId: number) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const newStepIndex = Math.min(
      project.currentStepIndex + 1,
      project.steps.length - 1,
    );

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return { ...p, currentStepIndex: newStepIndex };
      })
    );

    try {
      await editProjectAction(projectId, { currentStepIndex: newStepIndex });
    } catch (e) {
      console.error(e);
      // Rollback on error
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? project : p))
      );
    }
  }

  async function handleNewProject(data: Omit<Project, "id">) {
    try {
      const newProject = await addProjectAction(data);
      setProjects((prev) => [newProject as Project, ...prev]);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleEditProject(updated: Project) {
    try {
      const { id, createdAt: _createdAt, ...rest } = updated as any;
      const updatedProject = await editProjectAction(id, rest);
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? updatedProject as Project : p))
      );
    } catch (e) {
      console.error(e);
    }
  }

  const filtered = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.status === activeFilter);

  const sorted = sortProjects(filtered, sortKey);

  return (
    <>
      {/* Barra de controles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button type="button"
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                  activeFilter === f.value
                    ? "bg-brand text-text-inverted border-brand"
                    : "bg-bg-card text-text-secondary border-border-input hover:text-text-primary hover:bg-bg-elevated"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Ordenar por</span>
            <div className="flex gap-1.5">
              {sortOptions.map((s) => (
                <button type="button"
                  key={s.value}
                  onClick={() => setSortKey(s.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    sortKey === s.value
                      ? "bg-bg-elevated text-text-primary border-border-strong"
                      : "bg-transparent text-text-muted border-transparent hover:text-text-secondary"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button variant="primary" onClick={() => setNewModalOpen(true)}>
          + Novo projeto
        </Button>
      </div>

      {/* Cards */}
      {sorted.length === 0
        ? (
          <p className="text-sm text-text-muted text-center py-12">
            Nenhum projeto nessa categoria.
          </p>
        )
        : (
          <div className="flex flex-col gap-4">
            {sorted.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                employees={employees}
                onAdvanceStep={() => handleAdvanceStep(project.id)}
                onEdit={handleEditProject}
              />
            ))}
          </div>
        )}

      {newModalOpen && (
        <NewProjectModal
          employees={employees}
          onClose={() => setNewModalOpen(false)}
          onSave={handleNewProject}
        />
      )}
    </>
  );
}
