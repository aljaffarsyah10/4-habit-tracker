import { prisma } from "@/lib/db/prisma";
import { StreakService, formatDateKey, shiftDate, getDayOfWeek } from "./streak.service";

export interface PeriodSummary {
  date: string;
  totalScheduled: number;
  totalCompleted: number;
  completionRate: number;
}

export class StatisticsService {
  /**
   * Calculates comprehensive statistics for a user.
   * Multi-tenant: scoped strictly to `userId`.
   */
  static async getUserStatistics(userId: string, daysLookback: number = 30) {
    const todayStr = formatDateKey(new Date());
    const startDateStr = shiftDate(todayStr, -(daysLookback - 1));

    // 1. Fetch user's active habits
    const habits = await prisma.habit.findMany({
      where: {
        userId,
      },
      include: {
        completions: {
          select: {
            completionDate: true,
          },
          orderBy: {
            completionDate: "asc",
          },
        },
      },
    });

    const activeHabits = habits.filter((h) => !h.isArchived);

    // 2. Calculate streaks per habit
    let highestBestStreak = 0;
    let highestCurrentStreak = 0;

    for (const habit of activeHabits) {
      const currentStreak = StreakService.calculateCurrentStreak(
        habit.scheduledDays,
        habit.completions,
        todayStr
      );
      const bestStreak = StreakService.calculateBestStreak(
        habit.scheduledDays,
        habit.completions,
        todayStr
      );

      if (currentStreak > highestCurrentStreak) {
        highestCurrentStreak = currentStreak;
      }
      if (bestStreak > highestBestStreak) {
        highestBestStreak = bestStreak;
      }
    }

    // 3. Fetch all completions within lookback window
    const windowCompletions = await prisma.habitCompletion.findMany({
      where: {
        userId,
        completionDate: {
          gte: startDateStr,
          lte: todayStr,
        },
      },
      select: {
        habitId: true,
        completionDate: true,
      },
    });

    const completionMap = new Map<string, Set<string>>(); // date -> Set<habitId>
    for (const comp of windowCompletions) {
      if (!completionMap.has(comp.completionDate)) {
        completionMap.set(comp.completionDate, new Set());
      }
      completionMap.get(comp.completionDate)!.add(comp.habitId);
    }

    // 4. Build daily breakdown
    const dailySummaries: PeriodSummary[] = [];
    let totalScheduledSum = 0;
    let totalCompletedSum = 0;

    let cursorDate = startDateStr;
    while (cursorDate <= todayStr) {
      const dayOfWeek = getDayOfWeek(cursorDate);

      // Habits scheduled on cursorDate
      const scheduledToday = activeHabits.filter((h) => {
        if (h.frequency === "DAILY") return true;
        return h.scheduledDays.includes(dayOfWeek);
      });

      const completedSet = completionMap.get(cursorDate) || new Set<string>();
      const completedScheduledCount = scheduledToday.filter((h) =>
        completedSet.has(h.id)
      ).length;

      const totalScheduled = scheduledToday.length;
      const rate =
        totalScheduled > 0
          ? Math.round((completedScheduledCount / totalScheduled) * 100)
          : 0;

      totalScheduledSum += totalScheduled;
      totalCompletedSum += completedScheduledCount;

      dailySummaries.push({
        date: cursorDate,
        totalScheduled,
        totalCompleted: completedScheduledCount,
        completionRate: rate,
      });

      cursorDate = shiftDate(cursorDate, 1);
    }

    // 5. Total all-time completions
    const totalAllTimeCompletions = await prisma.habitCompletion.count({
      where: { userId },
    });

    // 6. Overall completion rate in period
    const overallPeriodRate =
      totalScheduledSum > 0
        ? Math.round((totalCompletedSum / totalScheduledSum) * 100)
        : 0;

    return {
      periodDays: daysLookback,
      startDate: startDateStr,
      endDate: todayStr,
      totalActiveHabits: activeHabits.length,
      totalAllTimeCompletions,
      totalPeriodCompleted: totalCompletedSum,
      totalPeriodScheduled: totalScheduledSum,
      overallCompletionRate: overallPeriodRate,
      highestCurrentStreak,
      highestBestStreak,
      dailyBreakdown: dailySummaries,
    };
  }
}

