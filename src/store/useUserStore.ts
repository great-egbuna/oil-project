// store/useUserStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  uid: string;
  email: string | null;
} | null;

type State = {
  user: any;
  isLoggedIn: boolean;
  role: string | null;
  setUser: (user: any) => void;
  setIsLoggedIn: (status: boolean) => void;
  setRole: (role: string) => void;
};

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      role: null,
      setUser: (user) => set({ user }),
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      setRole: (role) => set({ role }),
    }),
    {
      name: "user-store",
    }
  )
);
