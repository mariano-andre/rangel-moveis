import { ProjectsData } from "../lib/types/index.ts";

export const projectsMock: ProjectsData = {
  projects: [
    {
      id: 1,
      name: "Cozinha planejada — Família Pereira",
      employeeId: 1,
      createdAt: "2025-04-30",
      deadline: "2025-05-28",
      value: 8500,
      description:
        "Cozinha completa com ilha central e acabamento laminado branco.",
      steps: [
        "Medição e projeto",
        "Corte e usinagem das peças",
        "Montagem e acabamento",
        "Instalação no cliente",
      ],
      currentStepIndex: 2,
      status: "in_progress",
    },
    {
      id: 2,
      name: "Armário escritório — Dr. Mendes",
      employeeId: 2,
      createdAt: "2025-05-08",
      deadline: "2025-06-05",
      value: 4200,
      description:
        "Armário embutido com nichos e portas de correr em MDF especial.",
      steps: [
        "Medição e projeto",
        "Corte e montagem",
        "Instalação",
      ],
      currentStepIndex: 0,
      status: "in_progress",
    },
    {
      id: 3,
      name: "Mesa de jantar — Sra. Lima",
      employeeId: 3,
      createdAt: "2025-05-10",
      deadline: "2025-06-15",
      value: 3100,
      description: "Mesa de jantar em madeira maciça para 8 pessoas.",
      steps: [
        "Corte das peças",
        "Montagem e lixamento",
        "Pintura e acabamento",
        "Entrega",
      ],
      currentStepIndex: 1,
      status: "in_progress",
    },
    {
      id: 4,
      name: "Guarda-roupa casal — Família Souza",
      employeeId: 4,
      createdAt: "2025-05-12",
      deadline: "2025-07-01",
      value: 6800,
      description: "Guarda-roupa com 6 portas, espelho e gavetas internas.",
      steps: [
        "Medição e projeto",
        "Compra de materiais",
        "Corte e usinagem",
        "Montagem",
        "Instalação",
      ],
      currentStepIndex: 0,
      status: "paused",
    },
    {
      id: 5,
      name: "Estante sala — Sr. Ramos",
      employeeId: 1,
      createdAt: "2025-03-15",
      deadline: "2025-04-20",
      value: 2400,
      description:
        "Estante modular com nichos abertos e fechados para sala de estar.",
      steps: [
        "Medição e projeto",
        "Corte e montagem",
        "Instalação",
      ],
      currentStepIndex: 2,
      status: "completed",
    },
  ],
};
