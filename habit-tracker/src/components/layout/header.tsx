"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Flame, Plus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";

const emptySubscribe = () => () => {};

function useClientDate(): string {
  return useSyncExternalStore(
    emptySubscribe,
    () =>
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    () => "Hari Ini"
  );
}

export function Header() {
  const today = useClientDate();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      {/* Mobile Brand / Desktop Date */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            <Flame className="size-4 fill-current" />
          </div>
          <span className="font-bold text-base tracking-tight">Habit Tracker</span>
        </div>
        <div className="hidden lg:block min-h-[36px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Hari Ini</p>
          <p className="text-sm font-semibold text-foreground">
            {today}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex gap-1.5 text-xs">
          <Link href="/habits/new">
            <Plus className="size-3.5" />
            <span>Tambah Kebiasaan</span>
          </Link>
        </Button>
        <Link
          href="/settings"
          className="size-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          title={user?.email ? `Akun: ${user.email}` : "Pengaturan Akun"}
        >
          <User className="size-4" />
        </Link>
        <button
          type="button"
          onClick={logout}
          className="lg:hidden size-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-secondary/80 transition-colors"
          title="Keluar"
          aria-label="Logout"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
}
