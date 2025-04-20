"use client";

import { useUserStore } from "@/store/useUserStore";
import UserOrders from "./orders/OrdersPageComponent";
import { FullScreenLoader } from "../ui/Loader";
import { useUserOrders } from "@/hooks/useOrders";

export default function UserDashboardContent() {
  const authenticatedUser = useUserStore((state) => state.authenticatedUser);
  const { orders, loading, error } = useUserOrders(
    authenticatedUser?.userId as string
  );

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        Error: {error.message}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
        No orders found
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 ">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Your Orders
        </h2>
      </div>

      <div>
        <UserOrders orders={orders} />
      </div>
    </div>
  );
}
