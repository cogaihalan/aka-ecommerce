"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Product } from "@/types/product";

// Wishlist item interface
export interface WishlistItem {
  id: string;
  productId: number;
  product: Product;
  addedAt: string;
  userId?: string; // For future user-specific wishlists
}

// Wishlist store interface
export interface WishlistStore {
  // State
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  currentUserId: string | null;
  isAuthenticated: boolean;

  // Actions
  addItem: (product: Product, userId?: string) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  getItemCount: () => number;
  getTotalValue: () => number;

  // User management
  setCurrentUser: (userId: string | null) => void;
  setAuthenticationStatus: (isAuthenticated: boolean) => void;
  clearUserWishlist: (userId: string) => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Persistence
  loadWishlist: () => void;
  saveWishlist: () => void;
}

// Wishlist store implementation
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isLoading: false,
      error: null,
      lastUpdated: Date.now(),
      currentUserId: null,
      isAuthenticated: false,

      // Add item to wishlist
      addItem: (product: Product, userId?: string) => {
        set({ isLoading: true, error: null });

        try {
          const state = get();

          // Check if user is authenticated
          if (!state.isAuthenticated) {
            set({
              error: "Vui lòng đăng nhập để thêm vào danh sách yêu thích",
              isLoading: false,
            });
            return;
          }

          // Check if item already exists
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );

          if (existingItem) {
            set({
              error: "Sản phẩm đã có trong danh sách yêu thích",
              isLoading: false,
            });
            return;
          }

          // Create new wishlist item
          const currentUserId = get().currentUserId;
          const newItem: WishlistItem = {
            id: uuidv4(),
            productId: product.id,
            product,
            addedAt: new Date().toISOString(),
            userId: userId || currentUserId || undefined,
          };

          set({
            items: [...state.items, newItem],
            lastUpdated: Date.now(),
            isLoading: false,
          });

          // Show success toast
          toast.success("Đã thêm vào danh sách yêu thích", {
            description: `${product.name} đã được thêm vào danh sách yêu thích`,
            duration: 3000,
          });
        } catch (error) {
          set({
            error:
            error instanceof Error
              ? error.message
              : "Thêm sản phẩm vào danh sách yêu thích thất bại",
            isLoading: false,
          });
        }
      },

      // Remove item from wishlist
      removeItem: (productId: number) => {
        set({ isLoading: true, error: null });

        try {
          const state = get();

          // Check if user is authenticated
          if (!state.isAuthenticated) {
            set({
              error: "Vui lòng đăng nhập để quản lý danh sách yêu thích",
              isLoading: false,
            });
            return;
          }

          // Find the product to get its name for the toast
          const itemToRemove = state.items.find(
            (item) => item.productId === productId
          );

          const updatedItems = state.items.filter(
            (item) => item.productId !== productId
          );

          set({
            items: updatedItems,
            lastUpdated: Date.now(),
            isLoading: false,
          });

          // Show success toast
          if (itemToRemove) {
            toast.success("Đã xóa khỏi danh sách yêu thích", {
              description: `${itemToRemove.product.name} đã được xóa khỏi danh sách yêu thích`,
              duration: 3000,
            });
          }
        } catch (error) {
          set({
            error:
            error instanceof Error
              ? error.message
              : "Xóa sản phẩm khỏi danh sách yêu thích thất bại",
            isLoading: false,
          });
        }
      },

      // Clear entire wishlist
      clearWishlist: () => {
        const state = get();

        // Check if user is authenticated
        if (!state.isAuthenticated) {
          set({
            error: "Vui lòng đăng nhập để quản lý danh sách yêu thích",
            isLoading: false,
          });
          return;
        }

        set({
          items: [],
          lastUpdated: Date.now(),
          isLoading: false,
          error: null,
        });
      },

      // Check if item is in wishlist
      isInWishlist: (productId: number) => {
        const state = get();

        // Return false if user is not authenticated
        if (!state.isAuthenticated) {
          return false;
        }

        const currentUserId = state.currentUserId;
        return state.items.some(
          (item) =>
            item.productId === productId &&
            (!currentUserId || item.userId === currentUserId)
        );
      },

      // Get total item count
      getItemCount: () => {
        const state = get();

        // Return 0 if user is not authenticated
        if (!state.isAuthenticated) {
          return 0;
        }

        const currentUserId = state.currentUserId;
        return state.items.filter(
          (item) => !currentUserId || item.userId === currentUserId
        ).length;
      },

      // Get total value of wishlist
      getTotalValue: () => {
        const state = get();

        // Return 0 if user is not authenticated
        if (!state.isAuthenticated) {
          return 0;
        }

        const currentUserId = state.currentUserId;
        return state.items
          .filter((item) => !currentUserId || item.userId === currentUserId)
          .reduce((total, item) => total + (item.product.discountPrice || item.product.price), 0);
      },

      // User management
      setCurrentUser: (userId: string | null) => {
        set({ currentUserId: userId });
      },

      setAuthenticationStatus: (isAuthenticated: boolean) => {
        set({ isAuthenticated });
      },

      clearUserWishlist: (userId: string) => {
        const state = get();
        const updatedItems = state.items.filter(
          (item) => item.userId !== userId
        );
        set({
          items: updatedItems,
          lastUpdated: Date.now(),
        });
      },

      // State management
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Persistence methods
      loadWishlist: () => {
        // This is handled by Zustand persist middleware
        set({ isLoading: false });
      },

      saveWishlist: () => {
        // This is handled by Zustand persist middleware
        set({ lastUpdated: Date.now() });
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        lastUpdated: state.lastUpdated,
        currentUserId: state.currentUserId,
        isAuthenticated: state.isAuthenticated,
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
export const useWishlistItems = () => useWishlistStore((state) => state.items);
export const useWishlistItemCount = () =>
  useWishlistStore((state) => state.getItemCount());
export const useWishlistTotalValue = () =>
  useWishlistStore((state) => state.getTotalValue());
export const useWishlistLoading = () =>
  useWishlistStore((state) => state.isLoading);
export const useWishlistError = () => useWishlistStore((state) => state.error);
export const useWishlistAuthStatus = () =>
  useWishlistStore((state) => state.isAuthenticated);
export const useIsInWishlist = (productId: number) =>
  useWishlistStore((state) => state.isInWishlist(productId));

// Custom hook for wishlist actions
export const useWishlistActions = () => {
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  return {
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
  };
};
