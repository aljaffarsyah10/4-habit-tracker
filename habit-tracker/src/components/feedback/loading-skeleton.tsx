import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function HabitCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-6 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress banner skeleton */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>
      </Card>

      {/* Habits list skeleton */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <div className="grid gap-3">
          <HabitCardSkeleton />
          <HabitCardSkeleton />
          <HabitCardSkeleton />
        </div>
      </div>
    </div>
  );
}
