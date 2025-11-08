import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsClient } from "@/lib/api/analytics";

export async function GET(request: NextRequest) {
  try {
    const { client, propertyId } = getAnalyticsClient();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";

    // Fetch visitor data over time
    const [visitorsResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const visitors = (visitorsResponse.rows || []).map((row) => ({
      date: row.dimensionValues?.[0]?.value || "",
      activeUsers: parseInt(row.metricValues?.[0]?.value || "0", 10),
      newUsers: parseInt(row.metricValues?.[1]?.value || "0", 10),
      sessions: parseInt(row.metricValues?.[2]?.value || "0", 10),
    }));

    return NextResponse.json({
      success: true,
      data: visitors,
      dateRange: { startDate, endDate },
    });
  } catch (error: any) {
    console.error("Error fetching visitors data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch visitors data",
      },
      { status: 500 }
    );
  }
}
