import { Habit } from "@/types/habit";
import { HabitCompletion } from "@/types/completion";

export const INITIAL_MOCK_HABITS: Habit[] = [
  {
    id: "habit-1",
    userId: "user-1",
    name: "Morning 20m Workout",
    description: "Strength training or cardio exercises before breakfast",
    frequency: "DAILY",
    scheduledDays: [0, 1, 2, 3, 4, 5, 6],
    color: "#10b981",
    isArchived: false,
    createdAt: "2026-10-01T07:00:00.000Z",
    updatedAt: "2026-10-01T07:00:00.000Z",
  },
  {
    id: "habit-2",
    userId: "user-1",
    name: "Read 15 Pages of Book",
    description: "Self-improvement, psychology, or technical literature",
    frequency: "DAILY",
    scheduledDays: [0, 1, 2, 3, 4, 5, 6],
    color: "#3b82f6",
    isArchived: false,
    createdAt: "2026-10-05T08:00:00.000Z",
    updatedAt: "2026-10-05T08:00:00.000Z",
  },
  {
    id: "habit-3",
    userId: "user-1",
    name: "Drink 2.5L Water",
    description: "Stay hydrated throughout the workday",
    frequency: "DAILY",
    scheduledDays: [0, 1, 2, 3, 4, 5, 6],
    color: "#06b6d4",
    isArchived: false,
    createdAt: "2026-10-10T09:00:00.000Z",
    updatedAt: "2026-10-10T09:00:00.000Z",
  },
  {
    id: "habit-4",
    userId: "user-1",
    name: "Mindfulness Meditation",
    description: "10 minutes of guided breathing",
    frequency: "WEEKLY",
    scheduledDays: [1, 2, 3, 5], // Mon, Tue, Wed, Fri
    color: "#8b5cf6",
    isArchived: false,
    createdAt: "2026-10-12T07:30:00.000Z",
    updatedAt: "2026-10-12T07:30:00.000Z",
  },
  {
    id: "habit-5",
    userId: "user-1",
    name: "Nightly Reflection & Journal",
    description: "Review today's wins and plan tomorrow's top 3 tasks",
    frequency: "WEEKLY",
    scheduledDays: [1, 2, 3, 4, 5], // Mon to Fri
    color: "#f59e0b",
    isArchived: false,
    createdAt: "2026-10-15T21:00:00.000Z",
    updatedAt: "2026-10-15T21:00:00.000Z",
  },
];

export const STATIC_MOCK_DATE = "2026-11-03";

export function getFormattedDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function generateInitialCompletions(): HabitCompletion[] {
  return [
    {
      id: "c-1",
      habitId: "habit-1",
      userId: "user-1",
      completionDate: "2026-11-03",
      completedAt: "2026-11-03T07:15:00.000Z",
      createdAt: "2026-11-03T07:15:00.000Z",
    },
    {
      id: "c-2",
      habitId: "habit-1",
      userId: "user-1",
      completionDate: "2026-11-02",
      completedAt: "2026-11-02T07:10:00.000Z",
      createdAt: "2026-11-02T07:10:00.000Z",
    },
    {
      id: "c-3",
      habitId: "habit-1",
      userId: "user-1",
      completionDate: "2026-11-01",
      completedAt: "2026-11-01T08:00:00.000Z",
      createdAt: "2026-11-01T08:00:00.000Z",
    },
    {
      id: "c-4",
      habitId: "habit-2",
      userId: "user-1",
      completionDate: "2026-11-02",
      completedAt: "2026-11-02T20:30:00.000Z",
      createdAt: "2026-11-02T20:30:00.000Z",
    },
    {
      id: "c-5",
      habitId: "habit-3",
      userId: "user-1",
      completionDate: "2026-11-03",
      completedAt: "2026-11-03T10:00:00.000Z",
      createdAt: "2026-11-03T10:00:00.000Z",
    },
  ];
}
