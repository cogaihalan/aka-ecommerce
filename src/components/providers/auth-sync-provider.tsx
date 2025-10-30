"use client";

import { ReactNode } from "react";
import { useAuthSync } from "@/hooks/use-auth-sync";

interface AuthSyncProviderProps {
  children: ReactNode;
}

export function AuthSyncProvider({ children }: AuthSyncProviderProps) {
  useAuthSync();
  return <>{children}</>;
}


