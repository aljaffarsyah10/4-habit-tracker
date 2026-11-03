"use client";

import { useHabits } from "@/features/habits/context/habit-context";
import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { Flame, Trophy, TrendingUp, CheckCircle2 } from "lucide-react";

export default function StatisticsPage() {
  const { getStatistics } = useHabits();
  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Statistics & Insights</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Measure your consistency and long-term habit progression.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} Days`}
          description="Highest active streak"
          icon={<Flame className="size-4 text-amber-500" />}
        />
        <StatCard
          title="Best Streak"
          value={`${stats.bestStreak} Days`}
          description="All-time personal record"
          icon={<Trophy className="size-4 text-primary" />}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          description="Past 7 days average"
          icon={<TrendingUp className="size-4 text-emerald-500" />}
        />
        <StatCard
          title="Total Check-ins"
          value={stats.totalCompletions}
          description={`Across ${stats.totalHabits} active habits`}
          icon={<CheckCircle2 className="size-4 text-blue-500" />}
        />
      </div>

      {/* Consistency Overview (Past 7 Days) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Past 7 Days Consistency</CardTitle>
          <CardDescription>
            Daily completion rate calculated based on your scheduled habits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {stats.weeklySummary.map((item) => (
              <div
                key={item.date}
                className="p-3 rounded-lg border border-border bg-card/60 flex flex-col items-center justify-between min-h-[90px]"
              >
                <span className="text-xs font-semibold text-muted-foreground">{item.day}</span>
                <span className="text-[11px] text-muted-foreground">{item.date.slice(5)}</span>
                <div className="mt-2 text-center">
                  <span className="text-base font-bold text-foreground">
                    {item.percentage}%
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    {item.completedCount}/{item.totalScheduled}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <ProgressBar
              value={stats.completionRate}
              label="Overall Weekly Performance"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
