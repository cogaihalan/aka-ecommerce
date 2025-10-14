"use client";

import {
  useWishlistActions,
  useWishlistItemCount,
  useWishlistItems,
  useWishlistTotalValue,
} from "@/stores/wishlist-store";
import { Product } from "@/lib/api/types";

export function useWishlist() {
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    clearWishlist,
    isInWishlist,
  } = useWishlistActions();

  const items = useWishlistItems();
  const itemCount = useWishlistItemCount();
  const totalValue = useWishlistTotalValue();

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return {
    // State
    items,
    itemCount,
    totalValue,

    // Actions
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlist,
    isInWishlist,
  };
}
