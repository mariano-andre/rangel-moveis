"use client";

import { ReactNode, useEffect } from "react";

type ModalSize = "md" | "lg" | "xl";

const sizeStyles: Record<ModalSize, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
}

export function Modal({ title, onClose, children, size = "md" }: ModalProps) {
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
        className={`relative w-full ${
          sizeStyles[size]
        } bg-bg-card border border-border-strong rounded-2xl shadow-2xl`}
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
