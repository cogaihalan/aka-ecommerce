"use client";

import { ReactNode } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface SignOutButtonProps {
  children: ReactNode;
  redirectUrl?: string;
  className?: string;
  onClick?: () => void;
}

export function SignOutButton({
  children,
  redirectUrl = "/auth/sign-in",
  className,
  onClick,
}: SignOutButtonProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const { isSigningOut, setSigningOut, closeDropdown } = useAuthStore();

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      closeDropdown(); // Close any open dropdowns

      await signOut();

      // Redirect to the specified URL
      router.push(redirectUrl);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={className}
    >
      {isSigningOut ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Signing out...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
