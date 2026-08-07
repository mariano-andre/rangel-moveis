import { getInventory } from "@/db/queries/inventory.ts";
import { InventoryClient } from "@/components/sections/inventory/InventoryClient.tsx";

export default async function EmployeeInventoryPage() {
  const items = await getInventory();
  return (
    <div className="p-6 md:p-8">
      <InventoryClient initialItems={items} />
    </div>
  );
}
