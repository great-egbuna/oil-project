"use client";

import SalesPage from "@/components/Dashboard/adminSales/AdminSalesPage";
import { FullScreenLoader } from "@/components/ui/Loader";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminSalesPage() {
  const router = useRouter();
  const { authenticatedUser } = useUserStore((state) => state);

  useEffect(() => {
    if (authenticatedUser?.role !== "admin") router.push("/dashboard");
  }, [authenticatedUser]);

  if (authenticatedUser?.role !== "admin") return <FullScreenLoader />;

  return (
    <>
      <SalesPage />
    </>
  );
}
