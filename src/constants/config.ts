export const APP_NAME = "Next.js Application";
export const APP_DESCRIPTION =
  "A modern Next.js application with TypeScript and Tailwind CSS";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
  },
  USER: {
    PROFILE: "/api/user/profile",
    SETTINGS: "/api/user/settings",
  },
} as const;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const;
