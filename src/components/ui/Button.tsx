import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "default" | "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-bg-elevated text-text-primary border border-border-input hover:bg-border-input",
  primary: "bg-brand text-text-inverted border border-brand hover:bg-brand-hover",
  ghost:   "bg-transparent text-text-secondary border border-transparent hover:bg-bg-elevated hover:text-text-primary",
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
