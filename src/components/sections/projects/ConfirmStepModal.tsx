import { Modal } from "../../ui/Modal.tsx";

interface ConfirmStepModalProps {
  currentStep: string;
  nextStep: string | null; // null = última etapa
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmStepModal({
  currentStep,
  nextStep,
  onConfirm,
  onClose,
}: ConfirmStepModalProps) {
  return (
    <Modal title="Avançar etapa" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="bg-bg-elevated rounded-lg p-4 flex flex-col gap-3 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-text-muted mb-0.5">
              Etapa atual
            </p>
            <p className="text-text-primary font-medium">{currentStep}</p>
          </div>
          {nextStep && (
            <>
              <div className="w-full h-px bg-border-soft" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text-muted mb-0.5">
                  Próxima etapa
                </p>
                <p className="text-brand font-medium">{nextStep}</p>
              </div>
            </>
          )}
        </div>

        <p className="text-sm text-text-secondary">
          {nextStep
            ? "Tem certeza que deseja concluir a etapa atual e avançar para a próxima?"
            : "Esta é a última etapa. Tem certeza que deseja concluí-la?"}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-text-secondary border border-border-input bg-bg-elevated hover:text-text-primary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-brand text-text-inverted hover:bg-brand-hover transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}
