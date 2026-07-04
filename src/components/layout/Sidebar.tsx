"use client";

// Menu lateral de navegação do painel do gestor.
// É um Client Component porque usa usePathname() para saber
// qual página está ativa e destacar o item correspondente.

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const mainNav: NavItem[] = [
  { label: "Financeiro",   href: "/financial"   },
  { label: "Projetos",     href: "/projects"    },
  { label: "Funcionários", href: "/employees"   },
  { label: "Estoque",      href: "/inventory"   },
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
    <aside className="w-52 shrink-0 flex flex-col bg-zinc-950 border-r border-zinc-800 min-h-screen">

      {/* Logo */}
      <div className="px-4 py-5 border-b border-zinc-800">
        <p className="text-base font-semibold text-zinc-50">Rangel Móveis</p>
        <p className="text-xs text-zinc-500 mt-0.5">Painel do gestor</p>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 px-2 py-3">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600 px-2 mb-1">
          Principal
        </p>
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
              isActive(item.href)
                ? "bg-amber-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <p className="text-[10px] uppercase tracking-widest text-zinc-600 px-2 mt-4 mb-1">
          Sistema
        </p>
        {systemNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
              isActive(item.href)
                ? "bg-amber-600 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

    </aside>
  );
}
