"use client";

// components/admin/OrdersPage.tsx
import { FullScreenLoader } from "@/components/ui/Loader";
import { useGroupedOrders } from "@/hooks/useGroupedOrders";
import { useUser } from "@/hooks/useUser";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

export const OrdersPage = () => {
  const router = useRouter();
  const { groupedOrders, loading, error } = useGroupedOrders();

  const { authenticatedUser } = useUser();
  const { authLoading } = useUserStoreNonPersist((state) => state);

  useEffect(() => {
    if (!authLoading) {
      if (authenticatedUser?.role !== "admin") router.push("/dashboard");
    }
  }, [authLoading]);

  if (loading) return <FullScreenLoader />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        Orders by Users
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
        {Object.entries(groupedOrders).map(([userId, userOrders]) => (
          <button
            onClick={() => router.push(`/dashboard/orders/${userId}`)}
            key={userId}
            className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full text-left"
          >
            <div className="flex items-start gap-3 md:gap-4">
              {/* Profile Image */}
              {userOrders.profileImage ? (
                <img
                  src={userOrders.profileImage}
                  alt={userOrders.userName}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-primary-red/20"
                />
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary-red/10 flex items-center justify-center">
                  <span className="text-lg md:text-xl font-bold text-primary-red">
                    {userOrders.userName[0]}
                  </span>
                </div>
              )}

              {/* User Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                  {userOrders.userName}
                </h3>

                {/* Contact Information */}
                <div className="flex flex-col gap-2 text-xs md:text-sm">
                  <div className="flex items-start gap-2">
                    <FaPhone className="w-4 h-4 mt-1 flex-shrink-0" />
                    <a
                      href={`tel:${userOrders.callNumber}`}
                      className="truncate break-words min-w-0"
                    >
                      {userOrders.callNumber}
                    </a>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaWhatsapp className="w-4 h-4 mt-1 flex-shrink-0" />
                    <a
                      href={`https://wa.me/${userOrders.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate break-words min-w-0"
                    >
                      {userOrders.whatsappNumber}
                    </a>
                  </div>

                  <div className="flex items-start gap-2">
                    <FiMail className="mt-1 flex-shrink-0" />
                    <p className="text-gray-500 break-words min-w-0">
                      {userOrders.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Count */}
            <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-100">
              <p className="text-xs md:text-sm font-medium text-gray-600">
                Total Orders:{" "}
                <span className="text-primary-red">
                  {userOrders.orders.length}
                </span>
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
