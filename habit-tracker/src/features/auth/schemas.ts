import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Nama tidak boleh kosong").max(100, "Nama maksimal 100 karakter").optional(),
  email: z.string().trim().email("Format email tidak valid").toLowerCase(),
  password: z.string().min(6, "Password minimal 6 karakter").max(72, "Password maksimal 72 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid").toLowerCase(),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;

