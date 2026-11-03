import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TrackingService } from "@/services/tracking.service";
import { z } from "zod";

const toggleCompletionSchema = z.object({
  habitId: z.string().min(1, "Habit ID is required"),
  completionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
});

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
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const habitId = searchParams.get("habitId") || undefined;

    const completions = await TrackingService.getCompletions(user.id, {
      startDate,
      endDate,
      habitId,
    });

    return NextResponse.json({
      success: true,
      data: completions,
    });
  } catch (error) {
    console.error("GET /api/completions error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch completions" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = toggleCompletionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format data completion tidak valid",
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const result = await TrackingService.toggleCompletion(
      user.id,
      validation.data.habitId,
      validation.data.completionDate
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: result.completed ? "Kebiasaan ditandai selesai" : "Status selesai dibatalkan",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "HABIT_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Kebiasaan tidak ditemukan atau bukan milik Anda",
          },
        },
        { status: 404 }
      );
    }

    console.error("POST /api/completions error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to toggle completion" } },
      { status: 500 }
    );
  }
}

