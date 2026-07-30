import { inventoryMock } from "@/content/inventory";
import { InventoryClient } from "@/components/sections/inventory/InventoryClient";

export default function InventoryPage() {
  return (
    <div className="p-6 md:p-8">
      <InventoryClient initialItems={inventoryMock.items} />
    </div>
  );
}
