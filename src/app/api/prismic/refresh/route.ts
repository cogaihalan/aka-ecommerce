import { NextRequest, NextResponse } from "next/server";
import { prismicApiService } from "@/lib/api/prismic-service";

export async function POST(request: NextRequest) {
  try {
    // Force refresh all Prismic data
    await prismicApiService.refreshAllData();

    return NextResponse.json({
      success: true,
      message: "Prismic cache cleared and data refreshed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error refreshing Prismic data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh Prismic data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to refresh Prismic data",
    timestamp: new Date().toISOString(),
  });
}
