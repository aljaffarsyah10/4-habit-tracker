import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  className?: string;
  size?: "sm" | "md";
}

export function StreakBadge({ streak, className, size = "sm" }: StreakBadgeProps) {
  const isZero = streak <= 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        isZero
          ? "bg-secondary text-muted-foreground"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        className
      )}
      title={`${streak} day streak`}
    >
      <Flame className={cn("fill-current", size === "sm" ? "size-3.5" : "size-4")} />
      <span>{streak}</span>
    </div>
  );
}
