"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AuthRedirectProps {
  redirectTo?: string;
  children: React.ReactNode;
}

export function AuthRedirect({ redirectTo = "/account", children }: AuthRedirectProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(redirectTo);
    }
  }, [isSignedIn, isLoaded, router, redirectTo]);

  // Don't render children if user is signed in
  if (isLoaded && isSignedIn) {
    return null;
  }

  return <>{children}</>;
}
