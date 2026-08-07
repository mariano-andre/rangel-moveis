"use client";

import { useState } from "react";
import { Project, ProjectStatus } from "@/lib/types";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";
import { NewProjectModal } from "@/components/sections/projects/NewProjectModal";
import { Button } from "@/components/ui/Button";

type Filter = "all" | ProjectStatus;
type SortKey = "createdAt" | "deadline";

const COMPLETED_PAGE_SIZE = 5; // projetos concluídos por página

const filters: { value: Filter; label: string }[] = [
  { value: "in_progress", label: "Em andamento" },
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

// ── Paginação ────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // gera array de páginas visíveis: sempre mostra até 5 ao redor da atual
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      Math.abs(i - currentPage) <= 2
    ) {
      pages.push(i);
    } else if (
      pages[pages.length - 1] !== "..."
    ) {
      pages.push("...");
    }
  }

  const btnBase = "min-w-[32px] h-8 px-2 rounded-lg text-xs border transition-colors";
  const btnActive = "bg-brand text-text-inverted border-brand";
  const btnDefault = "bg-bg-card text-text-secondary border-border-input hover:bg-bg-elevated hover:text-text-primary";
  const btnDisabled = "bg-transparent text-text-muted border-transparent cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault}`}
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="text-xs text-text-muted px-1">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnDefault}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnDefault}`}
      >
        →
      </button>
    </div>
  );
}

// ── Client principal ─────────────────────────────────────────

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects: initialProjects }: ProjectsClientProps) {
  const [projects, setProjects]         = useState<Project[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState<Filter>("in_progress");
  const [sortKey, setSortKey]           = useState<SortKey>("createdAt");
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [completedPage, setCompletedPage] = useState(1);

  // Reset da página ao trocar filtro ou ordenação
  function handleFilterChange(f: Filter) {
    setActiveFilter(f);
    setCompletedPage(1);
  }

  function handleSortChange(s: SortKey) {
    setSortKey(s);
    setCompletedPage(1);
  }

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

  // Filtragem e ordenação
  const filtered = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.status === activeFilter);

  const sorted = sortProjects(filtered, sortKey);

  // Paginação — aplicada apenas em projetos concluídos
  const isCompleted   = activeFilter === "completed";
  const totalPages    = isCompleted ? Math.ceil(sorted.length / COMPLETED_PAGE_SIZE) : 1;
  const visibleProjects = isCompleted
    ? sorted.slice((completedPage - 1) * COMPLETED_PAGE_SIZE, completedPage * COMPLETED_PAGE_SIZE)
    : sorted;

  return (
    <>
      {/* Barra de controles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
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
                  onClick={() => handleSortChange(s.value)}
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

      {/* Contador de resultados */}
      {isCompleted && sorted.length > 0 && (
        <p className="text-xs text-text-muted mb-4">
          {sorted.length} projeto{sorted.length !== 1 ? "s" : ""} concluído{sorted.length !== 1 ? "s" : ""} ·{" "}
          página {completedPage} de {totalPages}
        </p>
      )}

      {/* Cards */}
      {visibleProjects.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-12">
          Nenhum projeto nessa categoria.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onAdvanceStep={() => handleAdvanceStep(project.id)}
              onEdit={handleEditProject}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      <Pagination
        currentPage={completedPage}
        totalPages={totalPages}
        onChange={setCompletedPage}
      />

      {newModalOpen && (
        <NewProjectModal
          onClose={() => setNewModalOpen(false)}
          onSave={handleNewProject}
        />
      )}
    </>
  );
}
