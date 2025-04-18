import { FullScreenLoader } from "@/components/ui/Loader";
import { useUserOrders } from "@/hooks/useOrders";
import { useUserStore } from "@/store/useUserStore";
import { motion } from "framer-motion";

const OrderCard = ({ order }: { order: any }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    whileHover={{ scale: 1.02 }}
    className="flex-shrink-0 bg-white rounded-xl shadow-md p-6 mr-6 hover:shadow-lg transition-all duration-300"
    style={{ minWidth: "300px" }}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {order.productName}
        </h3>
        <p className="text-gray-500 text-sm mt-1">Quantity: {order.quantity}</p>
      </div>

    {/*   <span
        className={`px-3 py-1 rounded-full text-sm ${
          order.status === "completed"
            ? "bg-green-100 text-green-800"
            : order.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {order.status}
      </span> */}
    </div>

    <div className="mt-4 border-t pt-4">
      <p className="text-lg font-bold text-primary-red">
        {new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(order.totalAmount)}
      </p>
    </div>
  </motion.div>
);

const UserOrders = ({ orders }) => {
  return (
    <div>
      <motion.div
        className="flex overflow-x-auto pb-4 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </motion.div>
    </div>
  );
};

export default UserOrders;
