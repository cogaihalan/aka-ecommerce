"use client";

import { useState, useCallback } from "react";
import { Product, ProductVariant } from "@/lib/api/types";
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
  const [lastAddedItem, setLastAddedItem] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);

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
          setLastAddedItem({ product, quantity });
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

  const resetLastAdded = useCallback(() => {
    setLastAddedItem(null);
  }, []);

  return {
    addToCart: handleAddToCart,
    isAdding: isAdding || isLoading,
    error,
    lastAddedItem,
    resetLastAdded,
    clearError,
  };
}

/**
 * Hook for handling variant selection and add to cart
 */
export function useAddVariantToCart(options: UseAddToCartOptions = {}) {
  const { addToCart, isLoading, error, clearError } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const handleAddVariantToCart = useCallback(
    async (product: Product, variant: ProductVariant, quantity: number = 1) => {
      setIsAdding(true);
      clearError();

      try {
        const success = addToCart({ product, variant, quantity });

        if (success) {
          setSelectedVariant(variant);
          // Show toast notification by default unless explicitly disabled
          if (options.showToast !== false) {
            toast.success(
              `${quantity > 1 ? `${quantity}x ` : ""}${product.name} added to cart`,
              {
                description: variant ? `${variant.name} variant added to your cart` : "Item successfully added to your cart",
                duration: 3000,
              }
            );
          }
          options.onSuccess?.(product, quantity);
        } else {
          options.onError?.(error || "Failed to add variant to cart");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add variant to cart";
        options.onError?.(errorMessage);
      } finally {
        setIsAdding(false);
      }
    },
    [addToCart, clearError, error, options]
  );

  const resetSelection = useCallback(() => {
    setSelectedVariant(null);
  }, []);

  return {
    addVariantToCart: handleAddVariantToCart,
    isAdding: isAdding || isLoading,
    error,
    selectedVariant,
    resetSelection,
    clearError,
  };
}

/**
 * Hook for bulk add to cart operations
 */
export function useBulkAddToCart(options: UseAddToCartOptions = {}) {
  const { addToCart, isLoading, error, clearError } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addedItems, setAddedItems] = useState<
    Array<{
      product: Product;
      quantity: number;
    }>
  >([]);

  const handleBulkAddToCart = useCallback(
    async (
      items: Array<{
        product: Product;
        variant?: ProductVariant;
        quantity: number;
      }>
    ) => {
      setIsAdding(true);
      clearError();
      setAddedItems([]);

      const results: Array<{
        product: Product;
        quantity: number;
        success: boolean;
      }> = [];

      try {
        for (const item of items) {
          const success = addToCart(item);
          results.push({
            product: item.product,
            quantity: item.quantity,
            success,
          });

          if (success) {
            setAddedItems((prev) => [
              ...prev,
              { product: item.product, quantity: item.quantity },
            ]);
          }
        }

        const successCount = results.filter((r) => r.success).length;
        const totalCount = results.length;

        if (successCount === totalCount) {
          // Show toast notification for bulk add success
          if (options.showToast !== false) {
            toast.success(
              `${successCount} items added to cart`,
              {
                description: "All items successfully added to your cart",
                duration: 3000,
              }
            );
          }
          options.onSuccess?.(
            items[0]?.product,
            items.reduce((sum, item) => sum + item.quantity, 0)
          );
        } else {
          // Show toast notification for partial success
          if (options.showToast !== false) {
            toast.warning(
              `Added ${successCount} of ${totalCount} items to cart`,
              {
                description: "Some items could not be added",
                duration: 4000,
              }
            );
          }
          options.onError?.(
            `Added ${successCount} of ${totalCount} items to cart`
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add items to cart";
        options.onError?.(errorMessage);
      } finally {
        setIsAdding(false);
      }
    },
    [addToCart, clearError, options]
  );

  const resetAddedItems = useCallback(() => {
    setAddedItems([]);
  }, []);

  return {
    bulkAddToCart: handleBulkAddToCart,
    isAdding: isAdding || isLoading,
    error,
    addedItems,
    resetAddedItems,
    clearError,
  };
}
