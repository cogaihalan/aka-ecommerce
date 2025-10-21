"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiClient } from "@/lib/api/client";

interface ApiAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider that syncs the authentication token with the API client
 * This ensures that all API calls include the proper Authorization header
 */
export function ApiAuthProvider({ children }: ApiAuthProviderProps) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const updateApiClientAuth = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken({
            template: process.env.NEXT_PUBLIC_CLERK_TEMPLATE || "aka",
          });
          apiClient.setAuthToken(token);
        } catch (error) {
          console.warn("Failed to get auth token for API client:", error);
          apiClient.setAuthToken(null);
        }
      } else {
        apiClient.setAuthToken(null);
      }
    };

    updateApiClientAuth();
  }, [getToken, isSignedIn]);

  return <>{children}</>;
}
