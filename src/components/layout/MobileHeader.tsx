"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import OverlayModal from "../ui/Overlay";
import SignUpOptions from "../ui/SignUpOptions";
import { Login } from "../auth/Login";
import { SignUp } from "../auth/SignUp";
import { useUserStore } from "@/store/useUserStore";

const MobileHeader = () => {
  const setRole = useUserStore((state) => state.setRole);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/contact", label: "Contact Us" },
    { href: "/products", label: "Products" },
    { href: "/distributors", label: "Distributors" },
  ];

  const handleSelect = (value: string) => {
    setShowAuthOverlay(true);
    setIsSignInOpen(false);
    setRole(value);
  };
  return (
    <div className="bg-white shadow-md relative z-50 md:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img
                src="/images/logo.jpg"
                alt="CL Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-2 rounded-md"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-40 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {menuItems.map((item) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className="text-2xl font-medium text-gray-700 hover:text-blue-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSignInOpen(true);
                  }}
                  className="bg-primary-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-blue transition cursor-pointer"
                >
                  Sign In
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSignInOpen && (
          <OverlayModal onClose={() => setIsSignInOpen(false)}>
            <SignUpOptions
              isOpen={isSignInOpen}
              onSelect={handleSelect}
              mainItems={[
                { label: "Dealer", value: "Dealer" },
                { label: "Distributor", value: "Distributor" },
              ]}
              subItems={[
                { label: "Mechanic", value: "Mechanic" },
                { label: "Keke Driver", value: "Keke Driver" },
                { label: "Car Driver", value: "Car Driver" },
              ]}
              className="relative"
            />
          </OverlayModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthOverlay && (
          <OverlayModal onClose={() => setShowAuthOverlay(false)}>
            {isLoginForm ? (
              <Login onSwitchForm={() => setIsLoginForm(false)} />
            ) : (
              <SignUp onSwitchForm={() => setIsLoginForm(true)} />
            )}
          </OverlayModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHeader;
