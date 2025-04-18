"use client";

// components/DashboardStats.tsx
import { motion } from "framer-motion";
import { FaUsers, FaBox, FaShoppingCart, FaUser } from "react-icons/fa";
import { useStats } from "@/hooks/useStats";
import { FullScreenLoader } from "../ui/Loader";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { useEffect } from "react";

const StatCard = ({ icon: Icon, title, value, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color} text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </motion.div>
);

const AdminDashboardStats = () => {
  const router = useRouter();

  const { authenticatedUser } = useUser();
  const { authLoading } = useUserStoreNonPersist((state) => state);

  const { stats, loading, error } = useStats();

  useEffect(() => {
    if (!authLoading) {
      if (authenticatedUser?.role !== "admin") router.push("/dashboard");
    }
  }, [authLoading]);

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

  if (!stats) return null;

  const statItems = [
    {
      icon: FaUser,
      title: "Dealers",
      value: stats.dealerCount,
      color: "bg-blue-500",
    },
    {
      icon: FaUsers,
      title: "Distributors",
      value: stats.distributorCount,
      color: "bg-green-500",
    },
    {
      icon: FaUser,
      title: "Staff",
      value: stats.staffCount,
      color: "bg-purple-500",
    },
    {
      icon: FaUsers,
      title: "Other Users",
      value: stats.othersCount,
      color: "bg-yellow-500",
    },
    {
      icon: FaShoppingCart,
      title: "Orders",
      value: stats.orderCount,
      color: "bg-pink-500",
    },
    {
      icon: FaBox,
      title: "Products",
      value: stats.productCount,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {statItems.map((item, index) => (
        <StatCard
          key={index}
          icon={item.icon}
          title={item.title}
          value={item.value}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default AdminDashboardStats;
