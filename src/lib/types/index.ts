// Re-exporta todos os tipos do sistema.
// Permite que os imports existentes continuem funcionando sem alteração:
// import { Transaction } from "@/lib/types" continua resolvendo normalmente.

export * from "./financial"
export * from "./projects"
export * from "./employees"
export * from "./inventory"
export * from "./settings"
