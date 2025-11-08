import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsClient } from "@/lib/api/analytics";

export async function GET(request: NextRequest) {
  try {
    const { client, propertyId } = getAnalyticsClient();
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Fetch top referrers
    const [referrersResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [{ name: "sessionSourceMedium" }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "bounceRate" },
      ],
      orderBys: [
        {
          metric: { metricName: "sessions" },
          desc: true,
        },
      ],
      limit,
    });

    const referrers = (referrersResponse.rows || []).map((row) => {
      const sourceMedium =
        row.dimensionValues?.[0]?.value || "(direct) / (none)";
      const [source = "(direct)", medium = "(none)"] =
        sourceMedium.split(" / ");

      return {
        source,
        medium,
        sessions: parseInt(row.metricValues?.[0]?.value || "0", 10),
        activeUsers: parseInt(row.metricValues?.[1]?.value || "0", 10),
        bounceRate: parseFloat(row.metricValues?.[2]?.value || "0"),
      };
    });

    return NextResponse.json({
      success: true,
      data: referrers,
      dateRange: { startDate, endDate },
    });
  } catch (error: any) {
    console.error("Error fetching referrers data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch referrers data",
      },
      { status: 500 }
    );
  }
}
