"use client";

import { useState } from "react";
import { Project, ProjectStatus } from "@/lib/types";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";
import { NewProjectModal } from "@/components/sections/projects/NewProjectModal";
import { Button } from "@/components/ui/Button";

type Filter = "all" | ProjectStatus;
type SortKey = "createdAt" | "deadline";

const filters: { value: Filter; label: string }[] = [
  { value: "all",         label: "Todos"        },
  { value: "in_progress", label: "Em andamento" },
  { value: "waiting",     label: "Aguardando"   },
  { value: "completed",   label: "Concluído"    },
  { value: "paused",      label: "Pausado"      },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "createdAt", label: "Data de criação" },
  { value: "deadline",  label: "Prazo"           },
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
}

export function ProjectsClient({ projects: initialProjects }: ProjectsClientProps) {
  const [projects, setProjects]         = useState<Project[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [sortKey, setSortKey]           = useState<SortKey>("createdAt");
  const [newModalOpen, setNewModalOpen] = useState(false);

  function handleAdvanceStep(projectId: number) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return { ...p, currentStepIndex: Math.min(p.currentStepIndex + 1, p.steps.length - 1) };
      })
    );
  }

  function handleNewProject(data: Omit<Project, "id">) {
    const newProject: Project = {
      ...data,
      id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
    };
    setProjects((prev) => [newProject, ...prev]);
  }

  function handleEditProject(updated: Project) {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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
              <button
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
                <button
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
      {sorted.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-12">
          Nenhum projeto nessa categoria.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onAdvanceStep={() => handleAdvanceStep(project.id)}
              onEdit={handleEditProject}
            />
          ))}
        </div>
      )}

      {newModalOpen && (
        <NewProjectModal
          onClose={() => setNewModalOpen(false)}
          onSave={handleNewProject}
        />
      )}
    </>
  );
}
