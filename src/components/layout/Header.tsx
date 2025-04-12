"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SignUpOptions from "../ui/SignUpOptions";
import Overlay from "../ui/Overlay";
import { Login } from "../auth/Login";
import { SignUp } from "../auth/SignUp";
import { useUserStore } from "@/store/useUserStore";

const Header = () => {
  const setRole = useUserStore((state) => state.setRole);

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
    setIsSignInOpen(false);
    setShowAuthOverlay(true);
    setIsLoginForm(true);
    setRole(value);
  };

  return (
    <header className="hidden md:block bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/images/logo.jpg"
                alt="CL Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 mx-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-blue px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative hidden md:flex">
            <button
              onClick={() => setIsSignInOpen(!isSignInOpen)}
              className="bg-primary-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-blue transition cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

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
      />

      <AnimatePresence>
        {showAuthOverlay && (
          <Overlay onClose={() => setShowAuthOverlay(false)}>
            {isLoginForm ? (
              <Login onSwitchForm={() => setIsLoginForm(false)} />
            ) : (
              <SignUp onSwitchForm={() => setIsLoginForm(true)} />
            )}
          </Overlay>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
