"use client";

// components/admin/UserOrders.tsx
import { useState } from "react";
import { useUserOrders } from "@/hooks/useOrders";
import { orderService } from "@/service/orders.service";
import { BalanceUpdateOverlay } from "./BalanceOverlay";
import { ButtonLoader, FullScreenLoader } from "@/components/ui/Loader";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";

export const AdminUserOrders = () => {
  const params = useParams();

  const [activeTab, setActiveTab] = useState<
    "confirmed" | "pending" | "canceled"
  >("pending");
  const [showBalanceForm, setShowBalanceForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { orders, loading, error } = useUserOrders(params?.id as string);
  const [submitting, setSubmitting] = useState(false);
  const [canceling, setIsCanceling] = useState(false);

  const confirmedOrders = orders.filter((o) => o.status === "confirmed");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const canceledOrders = orders.filter((o) => o.status === "canceled");
  const ordersArr = () => {
    if (activeTab === "pending") return pendingOrders;
    if (activeTab === "confirmed") return confirmedOrders;
    if (activeTab === "canceled") return canceledOrders;
  };

  const completeOrder = async (id) => {
    setSubmitting(true);
    const res = await orderService.updateOrderStatus(id, "confirmed");

    if (res instanceof Error) {
      toast(res.message, {
        type: "error",
      });
    } else {
      toast("Update complete", {
        type: "success",
      });
    }

    setShowBalanceForm(false);

    setSubmitting(false);
  };

  const cancelOrder = async (id) => {
    setIsCanceling(true);
    const res = await orderService.updateOrderStatus(id, "canceled");

    if (res instanceof Error) {
      toast(res.message, {
        type: "error",
      });
    } else {
      toast("Update complete", {
        type: "success",
      });
    }

    setShowBalanceForm(false);

    setIsCanceling(false);
  };

  if (loading) return <FullScreenLoader />;
return (
  <div className="p-6 max-sm:p-4">
    <div className="flex gap-4 mb-6 border-b max-sm:gap-2 max-sm:mb-4 max-sm:overflow-x-auto">
      <button
        onClick={() => setActiveTab("pending")}
        className={`pb-2 px-4 ${
          activeTab === "pending" ? "border-b-2 border-primary-red" : ""
        } max-sm:px-2 max-sm:text-sm`}
      >
        Pending ({pendingOrders.length})
      </button>
      <button
        onClick={() => setActiveTab("confirmed")}
        className={`pb-2 px-4 ${
          activeTab === "confirmed" ? "border-b-2 border-primary-red" : ""
        } max-sm:px-2 max-sm:text-sm`}
      >
        Confirmed ({confirmedOrders.length})
      </button>
      <button
        onClick={() => setActiveTab("canceled")}
        className={`pb-2 px-4 ${
          activeTab === "canceled" ? "border-b-2 border-primary-red" : ""
        } max-sm:px-2 max-sm:text-sm`}
      >
        Canceled ({canceledOrders.length})
      </button>
    </div>

    <div className="space-y-4 max-sm:space-y-3">
      {(activeTab === "pending" ? pendingOrders : confirmedOrders).map(
        (order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary-red/50 hover:shadow-md transition-shadow max-sm:p-3"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 max-sm:gap-2">
              <div className="space-y-1.5 max-sm:space-y-1">
                <h4 className="font-medium text-gray-900 text-base max-sm:text-sm truncate">
                  {order.productName}
                </h4>
                <div className="text-sm text-gray-500 space-y-1 max-sm:text-xs">
                  <p className="flex items-center gap-2 max-sm:gap-1">
                    <span className="text-gray-400 max-sm:hidden">
                      Quantity:
                    </span>
                    <span className="text-gray-400 sm:hidden">Qty:</span>
                    <span className="font-medium text-gray-600">
                      {order.quantity}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 max-sm:gap-1">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-medium text-green-600 truncate">
                      ₦{order.totalAmount.toLocaleString()}
                    </span>
                  </p>
                  <p
                    className={cn("flex items-center gap-2 max-sm:gap-1", {
                      hidden: activeTab === "confirmed",
                    })}
                  >
                    <span className="text-gray-400">Balance:</span>
                    <span className="font-medium text-primary-red truncate">
                      ₦{order.bal.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>

              {activeTab === "pending" && (
                <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row gap-2 max-sm:gap-1 max-sm:w-full">
                  <button
                    onClick={() => completeOrder(order.id)}
                    disabled={submitting}
                    className="px-3 py-1.5 bg-green-500/90 text-white rounded-md hover:bg-green-600 
           text-sm inline-flex items-center gap-2 justify-center transition-colors
           disabled:opacity-70 disabled:cursor-not-allowed max-sm:px-2 max-sm:text-xs max-sm:py-1"
                  >
                    {submitting ? (
                      <ButtonLoader />
                    ) : (
                      <>
                        <FaCheck className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                        <span className="max-sm:hidden">Confirm Order</span>
                        <span className="sm:hidden">Confirm</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowBalanceForm(true);
                    }}
                    className="px-3 py-1.5 bg-primary-red/90 text-white rounded-md hover:bg-red-600 
           text-sm inline-flex items-center gap-2 justify-center transition-colors
           max-sm:px-2 max-sm:text-xs max-sm:py-1"
                  >
                    <FaEdit className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                    <span>Balance</span>
                  </button>
                  <button
                    onClick={() => cancelOrder(order.id)}
                    disabled={canceling}
                    className="px-3 py-1.5 bg-red-800/90 text-white rounded-md hover:bg-red-900 
           text-sm inline-flex items-center gap-2 justify-center transition-colors
           disabled:opacity-70 disabled:cursor-not-allowed max-sm:px-2 max-sm:text-xs max-sm:py-1"
                  >
                    <FaTimes className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                    {canceling ? <ButtonLoader /> : <span>Cancel</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>

    <BalanceUpdateOverlay
      order={selectedOrder}
      isOpen={showBalanceForm}
      onClose={() => setShowBalanceForm(false)}
    />
  </div>
);
};
