"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusCircle, Flame, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-3">
        <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">
          <Flame className="size-5 fill-current" />
        </div>
        <span className="font-bold text-lg tracking-tight">Habit Tracker</span>
      </div>

      {/* Quick Action */}
      <div className="p-4">
        <Button asChild className="w-full justify-start gap-2 shadow-sm" size="sm">
          <Link href="/habits/new">
            <PlusCircle className="size-4" />
            <span>Create Habit</span>
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {MAIN_NAVIGATION.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account Placeholder */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs">
              JD
            </div>
            <div className="text-xs">
              <p className="font-medium">John Doe</p>
              <p className="text-muted-foreground truncate max-w-[100px]">user@example.com</p>
            </div>
          </div>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
            title="Logout"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
