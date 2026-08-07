export type ContractType = "clt" | "commission";

// Linha da tabela "employees" no banco
export interface Employee {
  id: number;
  name: string;
  contractType: ContractType;
  password?: string;
  fixedSalary: number; // valor fixo mensal em reais (pode ser 0)
  commissionPercent: number; // percentual de comissão sobre o valor do serviço
}

export interface EmployeesData {
  employees: Employee[];
}
