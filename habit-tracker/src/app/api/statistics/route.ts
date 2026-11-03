import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { StatisticsService } from "@/services/statistics.service";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const daysParam = parseInt(searchParams.get("days") || "30", 10);
    const days = isNaN(daysParam) || daysParam <= 0 ? 30 : Math.min(daysParam, 365);

    const stats = await StatisticsService.getUserStatistics(user.id, days);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("GET /api/statistics error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch statistics" } },
      { status: 500 }
    );
  }
}

