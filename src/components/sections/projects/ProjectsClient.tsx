"use client";

import { useState } from "react";
import { Project, ProjectStatus } from "@/lib/types";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";

type Filter = "all" | ProjectStatus;
type SortKey = "id" | "deadline";

const filters: { value: Filter; label: string }[] = [
  { value: "all",         label: "Todos"        },
  { value: "in_progress", label: "Em andamento" },
  { value: "waiting",     label: "Aguardando"   },
  { value: "completed",   label: "Concluído"    },
  { value: "paused",      label: "Pausado"      },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "id",       label: "Data de criação" },
  { value: "deadline", label: "Prazo"           },
];

function sortProjects(projects: Project[], key: SortKey): Project[] {
  return [...projects].sort((a, b) => {
    if (key === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return a.id - b.id;
  });
}

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("id");

  const filtered = activeFilter === "all"
    ? projects
    : projects.filter((p) => p.status === activeFilter);

  const sorted = sortProjects(filtered, sortKey);

  return (
    <>
      {/* Barra de controles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

        {/* Filtros */}
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

        {/* Ordenação */}
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

      {/* Cards */}
      {sorted.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-12">
          Nenhum projeto nessa categoria.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
