export type HabitFrequency = "DAILY" | "WEEKLY";

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  scheduledDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  color: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitWithProgress extends Habit {
  isCompletedToday: boolean;
  currentStreak: number;
  bestStreak: number;
}

export interface CreateHabitInput {
  name: string;
  description?: string | null;
  frequency: HabitFrequency;
  scheduledDays: number[];
  color?: string | null;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  isArchived?: boolean;
}
