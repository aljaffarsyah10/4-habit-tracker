import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { registerSchema, loginSchema } from "../../features/auth/schemas";
import { habitFormSchema, updateHabitSchema } from "../../features/habits/schemas";

describe("Phase 9 — Input Validation & Schema Hardening", () => {
  describe("Authentication Schemas", () => {
    it("validates correct registration inputs", () => {
      const valid = registerSchema.safeParse({
        name: "Ahmad Dahlan",
        email: "ahmad@example.com",
        password: "securePassword123!",
      });
      assert.strictEqual(valid.success, true);
    });

    it("rejects invalid email formats", () => {
      const invalidEmails = ["notanemail", "missing@domain", "@nodomain.com", "spaces in@email.com"];
      for (const email of invalidEmails) {
        const result = registerSchema.safeParse({
          email,
          password: "validPassword123!",
        });
        assert.strictEqual(result.success, false, `Expected ${email} to be invalid`);
      }
    });

    it("rejects passwords under 6 characters", () => {
      const result = registerSchema.safeParse({
        email: "test@example.com",
        password: "12345",
      });
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.flatten().fieldErrors.password);
      }
    });

    it("trims and sanitizes email to lowercase", () => {
      const result = registerSchema.safeParse({
        email: "  USER@EXAMPLE.COM  ",
        password: "securePassword123!",
      });
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.email, "user@example.com");
      }
    });

    it("validates login schema properly", () => {
      const valid = loginSchema.safeParse({
        email: "user@example.com",
        password: "anyPassword",
      });
      assert.strictEqual(valid.success, true);

      const empty = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      assert.strictEqual(empty.success, false);
    });
  });

  describe("Habit Schemas", () => {
    it("validates valid daily habit inputs", () => {
      const valid = habitFormSchema.safeParse({
        name: "Morning Jogging",
        description: "Run 3km every morning",
        frequency: "DAILY",
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        color: "#10b981",
      });
      assert.strictEqual(valid.success, true);
    });

    it("rejects empty or whitespace-only habit names", () => {
      const empty = habitFormSchema.safeParse({
        name: "   ",
        frequency: "DAILY",
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      });
      assert.strictEqual(empty.success, false);
    });

    it("rejects habit names exceeding 100 characters", () => {
      const tooLong = habitFormSchema.safeParse({
        name: "A".repeat(101),
        frequency: "DAILY",
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      });
      assert.strictEqual(tooLong.success, false);
    });

    it("rejects empty scheduledDays array", () => {
      const emptyDays = habitFormSchema.safeParse({
        name: "Weekend Habit",
        frequency: "WEEKLY",
        scheduledDays: [],
      });
      assert.strictEqual(emptyDays.success, false);
    });

    it("rejects invalid day numbers (< 0 or > 6)", () => {
      const invalidDays = habitFormSchema.safeParse({
        name: "Invalid Day Habit",
        frequency: "WEEKLY",
        scheduledDays: [7, -1],
      });
      assert.strictEqual(invalidDays.success, false);
    });

    it("validates color hex code formats", () => {
      const validHex = habitFormSchema.safeParse({
        name: "Color Test",
        frequency: "DAILY",
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        color: "#3b82f6",
      });
      assert.strictEqual(validHex.success, true);

      const invalidHex = habitFormSchema.safeParse({
        name: "Color Test",
        frequency: "DAILY",
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
        color: "rgb(255, 0, 0)", // Must be valid Hex
      });
      assert.strictEqual(invalidHex.success, false);
    });

    it("validates partial updates with updateHabitSchema", () => {
      const partial = updateHabitSchema.safeParse({
        isArchived: true,
      });
      assert.strictEqual(partial.success, true);

      const updateName = updateHabitSchema.safeParse({
        name: "Renamed Habit",
      });
      assert.strictEqual(updateName.success, true);
    });
  });
});

