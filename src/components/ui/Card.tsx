import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-bg-card rounded-xl border border-border-strong p-4 ${className}`}
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
    <div className="flex items-center gap-2 text-[14px] font-medium text-text-primary mb-3">
      {icon}
      {children}
    </div>
  );
}
