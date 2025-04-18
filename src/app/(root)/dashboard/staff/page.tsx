"use client";

import StaffPageComponent from "@/components/Dashboard/staff/StaffPageComponent";
import { useUser } from "@/hooks/useUser";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffPage() {
  const router = useRouter();
  const { authenticatedUser } = useUser();
  const { authLoading } = useUserStoreNonPersist((state) => state);
  useEffect(() => {
    if (!authLoading) {
      if (authenticatedUser?.role !== "admin") router.push("/dashboard");
    }
  }, [authLoading]);

  return (
    <>
      <StaffPageComponent />
    </>
  );
}
