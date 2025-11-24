import { NextRequest, NextResponse } from "next/server";

/**
 * Web Vitals API Route
 * 
 * This endpoint receives Core Web Vitals metrics from the client
 * and can be used for server-side logging, analysis, or custom dashboards.
 * 
 * To enable this, uncomment the reportToAPI call in lib/web-vitals.ts
 */
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();

    // Validate the metric structure
    if (!metric.name || typeof metric.value !== "number") {
      return NextResponse.json(
        { error: "Invalid metric data" },
        { status: 400 }
      );
    }

    // In production, you might want to:
    // 1. Store metrics in a database
    // 2. Send to a logging service (e.g., Sentry, LogRocket)
    // 3. Aggregate for custom dashboards
    // 4. Alert on poor performance

    // For now, we'll just log in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Web Vitals API]", {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        page: metric.page,
        url: metric.url,
        timestamp: new Date().toISOString(),
      });
    }

    // You can add database storage here
    // Example:
    // await db.webVitals.create({
    //   data: {
    //     name: metric.name,
    //     value: metric.value,
    //     rating: metric.rating,
    //     page: metric.page,
    //     url: metric.url,
    //     userAgent: metric.userAgent,
    //     connection: metric.connection,
    //     timestamp: new Date(),
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Web Vitals API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



