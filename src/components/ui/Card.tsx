import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-zinc-800/60 rounded-xl border border-zinc-700/60 p-4 ${className}`}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  icon?: ReactNode;
  children: ReactNode;
}

export function CardTitle({ icon, children }: CardTitleProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
      {icon}
      {children}
    </div>
  );
}
