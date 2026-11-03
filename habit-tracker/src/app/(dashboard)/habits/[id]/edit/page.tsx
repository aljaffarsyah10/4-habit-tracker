import { Suspense } from "react";
import { EditHabitClient } from "@/features/habits/components/edit-habit-client";

export function generateStaticParams() {
  return [
    { id: "habit-1" },
    { id: "habit-2" },
    { id: "habit-3" },
    { id: "habit-4" },
    { id: "habit-5" },
  ];
}

interface EditHabitPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHabitPage({ params }: EditHabitPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded-lg" />}>
      <EditHabitClient id={id} />
    </Suspense>
  );
}
