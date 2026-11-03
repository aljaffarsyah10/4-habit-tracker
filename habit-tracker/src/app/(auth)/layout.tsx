import { ReactNode } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm">
            <Flame className="size-5 fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight">Habit Tracker</span>
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-xs text-muted-foreground text-center">
        &copy; 2026 Habit Tracker. All rights reserved.
      </p>
    </div>
  );
}

