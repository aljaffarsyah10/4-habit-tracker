import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              <Flame className="size-4 fill-current" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">Habit Tracker</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-card text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 Habit Tracker. Simple habit tracking with meaningful progress.</p>
        </div>
      </footer>
    </div>
  );
}
