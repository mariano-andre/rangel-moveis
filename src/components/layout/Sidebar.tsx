"use client";

// Menu lateral de navegação do painel do gestor.
// É um Client Component porque usa usePathname() para saber qual página está ativa e destacar o item correspondente.

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const mainNav: NavItem[] = [
  { label: "Financeiro", href: "/financial" },
  { label: "Projetos", href: "/projects" },
  { label: "Funcionários", href: "/employees" },
  { label: "Estoque", href: "/inventory" },
];

const systemNav: NavItem[] = [
  { label: "Configurações", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <aside className="w-70 shrink-0 flex flex-col bg-bg-sidebar border border-border-strong min-h-screen">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border-strong">
        <p className="text-base font-semibold text-primary">Rangel Móveis</p>
        <p className="text-xs text-text-primary/80 mt-0.5">Painel do gestor</p>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 px-2 py-3">
        <p className="text-[10px] uppercase tracking-widest text-text-secondary/80 px-2 mb-1">
          Principal
        </p>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
              isActive(item.href)
                ? "bg-brand text-text-primary"
                : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <p className="text-[10px] uppercase tracking-widest text-text-secondary/80 px-2 mt-4 mb-1">
          Sistema
        </p>
        {systemNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
              isActive(item.href)
                ? "bg-brand text-text-primary"
                : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
