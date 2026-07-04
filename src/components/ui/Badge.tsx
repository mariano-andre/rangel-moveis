import { ReactNode } from "react";

type BadgeVariant = "green" | "red" | "amber" | "blue" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-green-950 text-green-400 border-green-800",
  red: "bg-red-950 text-red-400 border-red-800",
  amber: "bg-amber-950 text-amber-500 border-amber-800",
  blue: "bg-blue-950 text-blue-400 border-blue-800",
  gray: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export function Badge({ variant = "gray", children }: BadgeProps) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
