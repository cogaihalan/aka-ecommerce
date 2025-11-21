# Core Web Vitals Setup Guide

This project includes comprehensive Core Web Vitals monitoring to help diagnose and improve site performance.

## What are Core Web Vitals?

Core Web Vitals are a set of metrics that measure real-world user experience on your website:

- **LCP (Largest Contentful Paint)**: Measures loading performance. Good: ≤2.5s, Poor: >4.0s
- **INP (Interaction to Next Paint)**: Measures interactivity. Good: ≤200ms, Poor: >500ms
- **CLS (Cumulative Layout Shift)**: Measures visual stability. Good: ≤0.1, Poor: >0.25
- **FCP (First Contentful Paint)**: Measures initial loading. Good: ≤1.8s, Poor: >3.0s
- **TTFB (Time to First Byte)**: Measures server response time. Good: ≤800ms, Poor: >1.8s

## How It Works

The Core Web Vitals tracking is automatically enabled and reports metrics to:

1. **Google Analytics 4**: Metrics are sent as custom events
2. **Custom API Endpoint** (optional): For server-side logging and custom dashboards

## Viewing Metrics

### In Google Analytics 4

1. Go to your Google Analytics dashboard
2. Navigate to **Reports** → **Engagement** → **Events**
3. Look for events with names:
   - `LCP` - Largest Contentful Paint
   - `INP` - Interaction to Next Paint
   - `CLS` - Cumulative Layout Shift
   - `FCP` - First Contentful Paint
   - `TTFB` - Time to First Byte

4. You can also create custom reports:
   - Go to **Explore** → **Free Form**
   - Add `Event name` as a dimension
   - Add `Event value` as a metric
   - Filter by `Event category = Web Vitals`

### In Google Search Console

Google Search Console automatically collects Core Web Vitals data from real users:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Navigate to **Experience** → **Core Web Vitals**
4. View reports for both mobile and desktop

### In Browser Console (Development)

In development mode, metrics are logged to the browser console:
```
[Web Vitals] LCP: 2345ms (good)
[Web Vitals] INP: 150ms (good)
[Web Vitals] CLS: 0.05 (good)
```

## Configuration

### Google Analytics Setup

1. Ensure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in your `.env.local` file
2. The measurement ID should be in format `G-XXXXXXXXXX`
3. If not set, the system will use the hardcoded ID from `layout.tsx`

### Enable Server-Side Logging (Optional)

To enable server-side logging to your API:

1. Open `src/lib/web-vitals.ts`
2. Uncomment the `reportToAPI` call in the `handleWebVitals` function:
   ```typescript
   // Optionally report to custom API
   reportToAPI(metric as WebVitalMetric);
   ```

3. The API endpoint is available at `/api/web-vitals`
4. You can extend this endpoint to store metrics in your database

## Custom Dashboards

### Creating a Custom Dashboard

You can create custom dashboards using the API endpoint:

1. Enable server-side logging (see above)
2. Store metrics in your database
3. Create a dashboard page to visualize the data

Example query to get average LCP by page:
```typescript
// In your API route or server component
const avgLCP = await db.webVitals.aggregate({
  where: { name: 'LCP' },
  _avg: { value: true },
  groupBy: ['page'],
});
```

## Performance Optimization Tips

Based on Core Web Vitals metrics, here are common optimizations:

### Improve LCP (Largest Contentful Paint)
- Optimize images (use Next.js Image component)
- Preload critical resources
- Reduce server response times
- Minimize render-blocking resources
- Use CDN for static assets

### Improve INP (Interaction to Next Paint)
- Reduce JavaScript execution time
- Break up long tasks
- Optimize event handlers
- Use code splitting
- Minimize main thread work

### Improve CLS (Cumulative Layout Shift)
- Set size attributes on images and videos
- Reserve space for ads and embeds
- Avoid inserting content above existing content
- Prefer transform animations over layout-triggering properties

### Improve TTFB (Time to First Byte)
- Optimize server response times
- Use edge caching
- Minimize server-side processing
- Use a CDN
- Optimize database queries

## Testing Locally

To test Core Web Vitals locally:

1. Run your development server: `pnpm dev`
2. Open browser DevTools → Console
3. Navigate through your site
4. Check console logs for Web Vitals metrics

## Production Monitoring

In production, metrics are automatically collected from real users. Monitor:

1. **Google Analytics**: Real-time and historical data
2. **Google Search Console**: Field data from real users
3. **Custom API**: If enabled, your own database

## Troubleshooting

### Metrics Not Appearing in GA4

1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Check browser console for errors
3. Ensure Google Analytics is properly initialized
4. Check GDPR consent settings (metrics won't send if consent is denied)

### Metrics Not Logging

1. Check browser console for errors
2. Verify `web-vitals` package is installed: `pnpm list web-vitals`
3. Ensure the `WebVitalsReporter` component is in your root layout

## Additional Resources

- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)


