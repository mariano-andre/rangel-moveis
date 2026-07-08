// Cada string do vetor é o nome de uma etapa.
// A etapa atual é identificada pelo índice currentStepIndex.
export type ProjectStep = string;

export type ProjectStatus =
  | "in_progress"  // em andamento
  | "waiting"      // aguardando (material, cliente, etc.)
  | "completed"    // concluído
  | "paused";      // pausado

// Linha da tabela "projects" no banco
export interface Project {
  id: number;
  name: string;             // nome do projeto / cliente
  employeeId: number;       // FK → tabela "employees"
  deadline: string;         // ISO: YYYY-MM-DD
  value: number;            // valor do serviço em reais
  description: string;      // descrição livre
  steps: ProjectStep[];     // vetor de nomes de etapas, informado na criação
  currentStepIndex: number; // índice da etapa atual em steps[]
  status: ProjectStatus;
}

export interface ProjectsData {
  projects: Project[];
}
