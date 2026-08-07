"use client";

import { useState } from "react";
import { Project, ProjectStatus } from "@/lib/types";
import { employeesMock } from "@/content/employees";
import { formatBRL, formatDateBR } from "@/lib/format";
import { ProjectDetailModal } from "@/components/sections/projects/ProjectDetailModal";
import { ConfirmStepModal } from "@/components/sections/projects/ConfirmStepModal";
import { EditProjectModal } from "@/components/sections/projects/EditProjectModal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons";

interface ProjectCardProps {
  project: Project;
  onAdvanceStep: () => void;
  onEdit: (updated: Project) => void;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  in_progress: { label: "Em andamento", className: "bg-brand-muted text-brand border-brand-border" },
  completed: { label: "Concluído", className: "bg-success-muted text-success border-success-border" },
  paused: { label: "Pausado", className: "bg-bg-elevated text-text-muted border-border-input" },
};

export function ProjectCard({ project, onAdvanceStep, onEdit }: ProjectCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const employee = employeesMock.employees.find((e) => e.id === project.employeeId);
  const status = statusConfig[project.status];
  const progress = project.steps.length > 1
    ? Math.round((project.currentStepIndex / (project.steps.length - 1)) * 100)
    : 100;
  const isLastStep = project.currentStepIndex >= project.steps.length - 1;
  const currentStep = project.steps[project.currentStepIndex];
  const nextStep = isLastStep ? null : project.steps[project.currentStepIndex + 1];

  return (
    <>
      <div className="bg-bg-card border border-border-strong rounded-xl p-5 flex flex-col gap-4 w-full">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-medium text-text-primary leading-snug">{project.name}</h3>
            <p className="text-xs text-text-secondary">
              Responsável: {employee?.name ?? "—"} · Prazo: {formatDateBR(project.deadline)} · {formatBRL(project.value)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${status.className}`}>
              {status.label}
            </span>
            <button
              onClick={() => setDetailOpen(true)}
              title="Ver detalhes"
              className="text-text-muted hover:text-text-primary transition-colors p-1"
            >
              <Icon name="details" size={18} />
            </button>
            <button
              onClick={() => setEditOpen(true)}
              title="Editar projeto"
              className="text-text-muted hover:text-text-primary transition-colors p-1"
            >
              <Icon name="edit" size={18} />
            </button>
          </div>
        </div>

        {/* Descrição */}
        {project.description && (
          <p className="text-xs text-text-secondary line-clamp-2">{project.description}</p>
        )}

        {/* Etapas */}
        <div className="flex flex-col gap-2.5">
          {project.steps.map((step, i) => {
            const isDone = i < project.currentStepIndex;
            const isCurrent = i === project.currentStepIndex;
            const isPending = i > project.currentStepIndex;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-0.5 pt-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isDone ? "bg-success" :
                      isCurrent ? "bg-brand" :
                        "border border-border-input bg-transparent"
                    }`} />
                  {i < project.steps.length - 1 && (
                    <div className="w-px h-4 bg-border-strong" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 pb-1">
                  <span className={`text-sm ${isDone ? "text-text-muted line-through" :
                      isCurrent ? "text-text-primary font-medium" :
                        "text-text-secondary"
                    }`}>
                    {step}
                  </span>
                  {isCurrent && <span className="text-[11px] text-brand">Em andamento</span>}
                  {isPending && <span className="text-[11px] text-text-muted">Não iniciado</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progresso + botão avançar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[11px] text-text-muted">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          {!isLastStep && (
            <Button variant="success" onClick={() => setConfirmOpen(true)} className="self-end mt-1">
              Avançar para próxima etapa
              <Icon name="next" size={18} />
            </Button>
          )}
        </div>

      </div>

      {detailOpen && (
        <ProjectDetailModal
          project={project}
          onClose={() => setDetailOpen(false)}
          onEdit={() => { setDetailOpen(false); setEditOpen(true); }}
          onAdvanceStep={() => setConfirmOpen(true)}
        />
      )}

      {editOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setEditOpen(false)}
          onSave={(updated) => { onEdit(updated); setEditOpen(false); }}
        />
      )}

      {confirmOpen && (
        <ConfirmStepModal
          currentStep={currentStep}
          nextStep={nextStep}
          onConfirm={onAdvanceStep}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
