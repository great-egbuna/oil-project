"use client";

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

export const useUser = () => {
  const { user, authenticatedUser, isLoggedIn } = useUserStore(
    (state) => state
  );

  const [loading, setLoading] = useState(true);
  const [userObj, setUserObj] = useState<any>(null);

  useEffect(() => {
    if (!user || !authenticatedUser) {
      setLoading(false);
    }

    setUserObj({
      user,
      authenticatedUser,
    });
    setLoading(false);
  }, [user, authenticatedUser]);

  return {
    userObj,
    loading,
    isLoggedIn,
  };
};
