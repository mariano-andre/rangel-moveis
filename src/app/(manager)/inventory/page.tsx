import { getInventory } from "@/db/queries/inventory";
import { InventoryClient } from "@/components/sections/inventory/InventoryClient";

export default async function InventoryPage() {
  const items = await getInventory();
  return (
    <div className="p-6 md:p-8">
      <InventoryClient initialItems={items} />
    </div>
  );
}
