"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/stores/auth-store";
import { clerkUserResourceToAppUser } from "@/lib/auth/utils";

interface AuthSyncProviderProps {
  children: React.ReactNode;
}

export function AuthSyncProvider({ children }: AuthSyncProviderProps) {
  const { user: clerkUser, isLoaded } = useUser();
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (clerkUser) {
      const appUser = clerkUserResourceToAppUser(clerkUser);
      setUser(appUser);
    } else {
      clearUser();
    }
  }, [clerkUser, isLoaded, setUser, clearUser]);

  return <>{children}</>;
}
