import { EmployeeSidebar } from "@/components/layout/EmployeeSidebar.tsx";
import { ReactNode } from "react";
import { getSession } from "@/lib/auth.ts";
import { redirect } from "next/navigation";

export default async function EmployeeLayout(
  { children }: { children: ReactNode },
) {
  const session = await getSession();

  if (!session || session.role !== "employee") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-bg-app">
      <EmployeeSidebar />
      <main className="flex-1 flex flex-col md:ml-64 pt-14 md:pt-0 overflow-y-auto w-full">
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
