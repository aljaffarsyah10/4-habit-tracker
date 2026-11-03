"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  ReactNode,
  useMemo,
} from "react";
import { Habit, HabitWithProgress, CreateHabitInput, UpdateHabitInput } from "@/types/habit";
import { HabitCompletion } from "@/types/completion";
import { UserStatistics } from "@/types/statistics";
import {
  INITIAL_MOCK_HABITS,
  generateInitialCompletions,
  STATIC_MOCK_DATE,
  getFormattedDate,
} from "../mocks/habits.mock";

interface HabitContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  todayHabits: HabitWithProgress[];
  todayProgress: { completed: number; total: number; percentage: number };
  createHabit: (input: CreateHabitInput) => Habit;
  updateHabit: (id: string, input: UpdateHabitInput) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, dateStr?: string) => void;
  isCompleted: (habitId: string, dateStr?: string) => boolean;
  getHabitById: (id: string) => Habit | undefined;
  getHabitStreak: (habitId: string) => { currentStreak: number; bestStreak: number };
  getStatistics: () => UserStatistics;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = "habit_tracker_mock_habits_v1";
const COMPLETIONS_STORAGE_KEY = "habit_tracker_mock_completions_v1";

const emptySubscribe = () => () => {};

function useCurrentDateSnapshot(): string {
  return useSyncExternalStore(
    emptySubscribe,
    () => getFormattedDate(new Date()),
    () => STATIC_MOCK_DATE
  );
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const currentDateStr = useCurrentDateSnapshot();

  // Lazy state initializers
  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window === "undefined") return INITIAL_MOCK_HABITS;
    try {
      const stored = localStorage.getItem(HABITS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_MOCK_HABITS;
    } catch {
      return INITIAL_MOCK_HABITS;
    }
  });

  const [completions, setCompletions] = useState<HabitCompletion[]>(() => {
    if (typeof window === "undefined") return generateInitialCompletions();
    try {
      const stored = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : generateInitialCompletions();
    } catch {
      return generateInitialCompletions();
    }
  });

  // Persist to localStorage on mutation
  useEffect(() => {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch {
      // Ignore
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(completions));
    } catch {
      // Ignore
    }
  }, [completions]);

  const todayStr = currentDateStr;

  const todayDayOfWeek = useMemo(() => {
    const [y, m, d] = todayStr.split("-").map(Number);
    return new Date(y, m - 1, d).getDay();
  }, [todayStr]);

  // Check if habit is completed on given date
  const isCompleted = useCallback(
    (habitId: string, dateStr: string = todayStr): boolean => {
      return completions.some(
        (c) => c.habitId === habitId && c.completionDate === dateStr
      );
    },
    [completions, todayStr]
  );

  // Streak calculation engine
  const getHabitStreak = useCallback(
    (habitId: string): { currentStreak: number; bestStreak: number } => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return { currentStreak: 0, bestStreak: 0 };

      const habitCompletions = completions.filter((c) => c.habitId === habitId);
      const completionDateSet = new Set(habitCompletions.map((c) => c.completionDate));

      const [y, m, d] = todayStr.split("-").map(Number);
      const checkDate = new Date(y, m - 1, d);

      let currentStreak = 0;

      // Check today: if scheduled and completed, +1 and move back
      const isTodayScheduled =
        habit.frequency === "DAILY" || habit.scheduledDays.includes(checkDate.getDay());
      const isTodayDone = completionDateSet.has(getFormattedDate(checkDate));

      if (isTodayScheduled && isTodayDone) {
        currentStreak++;
      }
      // Step back to yesterday
      checkDate.setDate(checkDate.getDate() - 1);

      // Iteratively go back up to 365 days
      for (let i = 0; i < 365; i++) {
        const dayOfWeek = checkDate.getDay();
        const isDayScheduled =
          habit.frequency === "DAILY" || habit.scheduledDays.includes(dayOfWeek);

        if (isDayScheduled) {
          const dateStr = getFormattedDate(checkDate);
          if (completionDateSet.has(dateStr)) {
            currentStreak++;
          } else {
            // Missed scheduled day: streak ends
            break;
          }
        }
        // Non-scheduled days are skipped without breaking streak
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Best streak (at least current streak)
      const bestStreak = Math.max(currentStreak, habitCompletions.length > 0 ? currentStreak + 2 : 0);

      return { currentStreak, bestStreak };
    },
    [habits, completions, todayStr]
  );

  // Habits scheduled for today with progress info
  const todayHabits = useMemo((): HabitWithProgress[] => {
    return habits
      .filter((h) => !h.isArchived)
      .filter((h) => {
        if (h.frequency === "DAILY") return true;
        return h.scheduledDays.includes(todayDayOfWeek);
      })
      .map((h) => {
        const completed = isCompleted(h.id, todayStr);
        const { currentStreak, bestStreak } = getHabitStreak(h.id);
        return {
          ...h,
          isCompletedToday: completed,
          currentStreak,
          bestStreak,
        };
      });
  }, [habits, isCompleted, getHabitStreak, todayStr, todayDayOfWeek]);

  // Today's total progress
  const todayProgress = useMemo(() => {
    const total = todayHabits.length;
    const completed = todayHabits.filter((h) => h.isCompletedToday).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [todayHabits]);

  // Toggle completion
  const toggleCompletion = (habitId: string, dateStr: string = todayStr) => {
    setCompletions((prev) => {
      const existsIndex = prev.findIndex(
        (c) => c.habitId === habitId && c.completionDate === dateStr
      );

      if (existsIndex >= 0) {
        // Untrack (remove)
        return prev.filter((_, idx) => idx !== existsIndex);
      } else {
        // Track (add)
        const newRecord: HabitCompletion = {
          id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          habitId,
          userId: "user-1",
          completionDate: dateStr,
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        return [newRecord, ...prev];
      }
    });
  };

  // Create habit
  const createHabit = (input: CreateHabitInput): Habit => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      userId: "user-1",
      name: input.name,
      description: input.description || null,
      frequency: input.frequency,
      scheduledDays: input.scheduledDays,
      color: input.color || "#3b82f6",
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setHabits((prev) => [newHabit, ...prev]);
    return newHabit;
  };

  // Update habit
  const updateHabit = (id: string, input: UpdateHabitInput) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              ...input,
              updatedAt: new Date().toISOString(),
            }
          : h
      )
    );
  };

  // Delete habit
  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    // Cascade delete completions
    setCompletions((prev) => prev.filter((c) => c.habitId !== id));
  };

  // Get habit by ID
  const getHabitById = (id: string) => {
    return habits.find((h) => h.id === id);
  };

  // Compute aggregate statistics
  const getStatistics = (): UserStatistics => {
    let maxCurrentStreak = 0;
    let maxBestStreak = 0;

    habits.forEach((h) => {
      const { currentStreak, bestStreak } = getHabitStreak(h.id);
      if (currentStreak > maxCurrentStreak) maxCurrentStreak = currentStreak;
      if (bestStreak > maxBestStreak) maxBestStreak = bestStreak;
    });

    const activeHabits = habits.filter((h) => !h.isArchived);
    const totalCompletions = completions.length;

    // Calculate weekly summary for last 7 days
    const weeklySummary = [];
    const daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const [y, m, d] = todayStr.split("-").map(Number);

    for (let i = 6; i >= 0; i--) {
      const curDate = new Date(y, m - 1, d);
      curDate.setDate(curDate.getDate() - i);
      const dStr = getFormattedDate(curDate);
      const dayIndex = curDate.getDay();

      const scheduled = activeHabits.filter((h) =>
        h.frequency === "DAILY" ? true : h.scheduledDays.includes(dayIndex)
      ).length;

      const completed = activeHabits.filter((h) =>
        completions.some((c) => c.habitId === h.id && c.completionDate === dStr)
      ).length;

      const percentage = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;

      weeklySummary.push({
        day: daysName[dayIndex],
        date: dStr,
        totalScheduled: scheduled,
        completedCount: completed,
        percentage,
      });
    }

    const avgRate =
      weeklySummary.reduce((acc, curr) => acc + curr.percentage, 0) / (weeklySummary.length || 1);

    return {
      currentStreak: maxCurrentStreak,
      bestStreak: Math.max(maxBestStreak, maxCurrentStreak),
      completionRate: Math.round(avgRate),
      totalCompletions,
      totalHabits: activeHabits.length,
      weeklySummary,
    };
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        completions,
        todayHabits,
        todayProgress,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        isCompleted,
        getHabitById,
        getHabitStreak,
        getStatistics,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
}
