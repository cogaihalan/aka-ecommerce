"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  X,
  LogOut,
  Settings,
  UserCircle,
  Package,
  Heart,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "./sign-out-button";
import { UserAvatarProfile } from "@/components/user-avatar-profile";

interface MiniAuthDropdownProps {
  className?: string;
}

export function MiniAuthDropdown({ className }: MiniAuthDropdownProps) {
  const { isDropdownOpen, closeDropdown } = useAuthStore();
  const { user, isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle visibility with smooth transitions
  useEffect(() => {
    if (isDropdownOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isDropdownOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen, closeDropdown]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDropdownOpen) {
        closeDropdown();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDropdownOpen, closeDropdown]);

  if (!isVisible) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute right-0 top-full w-80 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl z-50",
        "transform transition-all duration-300 ease-out",
        "animate-in slide-in-from-top-2 fade-in-0 zoom-in-95",
        isDropdownOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Account</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeDropdown}
            className="h-8 w-8 hover:bg-secondary transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isSignedIn ? (
        <div className="p-6 text-center">
          <UserCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="font-medium text-lg mb-2">Welcome!</h4>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to access your account and enjoy personalized shopping
          </p>
          <div className="space-y-2">
            <Button
              asChild
              className="w-full"
              size="lg"
              onClick={closeDropdown}
            >
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
              onClick={closeDropdown}
            >
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <UserAvatarProfile user={user} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user.fullName || "User"}
                </p>
                <p className="text-muted-foreground text-xs truncate">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-2">
            <div className="space-y-1">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start h-10 px-3"
                onClick={closeDropdown}
              >
                <Link href="/account" className="flex items-center gap-3">
                  <UserCircle className="w-4 h-4" />
                  <span>My Account</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full justify-start h-10 px-3"
                onClick={closeDropdown}
              >
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3"
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full justify-start h-10 px-3"
                onClick={closeDropdown}
              >
                <Link
                  href="/account/wishlist"
                  className="flex items-center gap-3"
                >
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full justify-start h-10 px-3"
                onClick={closeDropdown}
              >
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Addresses</span>
                </Link>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Settings & Sign Out */}
          <div className="p-2">
            <div className="space-y-1">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start h-10 px-3"
                onClick={closeDropdown}
              >
                <Link
                  href="/account/profile"
                  className="flex items-center gap-3"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </Button>

              {/* Admin Dashboard Link */}
              {user.publicMetadata?.role === "admin" && (
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start h-10 px-3"
                  onClick={closeDropdown}
                >
                  <Link href="/dashboard" className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
              )}

              <SignOutButton
                redirectUrl="/auth/sign-in"
                className="w-full justify-start h-10 text-sm px-3 text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-3"
                onClick={closeDropdown}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </SignOutButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
