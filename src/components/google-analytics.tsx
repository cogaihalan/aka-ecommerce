"use client";

import { GoogleAnalytics } from "@next/third-parties/google";

export function GoogleAnalyticsComponent() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) {
    return null;
  }

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
