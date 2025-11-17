"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { handleWebVitals, getGAId } from "@/lib/web-vitals";

/**
 * WebVitalsReporter Component
 * 
 * This component reports Core Web Vitals metrics using Next.js's built-in
 * reportWebVitals function. It automatically tracks:
 * - LCP (Largest Contentful Paint)
 * - INP (Interaction to Next Paint)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * 
 * Metrics are sent to Google Analytics and optionally to a custom API endpoint.
 */
export function WebVitalsReporter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Wait for page to be interactive before loading web-vitals
    // This prevents blocking the main thread during initial render
    const loadWebVitals = () => {
      // Dynamically import web-vitals to reduce initial bundle size
      import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        // Report each metric type
        onCLS((metric) => handleWebVitals(metric));
        onINP((metric) => handleWebVitals(metric));
        onFCP((metric) => handleWebVitals(metric));
        onLCP((metric) => handleWebVitals(metric));
        onTTFB((metric) => handleWebVitals(metric));
      });
    };

    // Load after page is interactive or after a short delay
    if (document.readyState === "complete") {
      // Use requestIdleCallback if available, otherwise setTimeout
      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadWebVitals, { timeout: 2000 });
      } else {
        setTimeout(loadWebVitals, 100);
      }
    } else {
      window.addEventListener("load", () => {
        if ("requestIdleCallback" in window) {
          requestIdleCallback(loadWebVitals, { timeout: 2000 });
        } else {
          setTimeout(loadWebVitals, 100);
        }
      });
    }

    // Track page views for context (non-blocking)
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    const gaId = getGAId();
    
    // Defer GA page view tracking
    if (typeof window !== "undefined" && window.gtag && gaId) {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          window.gtag?.("config", gaId, {
            page_path: url,
          });
        });
      } else {
        setTimeout(() => {
          window.gtag?.("config", gaId, {
            page_path: url,
          });
        }, 0);
      }
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}

