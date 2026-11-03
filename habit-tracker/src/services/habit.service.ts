import { prisma } from "@/lib/db/prisma";
import { StreakService } from "./streak.service";
import type { HabitFormValues, UpdateHabitInput } from "@/features/habits/schemas";

export class HabitService {
  /**
   * Retrieves all habits for a specific user, with optional archived filter.
   * Multi-tenant security: strictly filtered by `userId`.
   */
  static async listHabits(
    userId: string,
    options?: { isArchived?: boolean }
  ) {
    const isArchived = options?.isArchived ?? false;

    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isArchived,
      },
      include: {
        completions: {
          select: {
            completionDate: true,
          },
          orderBy: {
            completionDate: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return habits.map((habit) => {
      const currentStreak = StreakService.calculateCurrentStreak(
        habit.scheduledDays,
        habit.completions
      );
      const bestStreak = StreakService.calculateBestStreak(
        habit.scheduledDays,
        habit.completions
      );

      return {
        id: habit.id,
        userId: habit.userId,
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        scheduledDays: habit.scheduledDays,
        color: habit.color,
        isArchived: habit.isArchived,
        createdAt: habit.createdAt,
        updatedAt: habit.updatedAt,
        currentStreak,
        bestStreak,
        totalCompletions: habit.completions.length,
      };
    });
  }

  /**
   * Retrieves a single habit by ID, verifying user ownership.
   */
  static async getHabitById(userId: string, habitId: string) {
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
      include: {
        completions: {
          select: {
            id: true,
            completionDate: true,
            completedAt: true,
          },
          orderBy: {
            completionDate: "desc",
          },
        },
      },
    });

    if (!habit) {
      return null;
    }

    const currentStreak = StreakService.calculateCurrentStreak(
      habit.scheduledDays,
      habit.completions
    );
    const bestStreak = StreakService.calculateBestStreak(
      habit.scheduledDays,
      habit.completions
    );

    return {
      ...habit,
      currentStreak,
      bestStreak,
      totalCompletions: habit.completions.length,
    };
  }

  /**
   * Creates a new habit for a user.
   */
  static async createHabit(userId: string, data: HabitFormValues) {
    const habit = await prisma.habit.create({
      data: {
        userId,
        name: data.name,
        description: data.description || null,
        frequency: data.frequency,
        scheduledDays: data.scheduledDays,
        color: data.color || "#3b82f6",
      },
    });

    return {
      ...habit,
      currentStreak: 0,
      bestStreak: 0,
      totalCompletions: 0,
    };
  }

  /**
   * Updates an existing habit, guaranteeing ownership check.
   */
  static async updateHabit(userId: string, habitId: string, data: UpdateHabitInput) {
    // Verify ownership
    const existing = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!existing) {
      return null;
    }

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: {
        name: data.name ?? undefined,
        description: data.description !== undefined ? data.description : undefined,
        frequency: data.frequency ?? undefined,
        scheduledDays: data.scheduledDays ?? undefined,
        color: data.color ?? undefined,
        isArchived: data.isArchived ?? undefined,
      },
    });

    return updated;
  }

  /**
   * Deletes a habit, guaranteeing ownership check and cascade deleting completions.
   */
  static async deleteHabit(userId: string, habitId: string) {
    // Delete only if both habitId and userId match
    const result = await prisma.habit.deleteMany({
      where: {
        id: habitId,
        userId,
      },
    });

    return result.count > 0;
  }
}

