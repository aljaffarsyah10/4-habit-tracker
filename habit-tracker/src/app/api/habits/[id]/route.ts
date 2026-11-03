import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { HabitService } from "@/services/habit.service";
import { updateHabitSchema } from "@/features/habits/schemas";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const habit = await HabitService.getHabitById(user.id, id);

    if (!habit) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Kebiasaan tidak ditemukan" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: habit,
    });
  } catch (error) {
    console.error("GET /api/habits/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch habit" } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validation = updateHabitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format update tidak valid",
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const updated = await HabitService.updateHabit(user.id, id, validation.data);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Kebiasaan tidak ditemukan atau bukan milik Anda" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Kebiasaan berhasil diperbarui",
    });
  } catch (error) {
    console.error("PATCH /api/habits/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to update habit" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await HabitService.deleteHabit(user.id, id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Kebiasaan tidak ditemukan atau bukan milik Anda" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kebiasaan berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/habits/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to delete habit" } },
      { status: 500 }
    );
  }
}

