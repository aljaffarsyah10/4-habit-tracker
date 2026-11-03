import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressBar } from "@/components/common/progress-bar";
import { StreakBadge } from "@/components/common/streak-badge";
import { Plus, CheckCircle2 } from "lucide-react";

// Placeholder data for shell verification
const PLACEHOLDER_HABITS = [
  {
    id: "h-1",
    name: "Morning 20m Workout",
    category: "Health & Fitness",
    color: "#10b981",
    streak: 5,
    completed: true,
  },
  {
    id: "h-2",
    name: "Read 15 Pages of Book",
    category: "Learning",
    color: "#3b82f6",
    streak: 12,
    completed: false,
  },
  {
    id: "h-3",
    name: "Drink 2.5L of Water",
    category: "Health",
    color: "#06b6d4",
    streak: 3,
    completed: true,
  },
  {
    id: "h-4",
    name: "10m Mindfulness Meditation",
    category: "Mindfulness",
    color: "#f43f5e",
    streak: 8,
    completed: false,
  },
];

export default function DashboardPage() {
  const completedCount = PLACEHOLDER_HABITS.filter((h) => h.completed).length;
  const totalCount = PLACEHOLDER_HABITS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

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
            value={progressPercent}
            completed={completedCount}
            total={totalCount}
            label="Daily Completion Rate"
          />
        </CardContent>
      </Card>

      {/* Habit List Stream */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="size-4 text-primary" />
          <span>Scheduled Today</span>
        </h2>

        <div className="grid gap-3">
          {PLACEHOLDER_HABITS.map((habit) => (
            <Card
              key={habit.id}
              className={`transition-all border-border hover:border-primary/40 ${
                habit.completed ? "bg-muted/40" : "bg-card"
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-1.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <Checkbox
                    id={habit.id}
                    checked={habit.completed}
                    className="size-5 rounded-full shrink-0"
                  />
                  <div className="min-w-0">
                    <label
                      htmlFor={habit.id}
                      className={`text-sm font-semibold truncate block cursor-pointer ${
                        habit.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {habit.name}
                    </label>
                    <span className="text-xs text-muted-foreground">{habit.category}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <StreakBadge streak={habit.streak} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
