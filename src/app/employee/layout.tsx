import { EmployeeSidebar } from "@/components/layout/EmployeeSidebar.tsx";
import { ReactNode } from "react";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
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
