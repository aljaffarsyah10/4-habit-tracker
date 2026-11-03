import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createSessionToken } from "@/lib/auth/jwt";
import type { RegisterInput, LoginInput } from "@/features/auth/schemas";

export class AuthService {
  static async registerUser(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name: input.name || null,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return { user, token };
  }

  static async loginUser(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.passwordHash) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    };

    return { user: safeUser, token };
  }
}

