"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons/index.ts";
import { IconName } from "@/components/icons/icons.ts";
import { logoutAction } from "@/app/actions.ts";

interface NavItem {
  icon: IconName;
  label: string;
  href: string;
}

const employeeNav: NavItem[] = [
  { icon: "projects", label: "Meus Projetos", href: "/employee/projects" },
  { icon: "inventory", label: "Estoque", href: "/employee/inventory" },
];

export function EmployeeSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-bg-sidebar border-b border-border-strong flex items-center justify-between px-4 z-40">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-primary leading-tight">
            Rangel Móveis
          </p>
          <p className="text-[10px] text-text-primary/80">
            Painel do Funcionário
          </p>
        </div>
        <button type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-text-primary p-2"
        >
          <Icon name={isOpen ? "cancel" : "menu"} size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        w-64 shrink-0 flex flex-col bg-bg-sidebar border-r border-border-strong min-h-screen fixed z-50
        transition-transform duration-300 md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo (Desktop Only) */}
        <div className="hidden md:block px-4 py-5 border-b border-border-strong">
          <p className="text-base font-semibold text-primary">Rangel Móveis</p>
          <p className="text-xs text-text-primary/80 mt-0.5">
            Painel do Funcionário
          </p>
        </div>

        {/* Mobile menu title */}
        <div className="md:hidden px-4 py-4 border-b border-border-strong flex justify-between items-center">
          <p className="text-base font-semibold text-primary">Menu</p>
          <button type="button"
            onClick={() => setIsOpen(false)}
            className="text-text-primary"
          >
            <Icon name="cancel" size={20} />
          </button>
        </div>

        {/* Nav principal */}
        <nav className="flex-1 px-2 py-3 flex flex-col justify-between overflow-y-auto">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary/80 px-2 mb-1">
              Principal
            </p>
            {employeeNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                  isActive(item.href)
                    ? "bg-brand text-text-primary"
                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                }`}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <button type="button"
              onClick={() => {
                logoutAction().then(() => globalThis.location.href = "/");
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Icon name="cancel" size={18} />
              Sair
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
