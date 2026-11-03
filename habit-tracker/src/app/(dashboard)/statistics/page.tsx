import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, Trophy, TrendingUp, CheckCircle2 } from "lucide-react";

export default function StatisticsPage() {
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
          value="12 Days"
          description="Read 15 Pages of Book"
          icon={<Flame className="size-4 text-amber-500" />}
          trend="+3 days"
        />
        <StatCard
          title="Best Streak"
          value="24 Days"
          description="Morning 20m Workout"
          icon={<Trophy className="size-4 text-primary" />}
        />
        <StatCard
          title="Completion Rate"
          value="78%"
          description="Last 30 days average"
          icon={<TrendingUp className="size-4 text-emerald-500" />}
          trend="+5%"
        />
        <StatCard
          title="Total Completed"
          value="142"
          description="Check-ins recorded"
          icon={<CheckCircle2 className="size-4 text-blue-500" />}
        />
      </div>

      {/* Consistency Heatmap / Summary Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Activity Overview</CardTitle>
          <CardDescription>Visual summary of completed habits across the current week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center py-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
              <div key={day} className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">{day}</span>
                <div
                  className={`h-16 rounded-lg flex flex-col items-center justify-center border ${
                    idx < 2
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : idx === 2
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 font-bold"
                      : "bg-muted/40 border-border text-muted-foreground"
                  }`}
                >
                  <span className="text-xs">{idx <= 2 ? "100%" : "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

