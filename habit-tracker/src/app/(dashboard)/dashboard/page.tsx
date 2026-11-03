"use client";

import Link from "next/link";
import { useHabits } from "@/features/habits/context/habit-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { HabitCard } from "@/features/habits/components/habit-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { Plus, CheckCircle2, Flame, Calendar } from "lucide-react";

export default function DashboardPage() {
  const { todayHabits, todayProgress, toggleCompletion } = useHabits();

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
          <p className="text-xl font-bold mt-1 text-foreground">
            {todayProgress.total - todayProgress.completed}
          </p>
        </Card>
      </div>

      {/* Habit List Stream */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="size-4 text-primary" />
          <span>Scheduled Today</span>
        </h2>

        {todayHabits.length === 0 ? (
          <EmptyState
            title="No habits scheduled for today"
            description="You don't have any habits scheduled for today. Add a new habit or adjust your schedule."
            actionLabel="+ Create Habit"
            actionHref="/habits/new"
          />
        ) : (
          <div className="grid gap-3">
            {todayHabits.map((habit) => (
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
