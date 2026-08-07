import { ReactNode } from "react";

type BadgeVariant = "green" | "red" | "gray" | "amber";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  amber: "bg-bg-elevated text-text-primary border-border-strong",
  green: "bg-success-muted text-success border-success-border",
  red: "bg-danger-muted text-danger border-danger-border",
  gray: "bg-bg-elevated text-text-primary border-border-strong",
  amber: "bg-amber-muted text-amber border-amber-border",
};

export function Badge({ variant = "gray", children }: BadgeProps) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${
        variantStyles[variant]
      }`}
    >
      {children}
    </span>
  );
}
