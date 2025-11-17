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

import type { Metric } from 'web-vitals';

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

export interface WebVitalMetric extends Metric {
  // Additional metadata
  page?: string;
  url?: string;
  userAgent?: string;
  connection?: string;
  timestamp?: number;
}

/**
 * Get the Google Analytics measurement ID
 */
export function getGAId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check environment variable first
  const envId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (envId) return envId;
  
  // Fallback to hardcoded ID from layout.tsx
  // This matches the ID in your layout.tsx file
  return 'G-JCGBQBRY9S';
}

/**
 * Report metric to Google Analytics
 */
export function reportToGoogleAnalytics(metric: Metric): void {
  const gaId = getGAId();
  if (!gaId || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  const { name, value, id, delta, rating } = metric;

  // Send to Google Analytics as an event
  window.gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    non_interaction: true,
    // Custom dimensions for better analysis
    metric_value: value,
    metric_delta: delta,
    metric_rating: rating,
    metric_id: id,
  });

  // Also send as a custom metric if you have GA4 configured
  // This requires setting up custom metrics in GA4 first
  window.gtag('event', 'web_vitals', {
    [name.toLowerCase()]: value,
    metric_id: id,
    metric_rating: rating,
  });
}

/**
 * Report metric to custom API endpoint (optional)
 * Useful for server-side analysis and custom dashboards
 */
export async function reportToAPI(metric: WebVitalMetric): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Only send in production to avoid cluttering logs
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Web Vitals]', metric);
      return;
    }

    // Add additional context
    const enrichedMetric: WebVitalMetric = {
      ...metric,
      page: window.location.pathname,
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection
        ? `${(navigator as any).connection.effectiveType || 'unknown'}`
        : 'unknown',
      timestamp: Date.now(),
    };

    // Send to your API endpoint
    await fetch('/api/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedMetric),
      // Don't block the page if this fails
      keepalive: true,
    });
  } catch (error) {
    // Silently fail - we don't want to impact user experience
    console.warn('[Web Vitals] Failed to report to API:', error);
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
    FID: { good: 100, poor: 300 }, // milliseconds (deprecated but still measured)
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
export function handleWebVitals(metric: Metric): void {
  // Report to Google Analytics
  reportToGoogleAnalytics(metric);

  // Optionally report to custom API
  // Uncomment if you want server-side logging
  // reportToAPI(metric as WebVitalMetric);

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

