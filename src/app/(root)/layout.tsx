"use client";

import { ReactElement } from "react";
import AuthProvider from "../providers/authProvider";

export default function RootLayout({ children }: { children: ReactElement }) {
  return (
    <div>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
