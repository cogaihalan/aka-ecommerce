"use client";

import { useState, useCallback } from "react";
import { Product, ProductVariant } from "@/types/product";
import { useCart } from "./use-cart";
import { toast } from "sonner";

interface UseAddToCartOptions {
  onSuccess?: (product: Product, quantity: number) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

/**
 * Hook for handling add to cart operations with loading states and callbacks
 */
export function useAddToCart(options: UseAddToCartOptions = {}) {
  const { addToCart, isLoading, error, clearError } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = useCallback(
    async (
      product: Product,
      variant?: ProductVariant,
      quantity: number = 1
    ) => {
      setIsAdding(true);
      clearError();

      try {
        const success = addToCart({ product, variant, quantity });

        if (success) {
          // Show toast notification by default unless explicitly disabled
          if (options.showToast !== false) {
            toast.success(
              `${quantity > 1 ? `${quantity}x ` : ""}${product.name} added to cart`,
              {
                description: "Item successfully added to your cart",
                duration: 3000,
              }
            );
          }
          options.onSuccess?.(product, quantity);
        } else {
          options.onError?.(error || "Failed to add item to cart");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add item to cart";
        options.onError?.(errorMessage);
      } finally {
        setIsAdding(false);
      }
    },
    [addToCart, clearError, error, options]
  );

  return {
    addToCart: handleAddToCart,
    isAdding: isAdding || isLoading,
    error,
    clearError,
  };
}