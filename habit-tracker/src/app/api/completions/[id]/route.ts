import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { TrackingService } from "@/services/tracking.service";

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
    const deleted = await TrackingService.deleteCompletion(user.id, id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Data completion tidak ditemukan" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data completion berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/completions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to delete completion" } },
      { status: 500 }
    );
  }
}

