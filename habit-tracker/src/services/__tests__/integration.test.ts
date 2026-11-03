import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../lib/db/prisma";
import { AuthService } from "../auth.service";
import { HabitService } from "../habit.service";
import { TrackingService } from "../tracking.service";
import { StatisticsService } from "../statistics.service";

describe("Backend Integration & Security Tests", () => {
  const testEmail1 = `test_user1_${Date.now()}@example.com`;
  const testEmail2 = `test_user2_${Date.now()}@example.com`;
  let user1Id: string;
  let user2Id: string;
  let habit1Id: string;

  before(async () => {
    // Ensure database connection
    await prisma.$connect();
  });

  after(async () => {
    // Cleanup test users and cascade data
    if (user1Id || user2Id) {
      await prisma.user.deleteMany({
        where: {
          id: { in: [user1Id, user2Id].filter(Boolean) },
        },
      });
    }
    await prisma.$disconnect();
  });

  describe("Authentication & Password Security", () => {
    it("registers a new user with hashed password", async () => {
      const { user, token } = await AuthService.registerUser({
        name: "Test User One",
        email: testEmail1,
        password: "securePassword123!",
      });

      assert.ok(user.id);
      assert.strictEqual(user.email, testEmail1);
      assert.ok(token);
      user1Id = user.id;

      // Verify password in DB is hashed and not plaintext
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      assert.ok(dbUser?.passwordHash);
      assert.notStrictEqual(dbUser.passwordHash, "securePassword123!");
      assert.ok(dbUser.passwordHash.startsWith("$2"));
    });

    it("prevents duplicate user registration", async () => {
      await assert.rejects(
        async () => {
          await AuthService.registerUser({
            name: "Duplicate User",
            email: testEmail1,
            password: "anotherPassword",
          });
        },
        {
          name: "Error",
          message: "EMAIL_ALREADY_EXISTS",
        }
      );
    });

    it("authenticates valid credentials successfully", async () => {
      const { user, token } = await AuthService.loginUser({
        email: testEmail1,
        password: "securePassword123!",
      });

      assert.strictEqual(user.id, user1Id);
      assert.ok(token);
    });

    it("rejects invalid password", async () => {
      await assert.rejects(
        async () => {
          await AuthService.loginUser({
            email: testEmail1,
            password: "wrongPassword!",
          });
        },
        {
          name: "Error",
          message: "INVALID_CREDENTIALS",
        }
      );
    });

    it("creates second user for multi-tenant isolation testing", async () => {
      const { user } = await AuthService.registerUser({
        name: "Test User Two",
        email: testEmail2,
        password: "passwordUser2!",
      });
      user2Id = user.id;
      assert.ok(user2Id);
    });
  });

  describe("Multi-Tenant Habit CRUD & IDOR Prevention", () => {
    it("creates a habit scoped to User 1", async () => {
      const habit = await HabitService.createHabit(user1Id, {
        name: "Morning Meditation",
        description: "10 minutes of mindfulness",
        frequency: "DAILY",
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        color: "#10b981",
      });

      assert.ok(habit.id);
      assert.strictEqual(habit.userId, user1Id);
      assert.strictEqual(habit.name, "Morning Meditation");
      habit1Id = habit.id;
    });

    it("prevents User 2 from reading User 1's habit (IDOR check)", async () => {
      const habitForUser2 = await HabitService.getHabitById(user2Id, habit1Id);
      assert.strictEqual(habitForUser2, null);
    });

    it("prevents User 2 from updating User 1's habit", async () => {
      const updateResult = await HabitService.updateHabit(user2Id, habit1Id, {
        name: "Hacked Habit Name",
      });
      assert.strictEqual(updateResult, null);

      // Verify name remained unchanged
      const habit = await HabitService.getHabitById(user1Id, habit1Id);
      assert.strictEqual(habit?.name, "Morning Meditation");
    });

    it("prevents User 2 from deleting User 1's habit", async () => {
      const deleteResult = await HabitService.deleteHabit(user2Id, habit1Id);
      assert.strictEqual(deleteResult, false);

      // Verify habit still exists for User 1
      const habit = await HabitService.getHabitById(user1Id, habit1Id);
      assert.ok(habit);
    });

    it("allows User 1 to update their own habit", async () => {
      const updated = await HabitService.updateHabit(user1Id, habit1Id, {
        name: "Morning Mindfulness Meditation",
      });
      assert.ok(updated);
      assert.strictEqual(updated.name, "Morning Mindfulness Meditation");
    });
  });

  describe("Completion Tracking & Idempotency", () => {
    const todayStr = "2026-11-03";

    it("prevents User 2 from completing User 1's habit", async () => {
      await assert.rejects(
        async () => {
          await TrackingService.toggleCompletion(user2Id, habit1Id, todayStr);
        },
        {
          name: "Error",
          message: "HABIT_NOT_FOUND",
        }
      );
    });

    it("toggles completion ON for User 1's habit", async () => {
      const result = await TrackingService.toggleCompletion(user1Id, habit1Id, todayStr);
      assert.strictEqual(result.completed, true);
      assert.ok(result.completion);
      assert.strictEqual(result.completion.completionDate, todayStr);

      // Verify record in database
      const dbCompletion = await prisma.habitCompletion.findUnique({
        where: {
          unique_habit_daily_completion: {
            habitId: habit1Id,
            completionDate: todayStr,
          },
        },
      });
      assert.ok(dbCompletion);
    });

    it("enforces database unique constraint on duplicate insertion", async () => {
      // Attempting a direct raw duplicate insert must fail on database unique constraint
      await assert.rejects(
        async () => {
          await prisma.habitCompletion.create({
            data: {
              habitId: habit1Id,
              userId: user1Id,
              completionDate: todayStr,
            },
          });
        },
        (err: Error) => {
          return err.message.includes("Unique constraint failed");
        }
      );
    });

    it("toggles completion OFF when toggled again", async () => {
      const result = await TrackingService.toggleCompletion(user1Id, habit1Id, todayStr);
      assert.strictEqual(result.completed, false);
      assert.strictEqual(result.completion, null);

      // Verify deletion in database
      const dbCompletion = await prisma.habitCompletion.findUnique({
        where: {
          unique_habit_daily_completion: {
            habitId: habit1Id,
            completionDate: todayStr,
          },
        },
      });
      assert.strictEqual(dbCompletion, null);
    });
  });

  describe("Statistics Aggregation", () => {
    it("aggregates statistics accurately for the authenticated user", async () => {
      // Toggle ON again for stats
      await TrackingService.toggleCompletion(user1Id, habit1Id, "2026-11-03");

      const stats = await StatisticsService.getUserStatistics(user1Id, 7);
      assert.strictEqual(stats.totalActiveHabits, 1);
      assert.strictEqual(stats.totalAllTimeCompletions, 1);
      assert.ok(stats.dailyBreakdown.length === 7);

      // User 2 has 0 habits and 0 completions
      const statsUser2 = await StatisticsService.getUserStatistics(user2Id, 7);
      assert.strictEqual(statsUser2.totalActiveHabits, 0);
      assert.strictEqual(statsUser2.totalAllTimeCompletions, 0);
    });
  });
});

