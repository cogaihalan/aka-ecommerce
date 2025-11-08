import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsClient } from "@/lib/api/analytics";

export async function GET(request: NextRequest) {
  try {
    const { client, propertyId } = getAnalyticsClient();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";

    // Fetch overview metrics
    const [overviewResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "sessions" },
        { name: "newUsers" },
      ],
    });

    const metrics = overviewResponse.rows?.[0]?.metricValues || [];
    const overview = {
      activeUsers: metrics[0]?.value || "0",
      pageViews: metrics[1]?.value || "0",
      avgSessionDuration: metrics[2]?.value || "0",
      bounceRate: metrics[3]?.value || "0",
      sessions: metrics[4]?.value || "0",
      newUsers: metrics[5]?.value || "0",
    };

    return NextResponse.json({
      success: true,
      data: overview,
      dateRange: { startDate, endDate },
    });
  } catch (error: any) {
    console.error("Error fetching analytics overview:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch analytics data",
      },
      { status: 500 }
    );
  }
}
