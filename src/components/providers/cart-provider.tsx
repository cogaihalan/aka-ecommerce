"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { loadCart } = useCartStore();

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return <>{children}</>;
}
