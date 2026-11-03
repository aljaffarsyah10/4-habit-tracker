"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface DailyItem {
  date: string;
  totalScheduled: number;
  totalCompleted: number;
  completionRate: number;
}

interface CalendarHeatmapProps {
  days: DailyItem[];
}

export function CalendarHeatmap({ days }: CalendarHeatmapProps) {
  const [selectedDay, setSelectedDay] = useState<DailyItem | null>(null);

  const getColorClass = (item: DailyItem) => {
    if (item.totalScheduled === 0) return "bg-muted/30 border-dashed border-border/40";
    if (item.completionRate === 0) return "bg-muted border-border";
    if (item.completionRate < 50) return "bg-emerald-500/25 border-emerald-500/30 text-emerald-800 dark:text-emerald-200";
    if (item.completionRate < 100) return "bg-emerald-500/60 border-emerald-500/70 text-emerald-950 dark:text-white";
    return "bg-emerald-500 border-emerald-600 text-white font-semibold";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <CardTitle className="text-base">30-Day Activity Calendar</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Visual consistency map of your daily habit achievements over the past month.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Days Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {days.map((item) => {
            const dayNum = item.date.split("-")[2];
            const isSelected = selectedDay?.date === item.date;

            return (
              <button
                key={item.date}
                type="button"
                onClick={() => setSelectedDay(item)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all ${getColorClass(
                  item
                )} ${
                  isSelected ? "ring-2 ring-primary ring-offset-2 scale-105" : "hover:opacity-85"
                }`}
                title={`${item.date}: ${item.totalCompleted}/${item.totalScheduled} habits completed (${item.completionRate}%)`}
              >
                <span className="font-mono text-xs">{dayNum}</span>
                <span className="text-[10px] mt-0.5 opacity-80">
                  {item.totalScheduled > 0 ? `${item.completionRate}%` : "—"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Details Card */}
        {selectedDay && (
          <div className="rounded-lg bg-secondary/60 p-3 text-xs flex items-center justify-between animate-in fade-in-50">
            <div>
              <span className="font-semibold text-foreground">Date: {selectedDay.date}</span>
              <p className="text-muted-foreground mt-0.5">
                {selectedDay.totalScheduled > 0
                  ? `Completed ${selectedDay.totalCompleted} of ${selectedDay.totalScheduled} scheduled habits`
                  : "No habits were scheduled on this day"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-primary">
                {selectedDay.totalScheduled > 0 ? `${selectedDay.completionRate}%` : "0%"}
              </span>
              <p className="text-[10px] text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        )}

        {/* Heatmap Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
          <span>Less Active</span>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded bg-muted/40 border border-border" title="0% / No activity" />
            <div className="size-3 rounded bg-emerald-500/25 border border-emerald-500/30" title="1-49%" />
            <div className="size-3 rounded bg-emerald-500/60 border border-emerald-500/70" title="50-99%" />
            <div className="size-3 rounded bg-emerald-500 border border-emerald-600" title="100%" />
          </div>
          <span>Fully Completed (100%)</span>
        </div>
      </CardContent>
    </Card>
  );
}
