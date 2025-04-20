// hooks/useOrders.ts
import { OrderData, orderService } from "@/service/orders.service";
import { useEffect, useState } from "react";

export const useGroupedOrders = () => {
  const [groupedOrders, setGroupedOrders] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await orderService.getAllOrders();
        const grouped = orders.reduce((acc, order) => {
          if (!acc[order.userId]) {
            acc[order.userId] = {
              userName: order.userName,
              callNumber: order.callNumber,
              whatsappNumber: order?.whatsappNumber,
              profileImage: order?.profileImage,
              email: order?.email,
              orders: [],
            };
          }
          acc[order.userId].orders.push(order);
          return acc;
        }, {});
        setGroupedOrders(grouped);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load orders")
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return { groupedOrders, loading, error };
};
