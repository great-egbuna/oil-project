// components/ToastProvider.tsx
"use client";

import { useToast } from "@/components/ui/Toast";

export const ToastProvider = () => {
  const { ToastContainer } = useToast();
  return <ToastContainer />;
};
