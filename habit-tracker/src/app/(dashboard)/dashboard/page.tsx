"use client";

import { useState } from "react";
import Link from "next/link";
import { useHabits } from "@/features/habits/context/habit-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { HabitCard } from "@/features/habits/components/habit-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { DashboardSkeleton } from "@/components/feedback/loading-skeleton";
import { Plus, CheckCircle2, Flame, Calendar, AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { todayHabits, todayProgress, toggleCompletion, isLoading, error, refreshData } = useHabits();
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  const completedCount = todayProgress.completed;
  const remainingCount = Math.max(0, todayProgress.total - todayProgress.completed);

  const displayedHabits = todayHabits.filter((h) => {
    if (filter === "completed") return h.isCompletedToday;
    if (filter === "pending") return !h.isCompletedToday;
    return true;
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Today&apos;s Habits</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and complete your scheduled daily activities.
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5 self-start sm:self-auto">
          <Link href="/habits/new">
            <Plus className="size-4" />
            <span>New Habit</span>
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

      {/* Daily Progress Banner */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <ProgressBar
            value={todayProgress.percentage}
            completed={todayProgress.completed}
            total={todayProgress.total}
            label="Daily Completion Rate"
          />
        </CardContent>
      </Card>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="p-4 bg-card/60">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <Calendar className="size-3.5 text-primary" />
            <span>Scheduled</span>
          </div>
          <p className="text-xl font-bold mt-1 text-foreground">{todayProgress.total}</p>
        </Card>

        <Card className="p-4 bg-card/60">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span>Completed</span>
          </div>
          <p className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            {todayProgress.completed}
          </p>
        </Card>

        <Card className="p-4 bg-card/60 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <Flame className="size-3.5 text-amber-500" />
            <span>Remaining</span>
          </div>
          <p className="text-xl font-bold mt-1 text-foreground">{remainingCount}</p>
        </Card>
      </div>

      {/* Habit List Stream with Filter Pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            <span>Scheduled Today</span>
          </h2>

          {/* Filter Pills */}
          {todayHabits.length > 0 && (
            <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({todayHabits.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter === "completed"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Completed ({completedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter === "pending"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pending ({remainingCount})
              </button>
            </div>
          )}
        </div>

        {todayHabits.length === 0 ? (
          <EmptyState
            title="No habits scheduled for today"
            description="You don't have any habits scheduled for today. Add a new habit or adjust your schedule."
            actionLabel="+ Create Habit"
            actionHref="/habits/new"
          />
        ) : displayedHabits.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {filter === "completed"
              ? "You haven't completed any habits yet today. Click a habit checkmark above to complete it!"
              : "Awesome job! You've completed all scheduled habits for today!"}
          </div>
        ) : (
          <div className="grid gap-3">
            {displayedHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleCompletion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
