// hooks/useUserOrders.ts
import { userService } from "@/service/user.service";
import { useEffect, useState } from "react";

export const useUserOrders = (userId: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await userService.getOrders(userId);

        if (result instanceof Error) {
          setError(result);
        } else {
          setOrders(result);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load orders")
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  return { orders, loading, error };
};
