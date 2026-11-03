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
import { useAuth } from "@/features/auth/context/auth-context";

interface ExtendedHabit extends Habit {
  currentStreak?: number;
  bestStreak?: number;
  totalCompletions?: number;
}

interface HabitContextType {
  habits: ExtendedHabit[];
  completions: HabitCompletion[];
  todayHabits: HabitWithProgress[];
  todayProgress: { completed: number; total: number; percentage: number };
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  createHabit: (input: CreateHabitInput) => Promise<Habit>;
  updateHabit: (id: string, input: UpdateHabitInput) => Promise<boolean>;
  deleteHabit: (id: string) => Promise<boolean>;
  toggleCompletion: (habitId: string, dateStr?: string) => Promise<boolean>;
  isCompleted: (habitId: string, dateStr?: string) => boolean;
  getHabitById: (id: string) => ExtendedHabit | undefined;
  getHabitStreak: (habitId: string) => { currentStreak: number; bestStreak: number };
  getStatistics: () => UserStatistics;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const emptySubscribe = () => () => {};

function getFormattedDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function useCurrentDateSnapshot(): string {
  return useSyncExternalStore(
    emptySubscribe,
    () => getFormattedDate(new Date()),
    () => "2026-11-03"
  );
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const currentDateStr = useCurrentDateSnapshot();

  const [habits, setHabits] = useState<ExtendedHabit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const todayStr = currentDateStr;

  const todayDayOfWeek = useMemo(() => {
    const [y, m, d] = todayStr.split("-").map(Number);
    return new Date(y, m - 1, d).getDay();
  }, [todayStr]);

  // Fetch habits and completions from real backend API
  const refreshData = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setCompletions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate 30-day start date for completions
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 35);
      const startDateStr = getFormattedDate(pastDate);

      const [habitsRes, completionsRes] = await Promise.all([
        fetch("/api/habits", { cache: "no-store" }),
        fetch(`/api/completions?startDate=${startDateStr}`, { cache: "no-store" }),
      ]);

      if (!habitsRes.ok || !completionsRes.ok) {
        throw new Error("Gagal mengambil data dari server");
      }

      const habitsData = await habitsRes.json();
      const completionsData = await completionsRes.json();

      if (habitsData.success) {
        setHabits(habitsData.data || []);
      }
      if (completionsData.success) {
        setCompletions(completionsData.data || []);
      }
    } catch (err) {
      console.error("Failed to load habits data:", err);
      setError("Gagal memuat data kebiasaan. Silakan periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Automatically fetch on mount or user session change
  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      if (!user) {
        setHabits([]);
        setCompletions([]);
        setIsLoading(false);
        return;
      }

      try {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 35);
        const startDateStr = getFormattedDate(pastDate);

        const [habitsRes, completionsRes] = await Promise.all([
          fetch("/api/habits", { cache: "no-store" }),
          fetch(`/api/completions?startDate=${startDateStr}`, { cache: "no-store" }),
        ]);

        if (!habitsRes.ok || !completionsRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const habitsData = await habitsRes.json();
        const completionsData = await completionsRes.json();

        if (!ignore) {
          if (habitsData.success) {
            setHabits(habitsData.data || []);
          }
          if (completionsData.success) {
            setCompletions(completionsData.data || []);
          }
        }
      } catch (err) {
        console.error("Failed to load habits data:", err);
        if (!ignore) {
          setError("Gagal memuat data kebiasaan. Silakan periksa koneksi Anda dan coba lagi.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, [user]);

  // Check if habit is completed on given date
  const isCompleted = useCallback(
    (habitId: string, dateStr: string = todayStr): boolean => {
      return completions.some(
        (c) => c.habitId === habitId && c.completionDate === dateStr
      );
    },
    [completions, todayStr]
  );

  // Streak calculation engine using loaded completions
  const getHabitStreak = useCallback(
    (habitId: string): { currentStreak: number; bestStreak: number } => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return { currentStreak: 0, bestStreak: 0 };

      // If backend already provided precalculated streaks, use them as baseline
      const habitCompletions = completions.filter((c) => c.habitId === habitId);
      const completionDateSet = new Set(habitCompletions.map((c) => c.completionDate));

      const [y, m, d] = todayStr.split("-").map(Number);
      const checkDate = new Date(y, m - 1, d);

      let currentStreak = 0;

      // Check today: if scheduled and done, count it
      const isTodayScheduled =
        habit.frequency === "DAILY" || habit.scheduledDays.includes(checkDate.getDay());
      const isTodayDone = completionDateSet.has(getFormattedDate(checkDate));

      if (isTodayScheduled && isTodayDone) {
        currentStreak++;
      }

      // Check yesterday and past days
      checkDate.setDate(checkDate.getDate() - 1);

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
        checkDate.setDate(checkDate.getDate() - 1);
      }

      const bestStreak = Math.max(
        habit.bestStreak ?? 0,
        currentStreak,
        habitCompletions.length > 0 ? currentStreak : 0
      );

      return { currentStreak, bestStreak };
    },
    [habits, completions, todayStr]
  );

  // Today's scheduled habits with progress
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

  // Today's progress calculation
  const todayProgress = useMemo(() => {
    const total = todayHabits.length;
    const completed = todayHabits.filter((h) => h.isCompletedToday).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [todayHabits]);

  // Optimistic toggle completion mutation
  const toggleCompletion = async (habitId: string, dateStr: string = todayStr): Promise<boolean> => {
    const previousCompletions = [...completions];
    const exists = completions.some(
      (c) => c.habitId === habitId && c.completionDate === dateStr
    );

    // 1. Optimistic update
    if (exists) {
      setCompletions((prev) =>
        prev.filter((c) => !(c.habitId === habitId && c.completionDate === dateStr))
      );
    } else {
      const optimisticRecord: HabitCompletion = {
        id: `temp-${Date.now()}`,
        habitId,
        userId: user?.id || "user",
        completionDate: dateStr,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setCompletions((prev) => [optimisticRecord, ...prev]);
    }

    // 2. Persist to real backend API
    try {
      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          completionDate: dateStr,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Gagal memperbarui status kebiasaan");
      }

      // If backend returned actual created completion, swap out optimistic record
      if (data.data?.completed && data.data?.completion) {
        setCompletions((prev) =>
          prev.map((c) =>
            c.id.startsWith("temp-") && c.habitId === habitId ? data.data.completion : c
          )
        );
      }

      return true;
    } catch (err) {
      console.error("Toggle completion error, rolling back:", err);
      // Rollback on failure
      setCompletions(previousCompletions);
      alert("Gagal memperbarui kebiasaan. Perubahan telah dibatalkan.");
      return false;
    }
  };

  // Create habit
  const createHabit = async (input: CreateHabitInput): Promise<Habit> => {
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data?.error?.message || "Gagal membuat kebiasaan baru");
    }

    const created: ExtendedHabit = data.data;
    setHabits((prev) => [created, ...prev]);
    return created;
  };

  // Update habit
  const updateHabit = async (id: string, input: UpdateHabitInput): Promise<boolean> => {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Gagal memperbarui kebiasaan");
      }

      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...data.data } : h))
      );
      return true;
    } catch (err) {
      console.error("Update habit error:", err);
      return false;
    }
  };

  // Delete habit
  const deleteHabit = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Gagal menghapus kebiasaan");
      }

      setHabits((prev) => prev.filter((h) => h.id !== id));
      setCompletions((prev) => prev.filter((c) => c.habitId !== id));
      return true;
    } catch (err) {
      console.error("Delete habit error:", err);
      return false;
    }
  };

  // Get habit by ID
  const getHabitById = (id: string) => {
    return habits.find((h) => h.id === id);
  };

  // Calculate statistics from actual database data
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

    // Last 7 days breakdown
    const weeklySummary = [];
    const daysName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

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

    const scheduledDaysCount = weeklySummary.filter((d) => d.totalScheduled > 0);
    const avgRate =
      scheduledDaysCount.length > 0
        ? Math.round(
            scheduledDaysCount.reduce((acc, curr) => acc + curr.percentage, 0) /
              scheduledDaysCount.length
          )
        : 0;

    return {
      currentStreak: maxCurrentStreak,
      bestStreak: Math.max(maxBestStreak, maxCurrentStreak),
      completionRate: avgRate,
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
        isLoading,
        error,
        refreshData,
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
