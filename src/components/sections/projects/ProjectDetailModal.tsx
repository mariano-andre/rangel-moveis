import { Employee, Project, ProjectStatus } from "@/lib/types/index.ts";
import { formatBRL, formatDateBR } from "@/lib/format.ts";
import { Modal } from "@/components/ui/Modal.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Icon } from "@/components/icons/index.ts";

interface ProjectDetailModalProps {
  project: Project;
  employees: Employee[];
  onClose: () => void;
  onEdit: () => void;
  onAdvanceStep: () => void;
  onCompleteProject: () => void;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  in_progress: {
    label: "Em andamento",
    className: "bg-brand-muted text-brand border-brand-border",
  },
  waiting: {
    label: "Aguardando",
    className: "bg-info-muted text-info border-info-border",
  },
  completed: {
    label: "Concluído",
    className: "bg-success-muted text-success border-success-border",
  },
  paused: {
    label: "Pausado",
    className: "bg-bg-elevated text-text-muted border-border-input",
  },
};

export function ProjectDetailModal(
  { project, employees, onClose, onEdit, onAdvanceStep, onCompleteProject }:
    ProjectDetailModalProps,
) {
  const employee = employees.find((e) => e.id === project.employeeId);
  const status = statusConfig[project.status];
  const isLastStep = project.currentStepIndex >= project.steps.length - 1;

  return (
    <Modal title="Detalhes do projeto" onClose={onClose} size="xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-medium text-text-primary">
            {project.name}
          </h2>
          {project.description && (
            <p className="text-xs text-text-secondary mt-1">
              {project.description}
            </p>
          )}
        </div>
        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Informações */}
      <div className="mb-6">
        <p className="text-[12px] font-bold uppercase text-text-muted mb-3">
          Informações
        </p>
        <div className="border-t border-border-soft">
          {[
            { label: "Responsável", value: employee?.name ?? "—" },
            { label: "Prazo", value: formatDateBR(project.deadline) },
            { label: "Valor", value: formatBRL(project.value) },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between items-center py-1.5 border-b border-border-soft"
            >
              <span className="text-sm text-text-muted">{row.label}</span>
              <span className="text-sm font-medium text-text-primary">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Etapas */}
      <div className="mb-6">
        <p className="text-[12px] font-bold uppercase text-text-muted mb-3">
          Etapas
        </p>
        <div className="flex flex-col gap-2.5">
          {project.steps.map((step, i) => {
            const isCompleted = project.status === "completed";
            const isDone = isCompleted || i < project.currentStepIndex;
            const isCurrent = !isCompleted && i === project.currentStepIndex;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-0.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isDone
                        ? "bg-success"
                        : isCurrent
                        ? "bg-brand"
                        : "border border-border-strong bg-transparent"
                    }`}
                  />
                  {i < project.steps.length - 1 && (
                    <div className="w-px h-4 bg-border-strong" />
                  )}
                </div>
                <div className="flex flex-col pb-1">
                  <span
                    className={`text-sm ${
                      isDone
                        ? "text-text-muted line-through"
                        : isCurrent
                        ? "text-text-primary font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {step}
                  </span>
                  {isCurrent && (
                    <span className="text-[11px] text-brand">Em andamento</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        {!isLastStep
          ? (
            <Button variant="success" onClick={onAdvanceStep}>
              Avançar para próxima etapa
              <Icon name="next" size={18} />
            </Button>
          )
          : project.status !== "completed"
          ? (
            <Button variant="success" onClick={onCompleteProject}>
              Concluir projeto
              <Icon name="apply" size={18} />
            </Button>
          )
          : <span />}
        <Button variant="primary" onClick={onEdit}>
          <Icon name="edit" size={18} />
          Editar projeto
        </Button>
      </div>
    </Modal>
  );
}
