"use client";

import { useEffect } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

export function GoogleAnalyticsComponent() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-JCGBQBRY9S";

  // Initialize consent mode after component mounts (non-blocking)
  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;

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
  }, []);

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
