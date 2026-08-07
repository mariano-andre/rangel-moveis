import { Sidebar } from "../../components/layout/Sidebar.tsx";
import { ReactNode } from "react";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-app">
      <Sidebar />
      <main className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
