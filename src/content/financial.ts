// Mock de dados financeiros — substituído futuramente por chamada ao backend.
// Estrutura pensada para mapear diretamente as entidades do banco de dados.

import { FinancialData } from "@/lib/types";

export const financialMock: FinancialData = {
  revenue: 18400,
  expenses: 11250,
  profit: 7150,
  receivable: 4200,
  receivablePendingCount: 2,

  revenueDeltaPercent: 12,
  expensesDeltaPercent: 4,
  profitDeltaPercent: 24,

  expensesByCategory: [
    { label: "Material", value: 5100 },
    { label: "Mão de obra", value: 3400 },
    { label: "Aluguel", value: 1500 },
    { label: "Outros", value: 1250 },
  ],

  monthlyHistory: [ //trocar mes para numeros
    { month: "Dez", value: 12400 },
    { month: "Jan", value: 15800 },
    { month: "Fev", value: 13200 },
    { month: "Mar", value: 17600 },
    { month: "Abr", value: 16400 },
    { month: "Mai", value: 18400 },
  ],

  transactions: [
    {
      id: 2,
      description: "Compra MDF 15mm — 20 chapas",
      type: "expense",
      category: "Material",
      date: "2025-05-14",
      value: 1840,
    },
    {
      id: 3,
      description: "Contrato com Jair Medrado",
      type: "income",
      date: "2025-05-12",
      value: 4000
    },
    {
      id: 4,
      description: "Ferragens e dobradiças",
      type: "expense",
      category: "Material",
      date: "2025-05-10",
      value: 620,
    },
    {
      id: 5,
      description: "Aluguel da oficina",
      type: "expense",
      category: "Aluguel",
      date: "2025-05-01",
      value: 1500,
    },
  ],
};
