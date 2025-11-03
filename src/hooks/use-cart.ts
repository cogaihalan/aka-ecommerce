"use client";

import { useCallback } from "react";
import { useCartStore } from "@/stores/cart-store";
import { Product } from "@/types";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * Custom hook for cart operations with enhanced functionality
 */
export function useCart() {
  const store = useCartStore();
  const { user } = useUser();
  const router = useRouter();

  // Update item quantity with validation
  const updateItemQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (quantity < 0) {
        store.setError("Quantity cannot be negative");
        return false;
      }

      try {
        if (quantity === 0) {
          await store.removeItem(productId);
          return true;
        }

        await store.updateQuantity(productId, quantity);
        return true;
      } catch (error) {
        console.error("Failed to update quantity:", error);
        return false;
      }
    },
    [store]
  );

  // Check if product is in cart
  const isInCart = useCallback(
    (productId: number) => {
      return store.isItemInCart(productId);
    },
    [store]
  );

  // Get item quantity in cart
  const getItemQuantity = useCallback(
    (productId: number) => {
      return store.getItemQuantity(productId);
    },
    [store]
  );

  // Clear error
  const clearError = useCallback(() => {
    store.setError(null);
  }, [store]);

  // Validate cart
  const validateCart = useCallback(() => {
    const { items } = store;
    const errors: string[] = [];
    const warnings: string[] = [];

    items.forEach((item) => {
      if (item.quantity <= 0) {
        errors.push(`${item.product.name}: Quantity must be greater than 0`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [store]);

  const handleAddToCart = useCallback(
    async (product: Product, quantity: number = 1) => {
      if (!user) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", {
          action: {
            label: "Đăng nhập",
            onClick: () => {
              router.push("/auth/sign-in");
            },
          }
        });
        return;
      }
      try {
        await store.addItem(product, quantity);
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    },
    [store, user, router]
  );

  return {
    // State
    items: store.items,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    error: store.error,
    lastUpdated: store.lastUpdated,

    // Actions
    addToCart: handleAddToCart,
    removeItem: store.removeItem,
    updateItemQuantity,
    clearCart: store.clearCart,
    toggleCart: store.toggleCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    clearError,

    // Utilities
    isInCart,
    getItemQuantity,
    validateCart,
    isProductLoading: store.isItemLoading,

    // Direct store access for advanced usage
    store,
  };
}

/**
 * Hook for cart item count with automatic updates
 */
export function useCartItemCount() {
  return useCartStore((state) => state.getTotalItems());
}

/**
 * Hook for cart total with automatic updates
 */
export function useCartTotal() {
  return useCartStore((state) => state.getTotal());
}

/**
 * Hook for cart items with automatic updates
 */
export function useCartItems() {
  return useCartStore((state) => state.items);
}

/**
 * Hook for cart loading state
 */
export function useCartLoading() {
  return useCartStore((state) => state.isLoading);
}

/**
 * Hook for cart error state
 */
export function useCartError() {
  return useCartStore((state) => state.error);
}

/**
 * Hook for cart open state
 */
export function useCartOpen() {
  return useCartStore((state) => state.isOpen);
}
