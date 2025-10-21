"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

/**
 * Custom hook to get the authentication token for API calls
 * This hook can be used in React components to get the current user's token
 */
export function useAuthToken() {
  const { getToken } = useAuth();

  const getAuthToken = useCallback(async () => {
    try {
      const token = await getToken({
        template: process.env.NEXT_PUBLIC_CLERK_TEMPLATE || "aka",
      });
      return token;
    } catch (error) {
      console.warn("Failed to get auth token:", error);
      return null;
    }
  }, [getToken]);

  return { getAuthToken };
}
