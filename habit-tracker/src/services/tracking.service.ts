import { prisma } from "@/lib/db/prisma";
import { getDayOfWeek, formatDateKey } from "./streak.service";

export class TrackingService {
  /**
   * Toggles completion for a habit on a specific date (YYYY-MM-DD).
   * If a completion already exists, it is deleted (toggle off).
   * If none exists, a new completion is created (toggle on).
   * Concurrency is safe due to database @@unique([habitId, completionDate]).
   */
  static async toggleCompletion(
    userId: string,
    habitId: string,
    completionDate: string
  ) {
    // 1. Verify habit exists and belongs to the user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!habit) {
      throw new Error("HABIT_NOT_FOUND");
    }

    // 2. Check if a completion already exists for this habit & date
    const existing = await prisma.habitCompletion.findUnique({
      where: {
        unique_habit_daily_completion: {
          habitId,
          completionDate,
        },
      },
    });

    if (existing) {
      // Toggle off: delete completion
      await prisma.habitCompletion.delete({
        where: { id: existing.id },
      });

      return {
        completed: false,
        completion: null,
      };
    }

    // Toggle on: create completion
    const newCompletion = await prisma.habitCompletion.create({
      data: {
        habitId,
        userId,
        completionDate,
      },
    });

    return {
      completed: true,
      completion: newCompletion,
    };
  }

  /**
   * Retrieves completions for a user within an optional date range or habitId.
   */
  static async getCompletions(
    userId: string,
    options?: {
      startDate?: string;
      endDate?: string;
      habitId?: string;
    }
  ) {
    const whereClause: {
      userId: string;
      completionDate?: { gte?: string; lte?: string };
      habitId?: string;
    } = {
      userId,
    };

    if (options?.startDate || options?.endDate) {
      whereClause.completionDate = {};
      if (options.startDate) {
        whereClause.completionDate.gte = options.startDate;
      }
      if (options.endDate) {
        whereClause.completionDate.lte = options.endDate;
      }
    }

    if (options?.habitId) {
      whereClause.habitId = options.habitId;
    }

    return await prisma.habitCompletion.findMany({
      where: whereClause,
      orderBy: {
        completionDate: "asc",
      },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
  }

  /**
   * Deletes a completion record by ID, verifying user ownership.
   */
  static async deleteCompletion(userId: string, completionId: string) {
    const result = await prisma.habitCompletion.deleteMany({
      where: {
        id: completionId,
        userId,
      },
    });

    return result.count > 0;
  }

  /**
   * Calculates daily progress metrics for a specific date.
   */
  static async getDailyProgress(userId: string, dateStr?: string) {
    const targetDate = dateStr || formatDateKey(new Date());
    const dayOfWeek = getDayOfWeek(targetDate);

    // Get all active habits for user
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isArchived: false,
      },
    });

    // Filter habits scheduled for this day of week
    const scheduledHabits = habits.filter((habit) => {
      if (habit.frequency === "DAILY") {
        return true;
      }
      return habit.scheduledDays.includes(dayOfWeek);
    });

    // Get completions on target date
    const completions = await prisma.habitCompletion.findMany({
      where: {
        userId,
        completionDate: targetDate,
      },
      select: {
        habitId: true,
      },
    });

    const completedHabitIdSet = new Set(completions.map((c) => c.habitId));

    const totalScheduled = scheduledHabits.length;
    const completedScheduledCount = scheduledHabits.filter((h) =>
      completedHabitIdSet.has(h.id)
    ).length;

    const progressPercentage =
      totalScheduled > 0
        ? Math.round((completedScheduledCount / totalScheduled) * 100)
        : 0;

    return {
      date: targetDate,
      totalScheduled,
      completedScheduledCount,
      progressPercentage,
      scheduledHabitIds: scheduledHabits.map((h) => h.id),
      completedHabitIds: Array.from(completedHabitIdSet),
    };
  }
}

