// Mock de dados financeiros — substituído futuramente por chamada ao backend.
// Contém apenas dados brutos: transactions, histórico mensal e valores a receber.
// revenue, expenses, profit e expensesByCategory são calculados em calculations.ts.

import { FinancialData } from "@/lib/types";

export const financialMock: FinancialData = {

  // Fonte de verdade — equivale à tabela "transactions" no banco.
  transactions: [
    {
      id: 1,
      description: "Compra MDF 15mm — 20 chapas",
      type: "expense",
      category: "Material",
      date: "2025-05-14",
      value: 1840,
    },
    {
      id: 2,
      description: "Contrato com Jair Medrado",
      type: "income",
      date: "2025-05-12",
      value: 4000,
    },
    {
      id: 3,
      description: "Ferragens e dobradiças",
      type: "expense",
      category: "Material",
      date: "2025-05-10",
      value: 800,
    },
    {
      id: 4,
      description: "Aluguel da oficina",
      type: "expense",
      category: "Aluguel",
      date: "2025-05-01",
      value: 1500,
    },
    {
      id: 5,
      description: "Pagamento Marcelo",
      type: "expense",
      category: "Mão de obra",
      date: "2025-05-12",
      value: 3000,
    },
    {
      id: 6,
      description: "Armário - Luiz Silva",
      type: "income",
      date: "2025-05-17",
      value: 4000,
    },
  ],

  // Futuramente calculado no backend agrupando transactions por mês.
  // Por enquanto fixo pois exigiria transações de meses anteriores no mock.
  monthlyHistory: [
    { month: "Dez", value: 12400 },
    { month: "Jan", value: 15800 },
    { month: "Fev", value: 13200 },
    { month: "Mar", value: 17600 },
    { month: "Abr", value: 16400 },
    { month: "Mai", value: 18400 },
  ],

  // Futura tabela "receivables" no banco.
  receivable: 4200,
  receivablePendingCount: 2,
};
