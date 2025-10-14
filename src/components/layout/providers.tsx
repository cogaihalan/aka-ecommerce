"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import React from "react";
import { ActiveThemeProvider } from "@/components/theme/active-theme";
import { CartProvider } from "@/components/providers/cart-provider";
import { QuickViewProvider } from "@/components/providers/quick-view-provider";
import { WishlistAuthProvider } from "@/components/providers/wishlist-auth-provider";
import { AuthSyncProvider } from "@/components/providers/auth-sync-provider";
import { AppProvider } from "@/components/providers/app-provider";

export default function Providers({
  activeThemeValue,
  children,
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <ClerkProvider
          appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
          }}
        >
          <AppProvider>
            <AuthSyncProvider>
              <WishlistAuthProvider>
                <CartProvider>
                  <QuickViewProvider>{children}</QuickViewProvider>
                </CartProvider>
              </WishlistAuthProvider>
            </AuthSyncProvider>
          </AppProvider>
        </ClerkProvider>
      </ActiveThemeProvider>
    </>
  );
}
