import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../lib/db/prisma";
import { AuthService } from "../auth.service";
import { HabitService } from "../habit.service";
import { TrackingService } from "../tracking.service";
import { StatisticsService } from "../statistics.service";
import { verifySessionToken } from "../../lib/auth/jwt";

describe("Phase 7 — End-to-End Core Workflow Integration", () => {
  const e2eEmail = `e2e_user_${Date.now()}@example.com`;
  const e2ePassword = "e2ePassword123!";
  let userId: string;
  let sessionToken: string;
  let habitId: string;
  const todayStr = "2026-11-03";

  before(async () => {
    await prisma.$connect();
  });

  after(async () => {
    if (userId) {
      await prisma.user.deleteMany({
        where: { id: userId },
      });
    }
    await prisma.$disconnect();
  });

  it("Step 1: User Registration", async () => {
    const result = await AuthService.registerUser({
      name: "E2E Tester",
      email: e2eEmail,
      password: e2ePassword,
    });

    assert.ok(result.user.id);
    assert.strictEqual(result.user.email, e2eEmail);
    assert.ok(result.token);

    userId = result.user.id;
    sessionToken = result.token;
  });

  it("Step 2: Session & Identity Verification", async () => {
    const payload = await verifySessionToken(sessionToken);
    assert.ok(payload);
    assert.strictEqual(payload.userId, userId);
    assert.strictEqual(payload.email, e2eEmail);
  });

  it("Step 3: Initial Empty State for New User", async () => {
    const habits = await HabitService.listHabits(userId);
    assert.strictEqual(habits.length, 0);

    const progress = await TrackingService.getDailyProgress(userId, todayStr);
    assert.strictEqual(progress.totalScheduled, 0);
    assert.strictEqual(progress.completedScheduledCount, 0);
    assert.strictEqual(progress.progressPercentage, 0);
  });

  it("Step 4: Create First Habit", async () => {
    const habit = await HabitService.createHabit(userId, {
      name: "Read 10 Pages",
      description: "Read everyday before bed",
      frequency: "DAILY",
      scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      color: "#6366f1",
    });

    assert.ok(habit.id);
    assert.strictEqual(habit.userId, userId);
    assert.strictEqual(habit.name, "Read 10 Pages");
    habitId = habit.id;
  });

  it("Step 5: View Dashboard with Scheduled Habit", async () => {
    const habits = await HabitService.listHabits(userId);
    assert.strictEqual(habits.length, 1);
    assert.strictEqual(habits[0].id, habitId);

    const progress = await TrackingService.getDailyProgress(userId, todayStr);
    assert.strictEqual(progress.totalScheduled, 1);
    assert.strictEqual(progress.completedScheduledCount, 0);
    assert.strictEqual(progress.progressPercentage, 0);
  });

  it("Step 6: Complete Habit (Toggle On)", async () => {
    const result = await TrackingService.toggleCompletion(userId, habitId, todayStr);
    assert.strictEqual(result.completed, true);
    assert.ok(result.completion);
    assert.strictEqual(result.completion.habitId, habitId);
    assert.strictEqual(result.completion.completionDate, todayStr);
  });

  it("Step 7: Verify Synchronized Progress & Persistence", async () => {
    // 1. Verify progress updated to 100%
    const progress = await TrackingService.getDailyProgress(userId, todayStr);
    assert.strictEqual(progress.totalScheduled, 1);
    assert.strictEqual(progress.completedScheduledCount, 1);
    assert.strictEqual(progress.progressPercentage, 100);

    // 2. Direct database query to verify persistence across restarts
    const dbRecord = await prisma.habitCompletion.findUnique({
      where: {
        unique_habit_daily_completion: {
          habitId,
          completionDate: todayStr,
        },
      },
    });
    assert.ok(dbRecord, "Completion must be persisted in database");
    assert.strictEqual(dbRecord.userId, userId);
  });

  it("Step 8: View Real Aggregated Statistics", async () => {
    const stats = await StatisticsService.getUserStatistics(userId, 7);
    assert.strictEqual(stats.totalActiveHabits, 1);
    assert.strictEqual(stats.totalAllTimeCompletions, 1);
    assert.strictEqual(stats.highestCurrentStreak, 1);
    assert.strictEqual(stats.highestBestStreak, 1);
    // 1 completed day out of 7 scheduled days in the 7-day period = 14%
    assert.strictEqual(stats.overallCompletionRate, 14);

    // Today's daily breakdown is 100% (1 completed out of 1 scheduled)
    const todaySummary = stats.dailyBreakdown.find((d) => d.date === todayStr);
    assert.ok(todaySummary);
    assert.strictEqual(todaySummary.totalScheduled, 1);
    assert.strictEqual(todaySummary.totalCompleted, 1);
    assert.strictEqual(todaySummary.completionRate, 100);
  });

  it("Step 9: Undo Completion (Toggle Off)", async () => {
    const result = await TrackingService.toggleCompletion(userId, habitId, todayStr);
    assert.strictEqual(result.completed, false);
    assert.strictEqual(result.completion, null);

    // Progress resets to 0%
    const progress = await TrackingService.getDailyProgress(userId, todayStr);
    assert.strictEqual(progress.completedScheduledCount, 0);
    assert.strictEqual(progress.progressPercentage, 0);
  });

  it("Step 10: Update Habit", async () => {
    const updated = await HabitService.updateHabit(userId, habitId, {
      name: "Read 20 Pages of Non-Fiction",
      color: "#ec4899",
    });

    assert.ok(updated);
    assert.strictEqual(updated.name, "Read 20 Pages of Non-Fiction");
    assert.strictEqual(updated.color, "#ec4899");
  });

  it("Step 11: Delete Habit", async () => {
    const deleted = await HabitService.deleteHabit(userId, habitId);
    assert.strictEqual(deleted, true);

    const habitsAfter = await HabitService.listHabits(userId);
    assert.strictEqual(habitsAfter.length, 0);
  });
});
