"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { CartStore, CartItem, CartValidationResult } from "@/types/cart";
import { Product, ProductVariant } from "@/types";

// Default cart calculation options for Vietnamese market
const DEFAULT_CALCULATION_OPTIONS = {
  shippingThreshold: 1000000, // 1 million VND
  shippingCost: 30000, // 30k VND for Hanoi
  taxRate: 0.1, // 10% tax rate
  freeShippingThreshold: 1000000, // 1 million VND
};

// Cart store implementation
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      isLoading: false,
      error: null,
      lastUpdated: Date.now(),

      // Item management actions
      addItem: (
        product: Product,
        variant?: ProductVariant,
        quantity: number = 1,
        attributes: Record<string, string> = {}
      ) => {
        set({ isLoading: true, error: null });

        try {
          const state = get();
          const variantToUse = variant || product.variants?.[0];
          const itemId = `${product.id}-${variantToUse?.id || "default"}`;

          // Check if item already exists
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              item.variantId === variantToUse?.id
          );

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];
            const newQuantity = existingItem.quantity + quantity;

            // Check stock limits
            const maxQuantity =
              variantToUse?.stock ||
              product.stock ||
              999;
            if (newQuantity > maxQuantity) {
              set({
                error: `Only ${maxQuantity} items available in stock`,
                isLoading: false,
              });
              return;
            }

            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };

            set({
              items: updatedItems,
              lastUpdated: Date.now(),
              isLoading: false,
            });
          } else {
            // Add new item
            const newItem: CartItem = {
              id: uuidv4(),
              productId: product.id,
              variantId: variantToUse?.id,
              name: product.name,
              price: variantToUse?.price || product.price,
              compareAtPrice:
                variantToUse?.discountPrice || product.discountPrice,
              quantity,
              image: product.images?.[0]?.url,
              attributes: {
                ...attributes,
              },
              sku: variantToUse?.name || product.name,
              weight: 0, // Default weight
              maxQuantity:
                variantToUse?.stock ||
                product.stock,
            };

            set({
              items: [...state.items, newItem],
              lastUpdated: Date.now(),
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to add item to cart",
            isLoading: false,
          });
        }
      },

      removeItem: (itemId: string) => {
        set({ isLoading: true, error: null });

        try {
          const state = get();
          const updatedItems = state.items.filter((item) => item.id !== itemId);

          set({
            items: updatedItems,
            lastUpdated: Date.now(),
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to remove item from cart",
            isLoading: false,
          });
        }
      },

      updateQuantity: (itemId: string, quantity: number) => {
        set({ isLoading: true, error: null });

        try {
          if (quantity <= 0) {
            get().removeItem(itemId);
            return;
          }

          const state = get();
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              // Check stock limits
              if (item.maxQuantity && quantity > item.maxQuantity) {
                set({
                  error: `Only ${item.maxQuantity} items available in stock`,
                  isLoading: false,
                });
                return item;
              }

              return { ...item, quantity };
            }
            return item;
          });

          set({
            items: updatedItems,
            lastUpdated: Date.now(),
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update quantity",
            isLoading: false,
          });
        }
      },

      clearCart: () => {
        set({
          items: [],
          lastUpdated: Date.now(),
          isLoading: false,
          error: null,
        });
      },

      // Cart state management
      toggleCart: () => {
        set((state: any) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Utility functions
      getItemQuantity: (productId: number, variantId?: number) => {
        const state = get();
        const item = state.items.find(
          (item) => item.productId === productId && item.variantId === variantId
        );
        return item?.quantity || 0;
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getSubtotal: () => {
        return get().getTotalPrice();
      },

      getShipping: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        return subtotal >= DEFAULT_CALCULATION_OPTIONS.freeShippingThreshold
          ? 0
          : DEFAULT_CALCULATION_OPTIONS.shippingCost;
      },

      getTax: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        return subtotal * DEFAULT_CALCULATION_OPTIONS.taxRate;
      },

      getTotal: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        const shipping = state.getShipping();
        const tax = state.getTax();
        return subtotal + shipping + tax;
      },

      isItemInCart: (productId: number, variantId?: number) => {
        const state = get();
        return state.items.some(
          (item) => item.productId === productId && item.variantId === variantId
        );
      },

      // Persistence methods
      loadCart: () => {
        // This is handled by Zustand persist middleware
        set({ isLoading: false });
      },

      saveCart: () => {
        // This is handled by Zustand persist middleware
        set({ lastUpdated: Date.now() });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        lastUpdated: state.lastUpdated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () => useCartStore((state) => state.getTotal());
export const useCartItemCount = () =>
  useCartStore((state) => state.getTotalItems());
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);
export const useCartLoading = () => useCartStore((state) => state.isLoading);
export const useCartError = () => useCartStore((state) => state.error);

// Cart validation utility
export const validateCart = (items: CartItem[]): CartValidationResult => {
  const errors: { itemId: string; message: string }[] = [];
  const warnings: { itemId: string; message: string }[] = [];

  items.forEach((item) => {
    // Check if item has valid quantity
    if (item.quantity <= 0) {
      errors.push({
        itemId: item.id,
        message: "Item quantity must be greater than 0",
      });
    }

    // Check stock availability
    if (item.maxQuantity && item.quantity > item.maxQuantity) {
      errors.push({
        itemId: item.id,
        message: `Only ${item.maxQuantity} items available in stock`,
      });
    }

    // Check if item is low in stock
    if (item.maxQuantity && item.quantity > item.maxQuantity * 0.8) {
      warnings.push({
        itemId: item.id,
        message: "Item is low in stock",
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
