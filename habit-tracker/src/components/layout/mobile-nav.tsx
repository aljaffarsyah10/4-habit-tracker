"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
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
                "flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[48px] rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("size-5 mb-1", isActive ? "stroke-[2.5]" : "stroke-2")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
