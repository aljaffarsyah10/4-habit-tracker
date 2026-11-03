import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  total?: number;
  completed?: number;
  label?: string;
  className?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  value,
  total,
  completed,
  label = "Daily Progress",
  className,
  showPercent = true,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {completed !== undefined && total !== undefined && (
            <span className="text-muted-foreground text-xs">
              {completed} of {total} completed
            </span>
          )}
          {showPercent && (
            <span className="font-semibold text-primary text-xs">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      </div>
      <Progress value={clampedValue} className="h-2.5" />
    </div>
  );
}

