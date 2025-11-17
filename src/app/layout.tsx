import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/sonner";
import { fontVariables } from "@/lib/font";
import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import "./theme.css";
import ConditionalLayout from "@/components/layout/conditional-layout";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { GoogleAnalyticsComponent } from "@/components/google-analytics";
import { WebVitalsReporter } from "@/components/web-vitals";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  title: "AKA Store - Premium Ecommerce",
  description:
    "Discover premium products at AKA Store. Quality, style, and innovation in every purchase.",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For static generation, we'll let the client-side handle theme
  // This prevents dynamic server usage errors during build
  let activeThemeValue: string | undefined;
  let isScaled = false;

  // Only read cookies in non-static contexts
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    try {
      const cookieStore = await cookies();
      activeThemeValue = cookieStore.get("active_theme")?.value;
      isScaled = activeThemeValue?.endsWith("-scaled") ?? false;
    } catch (error) {
      // Fallback if cookies fail
      console.warn("Failed to read theme cookie:", error);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for external domains - improve connection time */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        
        {/* Theme color script - inline and non-blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('('prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
        {/* Google Analytics initialization - minimal inline script for dataLayer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background overflow-auto overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables
        )}
      >
        <NextTopLoader showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <NuqsAdapter>
            <Providers activeThemeValue={activeThemeValue as string}>
              <Toaster richColors />
              <ConditionalLayout>{children}</ConditionalLayout>
            </Providers>
          </NuqsAdapter>
        </ThemeProvider>
        {/* Lazy load analytics components to reduce initial bundle */}
        <GoogleAnalyticsComponent />
        {/* WebVitals loads after page is interactive to avoid blocking */}
        <WebVitalsReporter />
      </body>
    </html>
  );
}
