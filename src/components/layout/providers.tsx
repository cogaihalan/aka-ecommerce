"use client";
import { dark } from "@clerk/themes";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import React from "react";
import { ActiveThemeProvider } from "@/components/theme/active-theme";
import { CartProvider } from "@/components/providers/cart-provider";
import { QuickViewProvider } from "@/components/providers/quick-view-provider";
import { WishlistAuthProvider } from "@/components/providers/wishlist-auth-provider";
import { AppProvider } from "@/components/providers/app-provider";
import { ApiAuthProvider } from "@/components/providers/api-auth-provider";
import { AuthSyncProvider } from "@/components/providers/auth-sync-provider";
import { CookieConsentBanner } from "@/components/cookie-consent";

const ClerkProvider = dynamic(() => import("@clerk/nextjs").then((mod) => mod.ClerkProvider), {
  ssr: false,
});

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
            <ApiAuthProvider>
              <AuthSyncProvider>
                <WishlistAuthProvider>
                  <CartProvider>
                    <QuickViewProvider>
                      {children}
                      <CookieConsentBanner />
                    </QuickViewProvider>
                  </CartProvider>
                </WishlistAuthProvider>
              </AuthSyncProvider>
            </ApiAuthProvider>
          </AppProvider>
        </ClerkProvider>
      </ActiveThemeProvider>
    </>
  );
}
