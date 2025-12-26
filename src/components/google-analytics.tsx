"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export function GoogleAnalyticsComponent() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-JCGBQBRY9S";
  const [shouldLoad, setShouldLoad] = useState(false);

  // Defer GA loading to avoid blocking TBT
  useEffect(() => {
    let idleCallbackId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    const loadGA = () => setShouldLoad(true);

    if ('requestIdleCallback' in window) {
      idleCallbackId = (window as any).requestIdleCallback(loadGA, { timeout: 3000 });
    } else {
      // Fallback: defer to next tick
      timeoutId = setTimeout(loadGA, 1500);
    }

    return () => {
      if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Initialize consent mode after GA loads
  useEffect(() => {
    if (!shouldLoad || typeof window === "undefined" || !window.gtag) return;

    // Check if user has previously given consent
    const consentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("gdpr-consent="));
    const hasConsent = consentCookie?.split("=")[1] === "true";

    // Initialize consent mode - denied by default unless previously accepted
    window.gtag("consent", "default", {
      analytics_storage: hasConsent ? "granted" : "denied",
      ad_storage: hasConsent ? "granted" : "denied",
      wait_for_update: 500,
    });
  }, [shouldLoad]);

  // Don't load GA until page is interactive
  if (!shouldLoad) return null;

  return <GoogleAnalytics gaId={measurementId} />;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: "consent" | "config" | "event" | "js" | "set",
      targetId: string | Date | { [key: string]: any },
      config?: { [key: string]: any }
    ) => void;
    dataLayer?: Object[];
  }
}
