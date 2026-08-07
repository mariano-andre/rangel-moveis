// Re-exporta todos os tipos do sistema.
// Permite que os imports existentes continuem funcionando sem alteração:
// import { Transaction } from "@/lib/types" continua resolvendo normalmente.

export * from "./financial.ts";
export * from "./projects.ts";
export * from "./employees.ts";
export * from "./inventory.ts";
export * from "./settings.ts";
