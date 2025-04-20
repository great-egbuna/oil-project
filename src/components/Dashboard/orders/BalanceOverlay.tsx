// components/admin/BalanceUpdateOverlay.tsx
import { ButtonLoader } from "@/components/ui/Loader";
import Overlay from "@/components/ui/Overlay";
import { orderService } from "@/service/orders.service";
import { useState } from "react";
import { toast } from "react-toastify";

export const BalanceUpdateOverlay = ({ order, isOpen, onClose }) => {
  const [balance, setBalance] = useState(order?.outstandingBal || 0);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await orderService.updateOrderBalance(order.id, balance);

      if (res instanceof Error) {
        toast(res.message, {
          type: "error",
        });
      } else {
        toast("Update complete", {
          type: "success",
        });
      }

      onClose();
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Update Balance</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">New Balance</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-red text-white rounded hover:bg-red-600"
              disabled={updating}
            >
              {updating ? <ButtonLoader /> : "Update Balance"}
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  );
};
