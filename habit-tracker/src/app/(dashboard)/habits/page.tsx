"use client";

import { useState } from "react";
import Link from "next/link";
import { useHabits } from "@/features/habits/context/habit-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StreakBadge } from "@/components/common/streak-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { HabitDeleteDialog } from "@/features/habits/components/habit-delete-dialog";
import { HabitCardSkeleton } from "@/components/feedback/loading-skeleton";
import { Plus, Edit2, Trash2, Calendar, AlertCircle, RefreshCw } from "lucide-react";

const DAYS_MAP: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

export default function HabitsPage() {
  const { habits, deleteHabit, getHabitStreak, isLoading, error, refreshData } = useHabits();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const activeHabits = habits.filter((h) => !h.isArchived);

  const formatSchedule = (frequency: string, scheduledDays: number[]) => {
    if (frequency === "DAILY" || scheduledDays.length === 7) return "Every day";
    return scheduledDays.map((d) => DAYS_MAP[d]).join(", ");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-60 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4">
          <HabitCardSkeleton />
          <HabitCardSkeleton />
          <HabitCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Habits</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, configure, and customize your habits.
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5 self-start sm:self-auto">
          <Link href="/habits/new">
            <Plus className="size-4" />
            <span>Create New Habit</span>
          </Link>
        </Button>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="flex items-center justify-between rounded-lg bg-destructive/15 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refreshData()}
            className="gap-1.5 border-destructive/30 hover:bg-destructive/10"
          >
            <RefreshCw className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* Habits List */}
      {activeHabits.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Start building your routine by creating your very first positive habit."
          actionLabel="+ Create Habit"
          actionHref="/habits/new"
        />
      ) : (
        <div className="grid gap-4">
          {activeHabits.map((habit) => {
            const { currentStreak } = getHabitStreak(habit.id);

            return (
              <Card key={habit.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className="size-3.5 rounded-full mt-1 sm:mt-0 shrink-0"
                      style={{ backgroundColor: habit.color || "#3b82f6" }}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-foreground">{habit.name}</h3>
                        <StreakBadge streak={currentStreak} />
                      </div>
                      {habit.description && (
                        <p className="text-xs text-muted-foreground">{habit.description}</p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                        <Calendar className="size-3.5" />
                        <span>{formatSchedule(habit.frequency, habit.scheduledDays)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Link href={`/habits/${habit.id}/edit`}>
                        <Edit2 className="size-3.5" />
                        <span>Edit</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteTarget({ id: habit.id, name: habit.name })}
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <HabitDeleteDialog
          isOpen={true}
          habitName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteHabit(deleteTarget.id)}
        />
      )}
    </div>
  );
}
