"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useWishlistStore } from "@/stores/wishlist-store";

/**
 * Hook to sync authentication status between Clerk and wishlist store
 * This should be used in a provider component to keep auth state in sync
 */
export function useWishlistAuth() {
  const { isSignedIn, user } = useUser();
  const setCurrentUser = useWishlistStore((state) => state.setCurrentUser);
  const setAuthenticationStatus = useWishlistStore(
    (state) => state.setAuthenticationStatus
  );

  useEffect(() => {
    // Update authentication status
    setAuthenticationStatus(isSignedIn || false);

    // Update current user ID
    if (isSignedIn && user) {
      setCurrentUser(user.id);
    } else {
      setCurrentUser(null);
    }
  }, [isSignedIn, user, setCurrentUser, setAuthenticationStatus]);

  return {
    isSignedIn: isSignedIn || false,
    user,
  };
}
