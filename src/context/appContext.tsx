"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  cartItems: any[];
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>;
  showOrderModal: boolean;
  setShowOrderModal: (Prev: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        showOrderModal,
        setShowOrderModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
