"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useUser } from "@clerk/nextjs";
import { MiniAuthDropdown } from "./mini-auth-dropdown";
import { cn } from "@/lib/utils";

interface AuthIconProps {
  className?: string;
}

export function AuthIcon({ className }: AuthIconProps) {
  const { isDropdownOpen, toggleDropdown } = useAuthStore();
  const { isSignedIn } = useUser();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDropdown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative transition-all duration-200 hover:bg-muted/50 size-9",
          isDropdownOpen && "bg-muted/50",
          isDropdownOpen && "pointer-events-none",
          className
        )}
      >
        <User
          className={cn(
            "transition-all duration-200 size-5",
            (isHovered || isDropdownOpen) && "scale-110",
            isSignedIn && "text-primary"
          )}
        />
      </Button>

      {/* Mini Auth Dropdown */}
      <MiniAuthDropdown />
    </div>
  );
}
