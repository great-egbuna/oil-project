"use client";

import DashboardLayoutComponent from "@/components/layout/DashboardLayout";
import { FullScreenLoader } from "@/components/ui/Loader";
import { authService } from "@/service/auth";
import { useUserStore, useUserStoreNonPersist } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const {
    authenticatedUser,
    isLoggedIn,
    setAuthenticatedUser,
    setIsLoggedIn,
    setRole,
    setUser,
  } = useUserStore((state) => state);
  const { authLoading } = useUserStoreNonPersist((state) => state);

  useEffect(() => {
    (async () => {
      if (!authLoading) {
        if (!isLoggedIn) {
          router.push("/");
        }
        if (authenticatedUser && authenticatedUser?.status === "blocked") {
          await authService.signOut();
          setUser(null);
          setAuthenticatedUser(null);
          setIsLoggedIn(false);
          setRole("");
          router.push("/");
        }
      }
    })();
  }, [authLoading, isLoggedIn, authenticatedUser]);

  if (authenticatedUser?.status === "blocked") return <FullScreenLoader />;

  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}
