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
  Award,
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
        "absolute right-0 translate-x-[30%] md:translate-x-0 top-full w-64 md:w-80 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl z-50",
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
            <h3 className="font-semibold text-lg">Tài khoản</h3>
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
          <h4 className="font-medium text-lg mb-2">Xin chào!</h4>
          <p className="text-muted-foreground text-sm mb-6">
            Đăng nhập để truy cập tài khoản và trải nghiệm mua sắm cá nhân hóa
          </p>
          <div className="space-y-2">
            <Button
              asChild
              className="w-full"
              size="lg"
              onClick={closeDropdown}
            >
              <Link href="/auth/sign-in">Đăng nhập</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
              onClick={closeDropdown}
            >
              <Link href="/auth/sign-up">Tạo tài khoản</Link>
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
                  {user.fullName || "Người dùng"}
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
                  <span>Tài khoản của tôi</span>
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
                  <span>Đơn hàng của tôi</span>
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
                  <span>Yêu thích</span>
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
                  <span>Địa chỉ</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full justify-start h-10 px-3"
                onClick={closeDropdown}
              >
                <Link
                  href="/account/submissions"
                  className="flex items-center gap-3"
                >
                  <Award className="w-4 h-4" />
                  <span>Bài dự thi</span>
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
                  <span>Cài đặt</span>
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
                    <span>Bảng điều khiển</span>
                  </Link>
                </Button>
              )}

              <SignOutButton
                redirectUrl="/auth/sign-in"
                className="w-full justify-start h-10 text-sm px-3 text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-3"
                onClick={closeDropdown}
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </SignOutButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
