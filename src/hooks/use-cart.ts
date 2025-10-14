"use client";

import { useCallback } from "react";
import { useCartStore } from "@/stores/cart-store";
import { Product, ProductVariant } from "@/lib/api/types";
import { AddToCartParams } from "@/types/cart";

/**
 * Custom hook for cart operations with enhanced functionality
 */
export function useCart() {
  const store = useCartStore();

  // Enhanced add to cart with validation
  const addToCart = useCallback(
    (params: AddToCartParams) => {
      const { product, variant, quantity = 1 } = params;

      // Validate product
      if (!product) {
        store.setError("Product not found");
        return false;
      }

      // Check if product is available
      if (product.status !== "active") {
        store.setError("Product is not available");
        return false;
      }

      // Check inventory
      const selectedVariant = variant || product.variants?.[0];
      const availableQuantity =
        selectedVariant?.inventory?.quantity ||
        product.inventory?.quantity ||
        0;

      if (availableQuantity < quantity) {
        store.setError(`Only ${availableQuantity} items available in stock`);
        return false;
      }

      // Add to cart
      store.addItem(product, selectedVariant, quantity);
      return true;
    },
    [store]
  );

  // Quick add to cart (single item)
  const quickAddToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      return addToCart({ product, quantity });
    },
    [addToCart]
  );

  // Add variant to cart
  const addVariantToCart = useCallback(
    (product: Product, variant: ProductVariant, quantity: number = 1) => {
      return addToCart({ product, variant, quantity });
    },
    [addToCart]
  );

  // Update item quantity with validation
  const updateItemQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity < 0) {
        store.setError("Quantity cannot be negative");
        return false;
      }

      if (quantity === 0) {
        store.removeItem(itemId);
        return true;
      }

      store.updateQuantity(itemId, quantity);
      return true;
    },
    [store]
  );

  // Check if product is in cart
  const isInCart = useCallback(
    (productId: number, variantId?: number) => {
      return store.isItemInCart(productId, variantId);
    },
    [store]
  );

  // Get item quantity in cart
  const getItemQuantity = useCallback(
    (productId: number, variantId?: number) => {
      return store.getItemQuantity(productId, variantId);
    },
    [store]
  );

  // Clear error
  const clearError = useCallback(() => {
    store.setError(null);
  }, [store]);

  // Get cart statistics
  const getCartStats = useCallback(() => {
    return {
      totalItems: store.getTotalItems(),
      totalPrice: store.getTotalPrice(),
      subtotal: store.getSubtotal(),
      shipping: store.getShipping(),
      tax: store.getTax(),
      total: store.getTotal(),
      itemCount: store.items.length,
    };
  }, [store]);

  // Validate cart
  const validateCart = useCallback(() => {
    const { items } = store;
    const errors: string[] = [];
    const warnings: string[] = [];

    items.forEach((item) => {
      if (item.quantity <= 0) {
        errors.push(`${item.name}: Quantity must be greater than 0`);
      }

      if (item.maxQuantity && item.quantity > item.maxQuantity) {
        errors.push(`${item.name}: Only ${item.maxQuantity} items available`);
      }

      if (item.maxQuantity && item.quantity > item.maxQuantity * 0.8) {
        warnings.push(`${item.name}: Low stock warning`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [store]);

  return {
    // State
    items: store.items,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    error: store.error,
    lastUpdated: store.lastUpdated,

    // Actions
    addToCart,
    quickAddToCart,
    addVariantToCart,
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
    getCartStats,
    validateCart,

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
