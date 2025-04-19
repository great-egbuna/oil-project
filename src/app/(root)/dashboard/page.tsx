"use client";

import AdminDashboardStats from "@/components/Dashboard/AdminDashboardContent";
import UserDashboardContent from "@/components/Dashboard/UserDashboardContent";
import UserTasks from "@/components/Dashboard/users/UserTask";
import { useUserStore } from "@/store/useUserStore";

export default function DashboardPage() {
  const authenticatedUser = useUserStore((state) => state.authenticatedUser);

  if (authenticatedUser?.role === "Staff") return <UserTasks />;

  if (authenticatedUser?.role === "admin") return <AdminDashboardStats />;

  return <UserDashboardContent />;
}
