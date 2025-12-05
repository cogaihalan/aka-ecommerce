"use client";

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
  useReportWebVitals(handleWebVitals);

  return null;
}
