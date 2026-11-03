"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHabits } from "@/features/habits/context/habit-context";
import { HabitForm } from "@/features/habits/components/habit-form";
import { HabitFormValues } from "@/features/habits/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function NewHabitPage() {
  const router = useRouter();
  const { createHabit } = useHabits();

  const handleCreate = (values: HabitFormValues) => {
    createHabit(values);
    router.push("/habits");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs">
          <Link href="/habits">
            <ArrowLeft className="size-4" />
            <span>Back to Habits</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create New Habit</CardTitle>
          <CardDescription>
            Set up a positive routine you want to track consistently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HabitForm
            onSubmit={handleCreate}
            onCancel={() => router.push("/habits")}
            submitLabel="Create Habit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
