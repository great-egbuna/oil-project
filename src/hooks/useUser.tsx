"use client";

import { useUserStore } from "@/store/useUserStore";

export const useUser = () => {
  const { user, authenticatedUser, isLoggedIn } = useUserStore(
    (state) => state
  );

  return {
    authenticatedUser,
    user,
    isLoggedIn,
  };
};
