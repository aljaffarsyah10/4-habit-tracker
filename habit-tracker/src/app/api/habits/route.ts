import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { HabitService } from "@/services/habit.service";
import { habitFormSchema } from "@/features/habits/schemas";

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
    const isArchived = searchParams.get("archived") === "true";

    const habits = await HabitService.listHabits(user.id, { isArchived });

    return NextResponse.json({
      success: true,
      data: habits,
    });
  } catch (error) {
    console.error("GET /api/habits error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch habits" } },
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
    const validation = habitFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Data kebiasaan tidak valid",
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const newHabit = await HabitService.createHabit(user.id, validation.data);

    return NextResponse.json(
      {
        success: true,
        data: newHabit,
        message: "Habit created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to create habit" } },
      { status: 500 }
    );
  }
}

