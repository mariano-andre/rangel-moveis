// src/components/ui/Modal.tsx

"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {

  // fecha com Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    // overlay — clique fora fecha
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-md bg-bg-card border border-border-strong rounded-2xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()} // impede fechar ao clicar dentro
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
          <span className="text-sm font-medium text-text-primary">{title}</span>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
