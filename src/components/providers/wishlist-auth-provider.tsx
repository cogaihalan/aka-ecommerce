"use client";

import { useWishlistAuth } from "@/hooks/use-wishlist-auth";
import { ReactNode } from "react";

interface WishlistAuthProviderProps {
  children: ReactNode;
}

/**
 * Provider component that syncs authentication status between Clerk and wishlist store
 * This ensures the wishlist functionality respects the user's authentication state
 */
export function WishlistAuthProvider({ children }: WishlistAuthProviderProps) {
  // This hook will automatically sync auth state with the wishlist store
  useWishlistAuth();

  return <>{children}</>;
}
