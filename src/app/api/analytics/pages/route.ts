import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsClient } from "@/lib/api/analytics";

export async function GET(request: NextRequest) {
  try {
    const { client, propertyId } = getAnalyticsClient();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Fetch top pages
    const [pagesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "activeUsers" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
      orderBys: [
        {
          metric: { metricName: "screenPageViews" },
          desc: true,
        },
      ],
      limit,
    });

    const pages = (pagesResponse.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "",
      title: row.dimensionValues?.[1]?.value || "Untitled",
      pageViews: parseInt(row.metricValues?.[0]?.value || "0", 10),
      activeUsers: parseInt(row.metricValues?.[1]?.value || "0", 10),
      avgSessionDuration: parseFloat(row.metricValues?.[2]?.value || "0"),
      bounceRate: parseFloat(row.metricValues?.[3]?.value || "0"),
    }));

    return NextResponse.json({
      success: true,
      data: pages,
      dateRange: { startDate, endDate },
    });
  } catch (error: any) {
    console.error("Error fetching pages data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch pages data",
      },
      { status: 500 }
    );
  }
}
