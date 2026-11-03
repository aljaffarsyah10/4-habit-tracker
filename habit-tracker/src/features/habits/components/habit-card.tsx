"use client";

import Link from "next/link";
import { HabitWithProgress } from "@/types/habit";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { StreakBadge } from "@/components/common/streak-badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: HabitWithProgress;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  showManageActions?: boolean;
}

export function HabitCard({
  habit,
  onToggle,
  onDelete,
  showManageActions = false,
}: HabitCardProps) {
  const isDone = habit.isCompletedToday;

  return (
    <Card
      className={cn(
        "transition-all border-border hover:border-primary/40",
        isDone ? "bg-muted/40" : "bg-card shadow-sm"
      )}
    >
      <CardContent className="p-4 flex items-center justify-between gap-4">
        {/* Left Section: Color Indicator, Checkbox, Name, Description */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-1.5 h-10 rounded-full shrink-0 transition-opacity"
            style={{ backgroundColor: habit.color || "#3b82f6" }}
          />
          <Checkbox
            id={`habit-${habit.id}`}
            checked={isDone}
            onCheckedChange={() => onToggle(habit.id)}
            className="size-5 rounded-full shrink-0 cursor-pointer"
            aria-label={`Mark ${habit.name} as completed`}
          />
          <div className="min-w-0 flex-1">
            <label
              htmlFor={`habit-${habit.id}`}
              className={cn(
                "text-sm font-semibold truncate block cursor-pointer transition-colors",
                isDone ? "line-through text-muted-foreground" : "text-foreground"
              )}
            >
              {habit.name}
            </label>
            {habit.description && (
              <p className="text-xs text-muted-foreground truncate">{habit.description}</p>
            )}
          </div>
        </div>

        {/* Right Section: Streak Badge & Optional Manage Actions */}
        <div className="shrink-0 flex items-center gap-2">
          <StreakBadge streak={habit.currentStreak} />

          {showManageActions && (
            <div className="flex items-center gap-1 ml-2">
              <Button asChild variant="ghost" size="icon-sm" title="Edit Habit">
                <Link href={`/habits/${habit.id}/edit`}>
                  <Edit2 className="size-3.5" />
                </Link>
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(habit.id)}
                  title="Delete Habit"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
