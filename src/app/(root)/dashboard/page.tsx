"use client";

import AdminDashboardStats from "@/components/Dashboard/AdminDashboardContent";
import UserDashboardContent from "@/components/Dashboard/UserDashboardContent";
import { useUserStore } from "@/store/useUserStore";

export default function DashboardPage() {
  const authenticatedUser = useUserStore((state) => state.authenticatedUser);

  console.log("authenticatedUser", authenticatedUser);

  if (authenticatedUser?.role === "admin")
    return (
      <h1 className="text-2xl font-bold mb-6">
        <AdminDashboardStats />
      </h1>
    );

  return (
    <h1 className="text-2xl font-bold mb-6">
      <UserDashboardContent />
    </h1>
  );
}
