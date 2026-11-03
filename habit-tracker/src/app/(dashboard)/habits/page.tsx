import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StreakBadge } from "@/components/common/streak-badge";
import { Plus, Edit2, Calendar } from "lucide-react";

const PLACEHOLDER_MANAGE_HABITS = [
  {
    id: "h-1",
    name: "Morning 20m Workout",
    description: "Strength training or cardio exercises",
    frequency: "Daily",
    streak: 5,
    color: "#10b981",
  },
  {
    id: "h-2",
    name: "Read 15 Pages of Book",
    description: "Productivity, psychology, or fiction",
    frequency: "Daily",
    streak: 12,
    color: "#3b82f6",
  },
  {
    id: "h-3",
    name: "Drink 2.5L of Water",
    description: "Stay hydrated throughout the day",
    frequency: "Daily",
    streak: 3,
    color: "#06b6d4",
  },
  {
    id: "h-4",
    name: "10m Mindfulness Meditation",
    description: "Guided breathing before work",
    frequency: "Mon, Wed, Fri",
    streak: 8,
    color: "#f43f5e",
  },
];

export default function HabitsPage() {
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

      {/* Habits List */}
      <div className="grid gap-4">
        {PLACEHOLDER_MANAGE_HABITS.map((habit) => (
          <Card key={habit.id} className="hover:border-primary/40 transition-colors">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className="size-3.5 rounded-full mt-1 sm:mt-0 shrink-0"
                  style={{ backgroundColor: habit.color }}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base text-foreground">{habit.name}</h3>
                    <StreakBadge streak={habit.streak} />
                  </div>
                  <p className="text-xs text-muted-foreground">{habit.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <Calendar className="size-3.5" />
                    <span>{habit.frequency}</span>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
