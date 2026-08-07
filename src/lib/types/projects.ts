export type ProjectStep = string;

export type ProjectStatus =
  | "in_progress" // em andamento
  | "waiting" // aguardando (material, cliente, etc.)
  | "completed" // concluído
  | "paused"; // pausado

// Linha da tabela "projects" no banco
export interface Project {
  id: number;
  name: string; // nome do projeto / cliente
  employeeId: number; // FK → tabela "employees"
  createdAt: string; // ISO: YYYY-MM-DD — data de criação do projeto
  deadline: string; // ISO: YYYY-MM-DD — prazo de entrega
  value: number; // valor do serviço em reais
  description: string; // descrição livre
  steps: ProjectStep[]; // vetor de nomes de etapas, informado na criação
  currentStepIndex: number; // índice da etapa atual em steps[]
  status: ProjectStatus;
}

export interface ProjectsData {
  projects: Project[];
}
