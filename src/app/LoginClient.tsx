"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button.tsx";
import { Employee } from "@/lib/types/employees.ts";
import { loginEmployeeAction, loginManagerAction } from "./actions.ts";

interface LoginClientProps {
  employees: Employee[];
}

export function LoginClient({ employees }: LoginClientProps) {
  const [activeTab, setActiveTab] = useState<"manager" | "employee">("manager");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (activeTab === "manager") {
        const result = await loginManagerAction(password);
        if (!result.success) {
          setError(result.error);
          setIsLoading(false);
        } else {
          router.push("/projects");
        }
      } else {
        if (!selectedEmployeeId) {
          setError("Selecione um funcionário.");
          setIsLoading(false);
          return;
        }
        const result = await loginEmployeeAction(
          Number(selectedEmployeeId),
          password,
        );
        if (!result.success) {
          setError(result.error);
          setIsLoading(false);
        } else {
          router.push("/employee/projects");
        }
      }
    } catch (_err) {
      setError("Ocorreu um erro inesperado.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-app px-4">
      <div className="w-full max-w-md bg-bg-sidebar border border-border-strong rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center bg-bg-elevated border-b border-border-strong">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Rangel Móveis
          </h1>
          <p className="text-text-secondary text-sm">Acesse o sistema</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-strong">
          <button
            onClick={() => {
              setActiveTab("manager");
              setError(null);
              setPassword("");
            }}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "manager"
                ? "text-primary border-b-2 border-brand bg-bg-elevated"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
            }`}
          >
            Gestor
          </button>
          <button
            onClick={() => {
              setActiveTab("employee");
              setError(null);
              setPassword("");
            }}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === "employee"
                ? "text-primary border-b-2 border-brand bg-bg-elevated"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
            }`}
          >
            Funcionário
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-8 flex flex-col gap-5">
          {activeTab === "employee" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Selecione seu nome
              </label>
              <select
                className="input"
                value={selectedEmployeeId}
                onChange={(e) =>
                  setSelectedEmployeeId(Number(e.target.value) || "")}
                required
              >
                <option value="" disabled>
                  -- Selecione --
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">
              Senha
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={activeTab === "manager"
                ? "Sua senha"
                : "Sua senha (se houver)"}
              required={activeTab === "manager"}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-2 py-2.5"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
