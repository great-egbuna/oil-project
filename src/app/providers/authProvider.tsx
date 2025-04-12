"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore, useUserStoreNonPersist } from "@/store/useUserStore";
import { auth } from "@/service/firebase";
import { authService } from "@/service/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setIsLoggedIn, setAuthenticatedUser } = useUserStore(
    (state) => state
  );
  const { setAuthLoading } = useUserStoreNonPersist();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({ uid: user.uid, email: user.email });
        const authenticatedUser = await authService.getUser(
          user?.uid as string
        );

        if (authenticatedUser) setAuthenticatedUser(authenticatedUser as any);

        setIsLoggedIn(true);

        setAuthLoading(false);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setAuthLoading(false);
      }
    });
    return unsubscribe;
  }, [setUser]);

  return children;
}
