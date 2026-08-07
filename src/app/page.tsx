import { getEmployees } from "@/db/queries/employees.ts";
import { LoginClient } from "./LoginClient.tsx";

export default async function Home() {
  const employees = await getEmployees();

  return <LoginClient employees={employees} />;
}
