/**
 * ProjectsClient.tsx
 *
 * Client component for managing Projects.
 *
 * Clean Code Principles Applied:
 * - Single Responsibility Principle: Data synchronization and optimistic rollbacks
 *   are abstracted into the `useOptimisticData` hook.
 * - Separation of Concerns: The component focuses entirely on presentation and filters.
 */

"use client";

import { useState } from "react";
import { Employee, Project, ProjectStatus } from "@/lib/types/index.ts";
import { ProjectCard } from "@/components/sections/projects/ProjectCard.tsx";
import { NewProjectModal } from "@/components/sections/projects/NewProjectModal.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { addProjectAction, editProjectAction } from "@/app/actions.ts";
import { useOptimisticData } from "@/lib/hooks/useOptimisticData.ts";

type Filter = "all" | ProjectStatus;
type SortKey = "createdAt" | "deadline";

const COMPLETED_PAGE_SIZE = 5; // projetos concluídos por página

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

  const btnBase =
    "min-w-[32px] h-8 px-2 rounded-lg text-xs border transition-colors";
  const btnActive = "bg-brand text-text-inverted border-brand";
  const btnDefault =
    "bg-bg-card text-text-secondary border-border-input hover:bg-bg-elevated hover:text-text-primary";
  const btnDisabled =
    "bg-transparent text-text-muted border-transparent cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnDefault}`}
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === "..."
          ? (
            <span
              key={`ellipsis-${i}`}
              className="text-xs text-text-muted px-1"
            >
              ...
            </span>
          )
          : (
            <button
              type="button"
              key={p}
              onClick={() => onChange(p as number)}
              className={`${btnBase} ${
                p === currentPage ? btnActive : btnDefault
              }`}
            >
              {p}
            </button>
          )
      )}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${
          currentPage === totalPages ? btnDisabled : btnDefault
        }`}
      >
        →
      </button>
    </div>
  );
}

// ── Client principal ─────────────────────────────────────────

interface ProjectsClientProps {
  projects: Project[];
  employees: Employee[];
  isEmployee?: boolean;
}

export function ProjectsClient(
  { projects: initialProjects, employees, isEmployee }: ProjectsClientProps,
) {
  // Use generic hook to manage projects state, eliminating duplicate rollback logic
  const { data: projects, optimisticCreate, optimisticUpdate } =
    useOptimisticData<Project>(initialProjects);

  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
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

  /**
   * Advances the project to the next step.
   * Optimistically updates the UI so the user gets instant feedback.
   */
  async function handleAdvanceStep(projectId: number) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const newStepIndex = Math.min(
      project.currentStepIndex + 1,
      project.steps.length - 1,
    );

    try {
      await optimisticUpdate(
        projectId,
        { currentStepIndex: newStepIndex },
        (id, updated) => editProjectAction(id as number, updated),
      );
    } catch (_e) {
      // The hook handles the rollback and logging automatically
    }
  }

  /**
   * Creates a new project and optimistically adds it to the list.
   */
  async function handleNewProject(data: Omit<Project, "id">) {
    const temporaryId = projects.length > 0
      ? Math.max(...projects.map((p) => p.id)) + 1
      : 1;

    try {
      await optimisticCreate(data, addProjectAction, temporaryId);
    } catch (_e) {
      // The hook handles the rollback and logging automatically
    }
  }

  /**
   * Updates an existing project.
   */
  async function handleEditProject(updated: Project) {
    try {
      const { id, createdAt: _createdAt, ...rest } = updated;
      await optimisticUpdate(
        id,
        rest,
        (actionId, updatedData) =>
          editProjectAction(actionId as number, updatedData),
      );
    } catch (_e) {
      // The hook handles the rollback and logging automatically
    }
  }

  // Filter and sort the final data to be rendered
  const filtered = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.status === activeFilter);

  const sorted = sortProjects(filtered, sortKey);

  // Paginação — aplicada apenas em projetos concluídos
  const isCompleted = activeFilter === "completed";
  const totalPages = isCompleted
    ? Math.ceil(sorted.length / COMPLETED_PAGE_SIZE)
    : 1;
  const visibleProjects = isCompleted
    ? sorted.slice(
      (completedPage - 1) * COMPLETED_PAGE_SIZE,
      completedPage * COMPLETED_PAGE_SIZE,
    )
    : sorted;

  return (
    <>
      {/* Barra de controles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                type="button"
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
                  type="button"
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
        {!isEmployee && (
          <Button
            variant="primary"
            onClick={() => setNewModalOpen(true)}
          >
            + Novo projeto
          </Button>
        )}
      </div>

      {/* Contador de resultados */}
      {isCompleted && sorted.length > 0 && (
        <p className="text-xs text-text-muted mb-4">
          {sorted.length} projeto{sorted.length !== 1 ? "s" : ""}{" "}
          concluído{sorted.length !== 1 ? "s" : ""} · página {completedPage} de
          {" "}
          {totalPages}
        </p>
      )}

      {/* Cards */}
      {visibleProjects.length === 0
        ? (
          <p className="text-sm text-text-muted text-center py-12">
            Nenhum projeto nessa categoria.
          </p>
        )
        : (
          <div className="flex flex-col gap-4">
            {visibleProjects.map((project) => (
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

      {/* Paginação */}
      <Pagination
        currentPage={completedPage}
        totalPages={totalPages}
        onChange={setCompletedPage}
      />

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
