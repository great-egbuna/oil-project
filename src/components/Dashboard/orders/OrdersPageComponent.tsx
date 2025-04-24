import { FullScreenLoader } from "@/components/ui/Loader";
import { useUserOrders } from "@/hooks/useOrders";
import { useUserStore } from "@/store/useUserStore";
import { motion } from "framer-motion";
import { useState } from "react";

const OrderCard = ({
  order,
  isPending,
}: {
  order: any;
  isPending?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 w-full md:min-w-[400px] flex-1 relative"
  >
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {order.productName}
        </h3>
        <div className="mt-2 space-y-1">
          <p className="text-gray-500 text-sm">Quantity: {order.quantity}</p>
          {isPending && order.bal && (
            <p className="text-sm text-primary-red">
              Balance: ₦{order.bal.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-primary-red">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(order.totalAmount)}
        </p>
        <span
          className={`px-2 py-1 rounded-full text-xs mt-1 ${
            order.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : order.status === "canceled"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {order.status}
        </span>
      </div>
    </div>
  </motion.div>
);

const UserOrders = ({ orders }) => {
  const [activeTab, setActiveTab] = useState<
    "pending" | "confirmed" | "canceled"
  >("pending");

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col space-y-4">
        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 ">
          {["pending", "confirmed", "canceled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary-red text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} orders found
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isPending={activeTab === "pending"}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
