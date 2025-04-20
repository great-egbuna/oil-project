// store/useUserStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  uid: string;
  userId: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  callNumber?: string;
  whatsappNumber?: string;
  profileImage?: string;
  onboardingComplete?: boolean;
  role?: string;
  status?: string;
} | null;

type State = {
  user: User;
  authenticatedUser: User;
  isLoggedIn: boolean;
  role: string | null;
  setUser: (user: User) => void;
  setAuthenticatedUser: (user: User) => void;
  setIsLoggedIn: (status: boolean) => void;
  setRole: (role: string) => void;
};

type StateNonpersist = {
  authLoading: boolean;
  setAuthLoading: (value: boolean) => void;
  createStaff: boolean;
  setCreateStaff: (createStaff: boolean) => void;
};

export const useUserStoreNonPersist = create<StateNonpersist>((set) => ({
  authLoading: true,
  createStaff: false,
  setCreateStaff: (value) => set({ createStaff: value }),
  setAuthLoading: (value) => set({ authLoading: value }),
}));

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      role: null,
      authenticatedUser: null,
      setUser: (user) => set({ user }),
      setAuthenticatedUser: (user) => set({ authenticatedUser: user }),
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      setRole: (role) => set({ role }),
    }),
    {
      name: "user-store",
    }
  )
);
