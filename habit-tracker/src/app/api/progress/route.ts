import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TrackingService } from "@/services/tracking.service";

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
    const date = searchParams.get("date") || undefined;

    const progress = await TrackingService.getDailyProgress(user.id, date);

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch progress" } },
      { status: 500 }
    );
  }
}

