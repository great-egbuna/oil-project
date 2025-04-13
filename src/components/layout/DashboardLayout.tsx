"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiSettings,
  FiUserPlus,
  FiUsers,
  FiTruck,
  FiMessageCircle,
  FiChevronDown,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { useUser } from "@/hooks/useUser";
import { useUserStore, useUserStoreNonPersist } from "@/store/useUserStore";
import { FullScreenLoader } from "../ui/Loader";
import { useRouter } from "next/navigation";
import Overlay from "../ui/Overlay";
import ContactAdminCard from "../ui/ContactAdmin";
import { authService } from "@/service/auth";

const DashboardLayoutComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authenticatedUser, isLoggedIn } = useUser();

  const { setRole, setAuthenticatedUser, setIsLoggedIn, setUser } =
    useUserStore((state) => state);
  const authLoading = useUserStoreNonPersist((state) => state.authLoading);
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const adminNav = [
    { label: "Staff", icon: <FiUserPlus /> },
    { label: "Dealers", icon: <FiUsers /> },
    { label: "Distributors", icon: <FiTruck /> },
    { label: "Others", icon: <FiUsers /> },
    { label: "Settings", icon: <FiSettings /> },
  ];

  const userNav = [
    { label: "Settings", icon: <FiSettings />, path: "/dashboard/settings" },
    {
      label: "Contact Admin",
      icon: <FiMessageCircle />,
    },
    { label: "Logout", icon: <FiLogOut /> },
  ];

  const navItems = authenticatedUser?.role === "admin" ? adminNav : userNav;

  const handleNavClick = async (item) => {
    if (item.path) {
      router.push(item.path);
    }
    if (item.label === "Contact Admin") {
      setOpenOverlay(true);
    }
    if (item.label === "Logout") {
      await authService.signOut();
      setUser(null);
      setAuthenticatedUser(null);
      setIsLoggedIn(false);
      setRole("");
      router.push("/");
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        router.push("/");
      }
      if (authenticatedUser && authenticatedUser?.onboardingComplete === false)
        router.push("/onboarding");
    }
  }, [authLoading]);

  if (authLoading) return <FullScreenLoader />;

  if (!isLoggedIn) return null;

  if (authenticatedUser && authenticatedUser?.onboardingComplete === false)
    return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <nav
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 p-4 lg:pt-24 z-[60] lg:z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <Image
            src="/images/logo.jpg"
            alt="CL Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX className="text-xl text-gray-600" />
          </button>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-primary-red"
              onClick={() => handleNavClick(item)}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-50">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2"
          >
            <FiMenu className="text-xl text-gray-600" />
          </button>

          {/* Logo */}
          <div className="flex items-center invisible lg:visible">
            <Image
              src="/images/logo.jpg"
              alt="CL Logo"
              width={120}
              height={40}
              className="h-6 w-auto"
            />
          </div>

          {/* Desktop Avatar */}
          <div className="hidden lg:flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              {authenticatedUser?.profileImage ? (
                <Image
                  src={authenticatedUser.profileImage}
                  alt="avatar image"
                  width={50}
                  height={50}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <p className="capitalize">
                  {authenticatedUser?.firstName?.charAt(0)}
                </p>
              )}
            </div>
            <FiChevronDown className="text-gray-600" />
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-6 bg-gray-50 min-h-screen pt-20 lg:ml-64 lg:pt-24">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {openOverlay && (
        <Overlay onClose={() => setOpenOverlay(false)}>
          <ContactAdminCard />
        </Overlay>
      )}
    </div>
  );
};

export default DashboardLayoutComponent;
