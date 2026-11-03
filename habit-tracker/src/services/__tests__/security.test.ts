import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../../lib/db/prisma";
import { AuthService } from "../auth.service";
import { HabitService } from "../habit.service";
import { TrackingService } from "../tracking.service";
import { verifySessionToken } from "../../lib/auth/jwt";

describe("Phase 9 — Security Audit & Penetration Hardening", () => {
  const aliceEmail = `alice_${Date.now()}@example.com`;
  const bobEmail = `bob_${Date.now()}@example.com`;
  let aliceId: string;
  let bobId: string;
  let aliceHabitId: string;
  let aliceToken: string;

  before(async () => {
    await prisma.$connect();
    // Register Alice
    const alice = await AuthService.registerUser({
      name: "Alice Security",
      email: aliceEmail,
      password: "aliceSuperPassword123!",
    });
    aliceId = alice.user.id;
    aliceToken = alice.token;

    // Register Bob
    const bob = await AuthService.registerUser({
      name: "Bob Security",
      email: bobEmail,
      password: "bobSuperPassword123!",
    });
    bobId = bob.user.id;

    // Alice creates a private habit
    const habit = await HabitService.createHabit(aliceId, {
      name: "Alice Confidential Habit",
      frequency: "DAILY",
      scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      color: "#3b82f6",
    });
    aliceHabitId = habit.id;
  });

  after(async () => {
    if (aliceId || bobId) {
      await prisma.user.deleteMany({
        where: { id: { in: [aliceId, bobId].filter(Boolean) } },
      });
    }
    await prisma.$disconnect();
  });

  describe("IDOR (Insecure Direct Object Reference) Protection", () => {
    it("prevents Bob from fetching Alice's habit details", async () => {
      const habit = await HabitService.getHabitById(bobId, aliceHabitId);
      assert.strictEqual(habit, null);
    });

    it("prevents Bob from modifying Alice's habit", async () => {
      const updated = await HabitService.updateHabit(bobId, aliceHabitId, {
        name: "Tampered by Bob",
      });
      assert.strictEqual(updated, null);

      // Verify Alice's habit name is untouched
      const original = await HabitService.getHabitById(aliceId, aliceHabitId);
      assert.strictEqual(original?.name, "Alice Confidential Habit");
    });

    it("prevents Bob from deleting Alice's habit", async () => {
      const deleted = await HabitService.deleteHabit(bobId, aliceHabitId);
      assert.strictEqual(deleted, false);

      // Verify Alice's habit still exists
      const original = await HabitService.getHabitById(aliceId, aliceHabitId);
      assert.ok(original);
    });

    it("prevents Bob from toggling completion on Alice's habit", async () => {
      await assert.rejects(
        async () => {
          await TrackingService.toggleCompletion(bobId, aliceHabitId, "2026-11-03");
        },
        {
          name: "Error",
          message: "HABIT_NOT_FOUND",
        }
      );
    });
  });

  describe("Credential & Session Security", () => {
    it("guarantees passwordHash is excluded from safe user representations", async () => {
      const { user } = await AuthService.loginUser({
        email: aliceEmail,
        password: "aliceSuperPassword123!",
      });

      assert.strictEqual((user as unknown as Record<string, unknown>).passwordHash, undefined);
      assert.strictEqual((user as unknown as Record<string, unknown>).password, undefined);
    });

    it("rejects tampered or forged JWT session tokens", async () => {
      const forgedToken = aliceToken + "malicious_tamper";
      const payload = await verifySessionToken(forgedToken);
      assert.strictEqual(payload, null);
    });

    it("handles non-existent or SQL injection attempt IDs gracefully", async () => {
      const sqliId = "' OR '1'='1' --";
      const habit = await HabitService.getHabitById(aliceId, sqliId);
      assert.strictEqual(habit, null);
    });
  });
});
