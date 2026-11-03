"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useHabits } from "@/features/habits/context/habit-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StreakBadge } from "@/components/common/streak-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { HabitDeleteDialog } from "@/features/habits/components/habit-delete-dialog";
import { HabitCardSkeleton } from "@/components/feedback/loading-skeleton";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  RefreshCw,
  Archive,
  ArchiveRestore,
  Search,
} from "lucide-react";

const DAYS_MAP: Record<number, string> = {
  0: "Min",
  1: "Sen",
  2: "Sel",
  3: "Rab",
  4: "Kam",
  5: "Jum",
  6: "Sab",
};

export default function HabitsPage() {
  const {
    habits,
    archivedHabits,
    deleteHabit,
    archiveHabit,
    restoreHabit,
    fetchArchivedHabits,
    getHabitStreak,
    isLoading,
    error,
    refreshData,
  } = useHabits();

  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Load archived habits on tab switch
  useEffect(() => {
    if (activeTab === "archived") {
      fetchArchivedHabits();
    }
  }, [activeTab, fetchArchivedHabits]);

  const activeHabits = habits.filter((h) => !h.isArchived);
  const displayedHabits = activeTab === "active" ? activeHabits : archivedHabits;

  const filteredHabits = displayedHabits.filter((habit) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      habit.name.toLowerCase().includes(q) ||
      (habit.description && habit.description.toLowerCase().includes(q))
    );
  });

  const formatSchedule = (frequency: string, scheduledDays: number[]) => {
    if (frequency === "DAILY" || scheduledDays.length === 7) return "Setiap hari";
    return scheduledDays.map((d) => DAYS_MAP[d]).join(", ");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-60 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4">
          <HabitCardSkeleton />
          <HabitCardSkeleton />
          <HabitCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kebiasaan Anda</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola, atur jadwal, dan arsipkan kebiasaan Anda.
          </p>
        </div>
        <Button asChild size="sm" className="gap-1.5 self-start sm:self-auto">
          <Link href="/habits/new">
            <Plus className="size-4" />
            <span>Tambah Kebiasaan</span>
          </Link>
        </Button>
      </div>

      {/* Tabs & Search Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tab Controls */}
        <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "active"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Aktif ({activeHabits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("archived")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "archived"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Diarsipkan ({archivedHabits.length})
          </button>
        </div>

        {/* Real-time Search Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari kebiasaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-9"
          />
        </div>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="flex items-center justify-between rounded-lg bg-destructive/15 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refreshData()}
            className="gap-1.5 border-destructive/30 hover:bg-destructive/10"
          >
            <RefreshCw className="size-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* Habits List */}
      {filteredHabits.length === 0 ? (
        <EmptyState
          title={
            searchQuery
              ? "Tidak ada kebiasaan yang cocok"
              : activeTab === "active"
              ? "Belum ada kebiasaan aktif"
              : "Belum ada kebiasaan yang diarsipkan"
          }
          description={
            searchQuery
              ? `Tidak ditemukan kebiasaan dengan kata kunci "${searchQuery}".`
              : activeTab === "active"
              ? "Mulai rutinitas positif dengan membuat kebiasaan pertama Anda."
              : "Kebiasaan yang Anda arsipkan akan muncul di sini tanpa memutus riwayat masa lalu."
          }
          actionLabel={activeTab === "active" ? "+ Tambah Kebiasaan" : undefined}
          actionHref={activeTab === "active" ? "/habits/new" : undefined}
        />
      ) : (
        <div className="grid gap-4">
          {filteredHabits.map((habit) => {
            const { currentStreak } = getHabitStreak(habit.id);

            return (
              <Card key={habit.id} className="hover:border-primary/40 transition-colors">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className="size-3.5 rounded-full mt-1 sm:mt-0 shrink-0"
                      style={{ backgroundColor: habit.color || "#3b82f6" }}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-foreground">{habit.name}</h3>
                        <StreakBadge streak={currentStreak} />
                      </div>
                      {habit.description && (
                        <p className="text-xs text-muted-foreground">{habit.description}</p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                        <Calendar className="size-3.5" />
                        <span>{formatSchedule(habit.frequency, habit.scheduledDays)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {activeTab === "active" ? (
                      <>
                        <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                          <Link href={`/habits/${habit.id}/edit`}>
                            <Edit2 className="size-3.5" />
                            <span>Edit</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => archiveHabit(habit.id)}
                          title="Arsipkan kebiasaan"
                        >
                          <Archive className="size-3.5" />
                          <span>Arsipkan</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget({ id: habit.id, name: habit.name })}
                          title="Hapus kebiasaan"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Hapus</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs text-primary hover:bg-primary/10"
                          onClick={() => restoreHabit(habit.id)}
                          title="Pulihkan ke daftar aktif"
                        >
                          <ArchiveRestore className="size-3.5" />
                          <span>Pulihkan</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget({ id: habit.id, name: habit.name })}
                          title="Hapus permanen"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Hapus</span>
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <HabitDeleteDialog
          isOpen={true}
          habitName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteHabit(deleteTarget.id)}
        />
      )}
    </div>
  );
}
