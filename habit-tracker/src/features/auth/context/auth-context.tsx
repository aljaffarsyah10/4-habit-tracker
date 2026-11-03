"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { RegisterInput, LoginInput } from "../schemas";

export interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.user) {
          setUser(json.data.user);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function initSession() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (!ignore && json.success && json.data?.user) {
            setUser(json.data.user);
            return;
          }
        }
        if (!ignore) setUser(null);
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    initSession();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (input: LoginInput) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data?.error?.message || "Login gagal. Silakan periksa kembali email dan password Anda.",
        };
      }

      setUser(data.data.user);
      router.push("/dashboard");
      router.refresh();
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Terjadi kesalahan jaringan. Silakan coba beberapa saat lagi.",
      };
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data?.error?.message || "Registrasi gagal. Silakan periksa data Anda.",
        };
      }

      setUser(data.data);
      router.push("/dashboard");
      router.refresh();
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Terjadi kesalahan jaringan. Silakan coba beberapa saat lagi.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
