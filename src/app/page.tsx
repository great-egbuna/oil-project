"use client";

import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import BusinessAreas from "@/components/home/BusinessAreas";
import AboutSection from "@/components/home/AboutSection";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/layout/MobileHeader";
import Specifications from "@/components/home/Specifications";
import ApprovedBodies from "@/components/home/ApprovedBody";
import { useCart } from "@/context/appContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { cartItems  } = useCart();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MobileHeader />
      <main>
        <Hero />
        <AboutSection />
        <BusinessAreas />

        <Specifications />
        <ApprovedBodies />

        {cartItems.length > 0 && (
          <div className="fixed top-[70%] right-4 bg-white p-4 rounded-lg shadow-xl border z-50">
            <div className="flex items-center gap-6">
              <div>
                <h3 className="font-semibold">
                  Total: ₦{totalAmount.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">
                  {cartItems.length} items (
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  units)
                </p>
              </div>
              <button
                onClick={() => router.push(`/products/${cartItems[0]?.id}`)}
                className="px-6 py-2 bg-primary-red text-white rounded hover:bg-red-600 min-w-[150px]"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
