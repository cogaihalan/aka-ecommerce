"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Menu, X } from "lucide-react";
import Logo from "@/components/logo";
import Link from "next/link";
import { CartIcon } from "@/components/cart";
import { AuthIcon } from "@/components/auth";
import {
  useWishlistItemCount,
  useWishlistAuthStatus,
} from "@/stores/wishlist-store";

export default function StorefrontHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const wishlistCount = useWishlistItemCount();
  const isAuthenticated = useWishlistAuthStatus();

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="lg" href="/" />
          <div className="flex flex-row-reverse items-center gap-2 md:flex-row md:gap-3">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 mx-4">
              <div className="relative w-70 transition-all duration-300 ease-in-out xl:focus-within:w-90">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 transition-all duration-300 ease-in-out"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      window.location.href = "/search";
                    }
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={handleWishlistClick}
                asChild={isAuthenticated}
              >
                {isAuthenticated ? (
                  <Link href="/account/wishlist">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {wishlistCount}
                      </Badge>
                    )}
                  </Link>
                ) : (
                  <Link href="/auth/sign-in">
                    <Heart className="h-5 w-5" />
                  </Link>
                )}
              </Button>

              {/* Cart */}
              <CartIcon />

              {/* User Account */}
              <AuthIcon />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {isMenuOpen && (
          <div className="lg:hidden border-t">
            <div className="px-3 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      window.location.href = "/search";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
