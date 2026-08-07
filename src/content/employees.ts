import { EmployeesData } from "@/lib/types/index.ts";

export const employeesMock: EmployeesData = {
  employees: [
    {
      id: 1,
      name: "Carlos",
      contractType: "clt",
      fixedSalary: 2400,
      commissionPercent: 8,
    },
    {
      id: 2,
      name: "João",
      contractType: "clt",
      fixedSalary: 2200,
      commissionPercent: 8,
    },
    {
      id: 3,
      name: "Marcos",
      contractType: "commission",
      fixedSalary: 0,
      commissionPercent: 12,
    },
    {
      id: 4,
      name: "Pedro",
      contractType: "commission",
      fixedSalary: 0,
      commissionPercent: 12,
    },
  ],
};
