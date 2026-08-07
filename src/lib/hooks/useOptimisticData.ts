import { useState } from "react";
import { SafeActionResponse } from "@/lib/action-utils.ts";

/**
 * useOptimisticData.ts
 *
 * This hook abstracts optimistic UI state management and error rollbacks.
 * Clean Code Principle (SRP): Isolates UI state and network coordination from the presentational components.
 */

type Id = string | number;

interface Identifiable {
  id: Id;
}

export function useOptimisticData<T extends Identifiable>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);

  /**
   * Optimistically creates an item, invokes the server action, and rolls back if it fails.
   */
  async function optimisticCreate(
    newItemData: Omit<T, "id">,
    action: (data: Omit<T, "id">) => Promise<SafeActionResponse<T>>,
    temporaryId: Id,
  ) {
    const optimisticItem = { id: temporaryId, ...newItemData } as unknown as T;
    setData((prev) => [optimisticItem, ...prev]);

    const result = await action(newItemData);

    if (result.success) {
      // Replace optimistic item with real item from server
      setData((prev) =>
        prev.map((item) => (item.id === temporaryId ? result.data : item))
      );
    } else {
      // Rollback on failure
      console.error(result.error);
      setData((prev) => prev.filter((item) => item.id !== temporaryId));
      throw new Error(result.error);
    }
  }

  /**
   * Optimistically updates an item, invokes the server action, and rolls back if it fails.
   */
  async function optimisticUpdate(
    id: Id,
    updatedData: Partial<T>,
    action: (id: Id, data: Partial<T>) => Promise<SafeActionResponse<T>>,
  ) {
    const originalItem = data.find((item) => item.id === id);
    if (!originalItem) return;

    // Apply optimistic update
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );

    const result = await action(id, updatedData);

    if (result.success) {
      setData((prev) =>
        prev.map((item) => (item.id === id ? result.data : item))
      );
    } else {
      // Rollback
      console.error(result.error);
      setData((prev) =>
        prev.map((item) => (item.id === id ? originalItem : item))
      );
      throw new Error(result.error);
    }
  }

  /**
   * Optimistically deletes an item, invokes the server action, and rolls back if it fails.
   */
  async function optimisticDelete(
    id: Id,
    action: (id: Id) => Promise<SafeActionResponse<void>>,
  ) {
    const originalItem = data.find((item) => item.id === id);
    if (!originalItem) return;

    // Apply optimistic deletion
    setData((prev) => prev.filter((item) => item.id !== id));

    const result = await action(id);

    if (!result.success) {
      // Rollback
      console.error(result.error);
      setData((prev) => [...prev, originalItem]);
      throw new Error(result.error);
    }
  }

  return {
    data,
    setData, // Used for external sorts/filters if necessary
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
  };
}
