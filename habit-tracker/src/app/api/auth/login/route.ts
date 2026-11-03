import { NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/schemas";
import { AuthService } from "@/services/auth.service";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Format input tidak valid",
            details: validatedData.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { user, token } = await AuthService.loginUser(validatedData.data);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      data: { user },
      message: "Login berhasil",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Email atau kata sandi yang Anda masukkan salah.",
          },
        },
        { status: 401 }
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan pada server saat login.",
        },
      },
      { status: 500 }
    );
  }
}

