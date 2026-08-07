import * as fs from "node:fs/promises";

async function run() {
  const files = [
    "src/components/layout/Sidebar.tsx",
    "src/lib/types/projects.ts",
    "src/components/sections/projects/ProjectDetailModal.tsx",
    "src/components/sections/projects/ProjectCard.tsx",
    "src/components/sections/financial/EditableCell.tsx",
    "src/components/sections/settings/AlertsForm.tsx",
    "src/components/sections/projects/ProjectsClient.tsx",
    "src/components/sections/financial/TransactionsTable.tsx",
    "src/components/sections/settings/CompanyForm.tsx",
    "src/components/sections/inventory/InventoryTable.tsx",
    "src/components/sections/inventory/InventoryClient.tsx"
  ];

  for (const file of files) {
    try {
      const content = await fs.readFile(file, "utf-8");
      if (content.includes("<<<<<<< HEAD")) {
        console.log(`\n\n--- FILE: ${file} ---`);
        const blocks = content.match(/<<<<<<< HEAD[\s\S]*?>>>>>>> master/g);
        if (blocks) {
          blocks.forEach(b => console.log(b));
        }
      }
    } catch(e) {
      // ignore
    }
  }
}
run();
