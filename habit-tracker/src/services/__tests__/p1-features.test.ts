import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../lib/db/prisma";
import { AuthService } from "../auth.service";
import { HabitService } from "../habit.service";
import { TrackingService } from "../tracking.service";
import { StatisticsService } from "../statistics.service";

describe("Phase 8 — P1 Supporting Features Verification", () => {
  const p1Email = `p1_user_${Date.now()}@example.com`;
  let userId: string;
  let habitId: string;

  before(async () => {
    await prisma.$connect();
    const { user } = await AuthService.registerUser({
      name: "P1 User",
      email: p1Email,
      password: "passwordP1Features!",
    });
    userId = user.id;

    // Create a habit
    const habit = await HabitService.createHabit(userId, {
      name: "30-min Reading",
      description: "Read books for 30 minutes",
      frequency: "DAILY",
      scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      color: "#8b5cf6",
    });
    habitId = habit.id;
  });

  after(async () => {
    if (userId) {
      await prisma.user.deleteMany({
        where: { id: userId },
      });
    }
    await prisma.$disconnect();
  });

  describe("P1: Habit Archive and Restore", () => {
    it("archives an active habit", async () => {
      const updated = await HabitService.updateHabit(userId, habitId, {
        isArchived: true,
      });

      assert.ok(updated);
      assert.strictEqual(updated.isArchived, true);

      // Verify active list no longer returns the archived habit
      const activeList = await HabitService.listHabits(userId, { isArchived: false });
      assert.strictEqual(activeList.length, 0);

      // Verify archived list returns the habit
      const archivedList = await HabitService.listHabits(userId, { isArchived: true });
      assert.strictEqual(archivedList.length, 1);
      assert.strictEqual(archivedList[0].id, habitId);
    });

    it("restores an archived habit back to active list", async () => {
      const restored = await HabitService.updateHabit(userId, habitId, {
        isArchived: false,
      });

      assert.ok(restored);
      assert.strictEqual(restored.isArchived, false);

      // Verify active list contains it again
      const activeList = await HabitService.listHabits(userId, { isArchived: false });
      assert.strictEqual(activeList.length, 1);
      assert.strictEqual(activeList[0].id, habitId);

      // Verify archived list is empty
      const archivedList = await HabitService.listHabits(userId, { isArchived: true });
      assert.strictEqual(archivedList.length, 0);
    });
  });

  describe("P1: 30-Day Activity Calendar & Statistics Aggregation", () => {
    it("returns a 30-day chronological daily breakdown", async () => {
      // Toggle a completion for today
      await TrackingService.toggleCompletion(userId, habitId, "2026-11-03");

      const stats = await StatisticsService.getUserStatistics(userId, 30);
      assert.strictEqual(stats.periodDays, 30);
      assert.strictEqual(stats.dailyBreakdown.length, 30);
      assert.strictEqual(stats.totalActiveHabits, 1);
      assert.strictEqual(stats.totalAllTimeCompletions, 1);

      // Verify dates are consecutive and sorted
      for (let i = 1; i < stats.dailyBreakdown.length; i++) {
        assert.ok(stats.dailyBreakdown[i].date > stats.dailyBreakdown[i - 1].date);
      }
    });
  });
});

