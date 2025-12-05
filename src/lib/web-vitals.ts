/**
 * Core Web Vitals Reporting Utility
 * 
 * This module handles reporting Core Web Vitals metrics to Google Analytics
 * and optionally to a custom API endpoint for server-side analysis.
 * 
 * Core Web Vitals metrics:
 * - LCP (Largest Contentful Paint): Measures loading performance
 * - FID (First Input Delay): Measures interactivity (deprecated, replaced by INP)
 * - INP (Interaction to Next Paint): Measures interactivity
 * - CLS (Cumulative Layout Shift): Measures visual stability
 * - FCP (First Contentful Paint): Measures loading performance
 * - TTFB (Time to First Byte): Measures server response time
 */

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'consent' | 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | { [key: string]: any },
      config?: { [key: string]: any }
    ) => void;
    dataLayer?: Object[];
  }
}

/**
 * Format metric value for display
 */
export function formatMetricValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

/**
 * Get metric rating (good, needs-improvement, poor)
 */
export function getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  // Thresholds based on Core Web Vitals guidelines
  const thresholds: Record<string, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 }, // milliseconds
    INP: { good: 200, poor: 500 }, // milliseconds
    CLS: { good: 0.1, poor: 0.25 }, // score
    FCP: { good: 1800, poor: 3000 }, // milliseconds
    TTFB: { good: 800, poor: 1800 }, // milliseconds
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Main function to handle Web Vitals reporting
 * This is called by Next.js's reportWebVitals function
 */
export function handleWebVitals(metric: { name: string; value: number }): void {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const rating = getMetricRating(metric.name, metric.value);
    const formattedValue = formatMetricValue(metric.name, metric.value);
    console.log(
      `[Web Vitals] ${metric.name}: ${formattedValue} (${rating})`,
      metric
    );
  }
}

