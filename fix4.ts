import * as fs from "node:fs/promises";

async function run() {
  const replaceInFile = async (filePath: string, search: RegExp | string, replace: string) => {
    const content = await fs.readFile(filePath, "utf-8");
    await fs.writeFile(filePath, content.replace(search, replace));
  };

  // Re-add new line just in case deno fmt fails to
  await replaceInFile("src/db/schema.ts", "} from \\"../lib/types/index.ts\\";export const", "} from \\"../lib/types/index.ts\\";\\n\\nexport const");

  await replaceInFile("src/app/(manager)/employees/page.tsx", "initialEmployees={employees as any}", "initialEmployees={employees}");
  await replaceInFile("src/app/(manager)/financial/page.tsx", "initialTransactions={data.transactions as any}", "initialTransactions={data.transactions}");
  await replaceInFile("src/app/(manager)/inventory/page.tsx", "initialItems={items as any}", "initialItems={items}");
  await replaceInFile("src/app/(manager)/projects/page.tsx", "projects={projects as any} employees={employees as any}", "projects={projects} employees={employees}");
  
  await replaceInFile("src/components/sections/settings/SettingsClient.tsx", "await saveSettingsAction({ ...company, ...alerts } as any)", "await saveSettingsAction({ ...company, ...alerts })");
  
  // Replace all generic "as any" in client components that were added to fix TS errors temporarily
  for (const file of [
    "src/components/sections/employees/EmployeesClient.tsx",
    "src/components/sections/financial/FinancialClient.tsx",
    "src/components/sections/projects/ProjectsClient.tsx"
  ]) {
    let content = await fs.readFile(file, "utf-8");
    content = content.replaceAll(" as any", "");
    await fs.writeFile(file, content);
  }
}
run();
