import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Tidak ada sesi aktif",
        },
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { user },
  });
}

