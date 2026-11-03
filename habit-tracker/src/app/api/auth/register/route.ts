import { NextResponse } from "next/server";
import { registerSchema } from "@/features/auth/schemas";
import { AuthService } from "@/services/auth.service";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Data pendaftaran tidak valid",
            details: validatedData.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { user, token } = await AuthService.registerUser(validatedData.data);
    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "Akun berhasil didaftarkan",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMAIL_ALREADY_EXISTS",
            message: "Email sudah terdaftar. Silakan gunakan email lain atau login.",
          },
        },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan pada server saat registrasi.",
        },
      },
      { status: 500 }
    );
  }
}

