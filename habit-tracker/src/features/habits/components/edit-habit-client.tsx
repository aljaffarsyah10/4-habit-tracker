"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHabits } from "@/features/habits/context/habit-context";
import { HabitForm } from "./habit-form";
import { HabitFormValues } from "../schemas";
import { HabitDeleteDialog } from "./habit-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ArrowLeft, Trash2 } from "lucide-react";

interface EditHabitClientProps {
  id: string;
}

export function EditHabitClient({ id }: EditHabitClientProps) {
  const router = useRouter();
  const { getHabitById, updateHabit, deleteHabit } = useHabits();
  const [showDelete, setShowDelete] = useState(false);

  const habit = getHabitById(id);

  if (!habit) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <EmptyState
          title="Habit not found"
          description="The habit you are trying to edit does not exist or may have been removed."
          actionLabel="Back to Habits"
          actionHref="/habits"
        />
      </div>
    );
  }

  const handleUpdate = (values: HabitFormValues) => {
    updateHabit(id, values);
    router.push("/habits");
  };

  const handleDelete = () => {
    deleteHabit(id);
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
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">Edit Habit</CardTitle>
            <CardDescription>Update your habit schedule and configuration.</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 gap-1.5 text-xs"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </Button>
        </CardHeader>
        <CardContent>
          <HabitForm
            initialValues={{
              name: habit.name,
              description: habit.description,
              frequency: habit.frequency,
              scheduledDays: habit.scheduledDays,
              color: habit.color || "#3b82f6",
            }}
            onSubmit={handleUpdate}
            onCancel={() => router.push("/habits")}
            submitLabel="Update Habit"
          />
        </CardContent>
      </Card>

      <HabitDeleteDialog
        isOpen={showDelete}
        habitName={habit.name}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

