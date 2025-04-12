"use client";

import OnboardingForm from "@/components/onboarding/Onboarding";
import { FullScreenLoader } from "@/components/ui/Loader";
import { useUser } from "@/hooks/useUser";
import { useUserStoreNonPersist } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Onboarding() {
  const { userObj, isLoggedIn, loading } = useUser();
  const { authLoading } = useUserStoreNonPersist();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) router.push("/");

      if (!userObj) router.push("/");
    }
  }, [userObj, isLoggedIn, authLoading]);

  if (authLoading) return <FullScreenLoader />;

  if (isLoggedIn)
    return (
      <div className="min-h-screen bg-gray-50">
        <OnboardingForm />
      </div>
    );
}
