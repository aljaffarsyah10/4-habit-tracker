"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/auth-context";
import { registerSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

export function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string[]; email?: string[]; password?: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validation = registerSchema.safeParse({
      name: name.trim() || undefined,
      email,
      password,
    });

    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await register(validation.data);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Gagal membuat akun. Silakan periksa kembali data Anda.");
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Buat Akun Baru</CardTitle>
        <CardDescription>
          Mulai bangun kebiasaan produktif Anda dan pantau kemajuan harian secara konsisten.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap (Opsional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.name)}
            />
            {fieldErrors.name && (
              <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password ? (
              <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Kata sandi minimal 6 karakter.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mendaftarkan...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
        Sudah memiliki akun?{" "}
        <Link href="/login" className="ml-1 font-semibold text-primary hover:underline">
          Masuk
        </Link>
      </CardFooter>
    </Card>
  );
}
