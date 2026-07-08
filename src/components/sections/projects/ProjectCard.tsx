import { Project, ProjectStatus } from "@/lib/types";
import { employeesMock } from "@/content/employees";
import { formatBRL, formatDateBR } from "@/lib/format";

interface ProjectCardProps {
  project: Project;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  in_progress: { label: "Em andamento", className: "bg-brand-muted text-brand border-brand-border"       },
  waiting:     { label: "Aguardando",   className: "bg-info-muted text-info border-info-border"           },
  completed:   { label: "Concluído",    className: "bg-success-muted text-success border-success-border"  },
  paused:      { label: "Pausado",      className: "bg-bg-elevated text-text-muted border-border-input"   },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const employee    = employeesMock.employees.find((e) => e.id === project.employeeId);
  const status      = statusConfig[project.status];
  const currentStep = project.steps[project.currentStepIndex];
  const progress    = project.steps.length > 1
    ? Math.round((project.currentStepIndex / (project.steps.length - 1)) * 100)
    : 100;

  return (
    <div className="bg-bg-card border border-border-strong rounded-xl p-5 flex flex-col gap-4 w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-medium text-text-primary leading-snug">
            {project.name}
          </h3>
          <p className="text-xs text-text-secondary">
            Responsável: {employee?.name ?? "—"} · Prazo: {formatDateBR(project.deadline)} · {formatBRL(project.value)}
          </p>
        </div>
        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${status.className}`}>
          {status.label}
        </span>
      </div>

      {/* Descrição */}
      {project.description && (
        <p className="text-xs text-text-secondary line-clamp-2">{project.description}</p>
      )}

      {/* Etapas */}
      <div className="flex flex-col gap-2.5">
        {project.steps.map((step, i) => {
          const isDone    = i < project.currentStepIndex;
          const isCurrent = i === project.currentStepIndex;
          const isPending = i > project.currentStepIndex;

          return (
            <div key={i} className="flex items-start gap-3">
              {/* Indicador */}
              <div className="flex flex-col items-center gap-0.5 pt-0.5">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  isDone    ? "bg-brand" :
                  isCurrent ? "bg-success"   :
                              "border border-border-input bg-transparent"
                }`} />
                {i < project.steps.length - 1 && (
                  <div className="w-px h-4 bg-border-strong" />
                )}
              </div>

              {/* Texto */}
              <div className="flex flex-col gap-0.5 pb-1">
                <span className={`text-sm ${
                  isDone    ? "text-text-secondary/80 line-through" :
                  isCurrent ? "text-text-primary font-medium" :
                              "text-text-secondary"
                }`}>
                  {step}
                </span>
                {isCurrent && (
                  <span className="text-[11px] text-brand">Em andamento</span>
                )}
                {isPending && (
                  <span className="text-[11px] text-text-muted">Não iniciado</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de progresso */}
      <div>
        <div className="flex justify-between text-[11px] text-text-muted mb-1.5">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>
  );
}
