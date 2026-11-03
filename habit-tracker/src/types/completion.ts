export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completionDate: string; // Format: "YYYY-MM-DD"
  completedAt: string;
  createdAt: string;
}

export interface ToggleCompletionPayload {
  habitId: string;
  completionDate: string; // "YYYY-MM-DD"
}
