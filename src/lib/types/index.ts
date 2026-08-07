// Re-exporta todos os tipos do sistema.
// Permite que os imports existentes continuem funcionando sem alteração:
// import { Transaction } from "@/lib/types" continua resolvendo normalmente.

export * from "@/lib/types/financial.ts";
export * from "@/lib/types/projects.ts";
export * from "@/lib/types/employees.ts";
export * from "@/lib/types/inventory.ts";
export * from "@/lib/types/settings.ts";
