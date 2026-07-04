import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700",
  primary: "bg-amber-600 text-white border border-amber-600 hover:bg-amber-700",
  ghost: "bg-transparent text-zinc-400 border border-transparent hover:bg-zinc-800",
};

export function Button({
  variant = "default",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
