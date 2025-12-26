"use client";

import { useEffect, useState } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { handleWebVitals } from "@/lib/web-vitals";

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
 * 
 * Note: webVitalsAttribution is enabled in next.config.ts to provide additional
 * attribution data for debugging performance issues.
 */
export function WebVitalsReporter() {
  const [isReady, setIsReady] = useState(false);

  // Defer web vitals reporting to avoid blocking TBT
  useEffect(() => {
    let idleCallbackId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    if ('requestIdleCallback' in window) {
      idleCallbackId = (window as any).requestIdleCallback(
        () => setIsReady(true),
        { timeout: 2000 }
      );
    } else {
      timeoutId = setTimeout(() => setIsReady(true), 1000);
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

  // Only report when ready
  useReportWebVitals((metric) => {
    if (isReady) {
      handleWebVitals(metric);
    }
  });

  return null;
}
