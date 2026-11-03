/**
 * Streak Calculation Engine
 * 
 * Rules based on PRD FR-10 and TECHNICAL_PLAN.md:
 * - Schedule-aware: Days not scheduled do not break streak.
 * - Today's uncompleted habit does not prematurely break the streak.
 * - Current streak counts consecutive scheduled days completed up to today/yesterday.
 * - Best streak tracks the longest consecutive completed scheduled days streak across all history.
 */

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function shiftDate(dateStr: string, offsetDays: number): string {
  const date = parseDateKey(dateStr);
  date.setDate(date.getDate() + offsetDays);
  return formatDateKey(date);
}

export function getDayOfWeek(dateStr: string): number {
  return parseDateKey(dateStr).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

export interface CompletionRecord {
  completionDate: string; // Format: "YYYY-MM-DD"
}

export class StreakService {
  /**
   * Calculates the current streak for a habit.
   * 
   * @param scheduledDays Array of days of the week (0=Sunday ... 6=Saturday)
   * @param completions Array of completion records
   * @param todayDateStr Optional today date string ("YYYY-MM-DD") for determinism in testing
   */
  static calculateCurrentStreak(
    scheduledDays: number[] = [0, 1, 2, 3, 4, 5, 6],
    completions: CompletionRecord[] = [],
    todayDateStr?: string
  ): number {
    if (!scheduledDays || scheduledDays.length === 0) {
      scheduledDays = [0, 1, 2, 3, 4, 5, 6];
    }

    if (!completions || completions.length === 0) {
      return 0;
    }

    const completedDates = new Set(completions.map((c) => c.completionDate));
    const activeScheduledDays = new Set(scheduledDays);

    const todayStr = todayDateStr || formatDateKey(new Date());
    let currentStreak = 0;

    const todayDayOfWeek = getDayOfWeek(todayStr);
    const isTodayScheduled = activeScheduledDays.has(todayDayOfWeek);
    const isTodayCompleted = completedDates.has(todayStr);

    if (isTodayScheduled && isTodayCompleted) {
      currentStreak += 1;
    }

    // Now scan backwards starting from yesterday
    let checkDateStr = shiftDate(todayStr, -1);
    
    // Safety guard to prevent infinite loop (look back up to 3650 days / 10 years max)
    const MAX_LOOKBACK_DAYS = 3650;
    let daysChecked = 0;

    while (daysChecked < MAX_LOOKBACK_DAYS) {
      daysChecked++;
      const dayOfWeek = getDayOfWeek(checkDateStr);

      if (activeScheduledDays.has(dayOfWeek)) {
        if (completedDates.has(checkDateStr)) {
          currentStreak += 1;
        } else {
          // A scheduled day was missed! Streak is broken here.
          break;
        }
      }
      // If the day was not scheduled, continue scanning backwards without breaking or incrementing streak

      checkDateStr = shiftDate(checkDateStr, -1);
    }

    return currentStreak;
  }

  /**
   * Calculates the best (longest) streak across historical completions.
   * 
   * @param scheduledDays Array of days of the week (0=Sunday ... 6=Saturday)
   * @param completions Array of completion records
   * @param referenceDateStr Optional reference end date ("YYYY-MM-DD")
   */
  static calculateBestStreak(
    scheduledDays: number[] = [0, 1, 2, 3, 4, 5, 6],
    completions: CompletionRecord[] = [],
    referenceDateStr?: string
  ): number {
    if (!scheduledDays || scheduledDays.length === 0) {
      scheduledDays = [0, 1, 2, 3, 4, 5, 6];
    }

    if (!completions || completions.length === 0) {
      return 0;
    }

    const completedDates = new Set(completions.map((c) => c.completionDate));
    const activeScheduledDays = new Set(scheduledDays);

    // Get sorted unique completion dates (ascending)
    const sortedCompletions = Array.from(completedDates).sort();
    if (sortedCompletions.length === 0) {
      return 0;
    }

    const firstCompletionDate = sortedCompletions[0];
    const endDateStr = referenceDateStr || formatDateKey(new Date());

    let bestStreak = 0;
    let runningStreak = 0;

    let currentDateStr = firstCompletionDate;

    // Scan forward from earliest completion up to reference end date
    while (currentDateStr <= endDateStr) {
      const dayOfWeek = getDayOfWeek(currentDateStr);

      if (activeScheduledDays.has(dayOfWeek)) {
        if (completedDates.has(currentDateStr)) {
          runningStreak += 1;
          if (runningStreak > bestStreak) {
            bestStreak = runningStreak;
          }
        } else {
          // Missed scheduled day in history breaks running streak
          runningStreak = 0;
        }
      }
      // Non-scheduled days are skipped and do not reset runningStreak

      currentDateStr = shiftDate(currentDateStr, 1);
    }

    return Math.max(bestStreak, runningStreak);
  }
}

