import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { StreakService } from "../streak.service";

describe("StreakService", () => {
  describe("calculateCurrentStreak", () => {
    it("returns 0 for empty completions", () => {
      const streak = StreakService.calculateCurrentStreak([0, 1, 2, 3, 4, 5, 6], [], "2026-11-03");
      assert.strictEqual(streak, 0);
    });

    it("calculates current streak when completed today and past consecutive days", () => {
      const scheduled = [0, 1, 2, 3, 4, 5, 6];
      const completions = [
        { completionDate: "2026-11-03" }, // Today
        { completionDate: "2026-11-02" }, // Yesterday
        { completionDate: "2026-11-01" }, // 2 days ago
      ];

      const streak = StreakService.calculateCurrentStreak(scheduled, completions, "2026-11-03");
      assert.strictEqual(streak, 3);
    });

    it("does NOT break streak prematurely if today is not completed yet (FR-10)", () => {
      const scheduled = [0, 1, 2, 3, 4, 5, 6];
      // Today is 2026-11-03. Completed yesterday and day before, but not today.
      const completions = [
        { completionDate: "2026-11-02" },
        { completionDate: "2026-11-01" },
      ];

      const streak = StreakService.calculateCurrentStreak(scheduled, completions, "2026-11-03");
      assert.strictEqual(streak, 2);
    });

    it("breaks streak if yesterday was scheduled but missed", () => {
      const scheduled = [0, 1, 2, 3, 4, 5, 6];
      // Today is 2026-11-03 (Tue). Yesterday 2026-11-02 (Mon) is missed.
      const completions = [
        { completionDate: "2026-11-01" },
      ];

      const streak = StreakService.calculateCurrentStreak(scheduled, completions, "2026-11-03");
      assert.strictEqual(streak, 0);
    });

    it("ignores non-scheduled days and maintains streak across weekends (FR-10)", () => {
      // 2026-11-09 is Monday (day 1)
      // 2026-11-08 is Sunday (day 0) - NOT SCHEDULED
      // 2026-11-07 is Saturday (day 6) - NOT SCHEDULED
      // 2026-11-06 is Friday (day 5) - SCHEDULED
      // 2026-11-05 is Thursday (day 4) - SCHEDULED
      // 2026-11-04 is Wednesday (day 3) - SCHEDULED
      const weekdaysOnly = [1, 2, 3, 4, 5]; // Mon to Fri
      const completions = [
        { completionDate: "2026-11-06" }, // Friday
        { completionDate: "2026-11-05" }, // Thursday
        { completionDate: "2026-11-04" }, // Wednesday
      ];

      // Checking on Monday 2026-11-09 before Monday completion:
      const streakOnMondayBeforeDone = StreakService.calculateCurrentStreak(
        weekdaysOnly,
        completions,
        "2026-11-09"
      );
      assert.strictEqual(streakOnMondayBeforeDone, 3);

      // Checking on Monday 2026-11-09 after Monday completion:
      const completionsWithMonday = [
        { completionDate: "2026-11-09" },
        ...completions,
      ];
      const streakOnMondayAfterDone = StreakService.calculateCurrentStreak(
        weekdaysOnly,
        completionsWithMonday,
        "2026-11-09"
      );
      assert.strictEqual(streakOnMondayAfterDone, 4);
    });

    it("handles bi-weekly habits like Tue/Thu correctly", () => {
      // 2026-11-03 is Tuesday (day 2)
      // 2026-10-29 is Thursday (day 4)
      // 2026-10-27 is Tuesday (day 2)
      const tueThu = [2, 4];
      const completions = [
        { completionDate: "2026-11-03" }, // Tue
        { completionDate: "2026-10-29" }, // Thu
        { completionDate: "2026-10-27" }, // Tue
      ];

      const streak = StreakService.calculateCurrentStreak(tueThu, completions, "2026-11-03");
      assert.strictEqual(streak, 3);
    });
  });

  describe("calculateBestStreak", () => {
    it("returns 0 for empty completions", () => {
      const best = StreakService.calculateBestStreak([0, 1, 2, 3, 4, 5, 6], []);
      assert.strictEqual(best, 0);
    });

    it("tracks the longest streak across multiple historical runs", () => {
      const scheduled = [0, 1, 2, 3, 4, 5, 6];
      const completions = [
        // Run 1: 3 days
        { completionDate: "2026-10-01" },
        { completionDate: "2026-10-02" },
        { completionDate: "2026-10-03" },
        // Gap on 2026-10-04, 2026-10-05
        // Run 2: 5 days (best)
        { completionDate: "2026-10-06" },
        { completionDate: "2026-10-07" },
        { completionDate: "2026-10-08" },
        { completionDate: "2026-10-09" },
        { completionDate: "2026-10-10" },
        // Gap on 2026-10-11
        // Run 3: 2 days
        { completionDate: "2026-10-12" },
        { completionDate: "2026-10-13" },
      ];

      const best = StreakService.calculateBestStreak(scheduled, completions, "2026-10-20");
      assert.strictEqual(best, 5);
    });

    it("calculates best streak respecting scheduled days filter", () => {
      // Mon to Fri (weekdays)
      // 2026-11-02 (Mon) to 2026-11-06 (Fri) = 5 consecutive scheduled days
      // 2026-11-07 (Sat), 2026-11-08 (Sun) = skipped
      // 2026-11-09 (Mon) to 2026-11-10 (Tue) = 2 more consecutive scheduled days
      // Total unbroken weekday streak = 7!
      const weekdays = [1, 2, 3, 4, 5];
      const completions = [
        { completionDate: "2026-11-02" },
        { completionDate: "2026-11-03" },
        { completionDate: "2026-11-04" },
        { completionDate: "2026-11-05" },
        { completionDate: "2026-11-06" },
        // Weekend skipped
        { completionDate: "2026-11-09" },
        { completionDate: "2026-11-10" },
      ];

      const best = StreakService.calculateBestStreak(weekdays, completions, "2026-11-15");
      assert.strictEqual(best, 7);
    });
  });
});

