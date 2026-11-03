export interface UserStatistics {
  currentStreak: number;
  bestStreak: number;
  completionRate: number; // 0 to 100
  totalCompletions: number;
  totalHabits: number;
  weeklySummary: {
    day: string; // e.g. "Mon", "Tue"
    date: string; // "YYYY-MM-DD"
    totalScheduled: number;
    completedCount: number;
    percentage: number;
  }[];
}

