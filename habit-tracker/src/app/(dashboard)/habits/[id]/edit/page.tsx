import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2 } from "lucide-react";

export function generateStaticParams() {
  return [{ id: "h-1" }, { id: "h-2" }];
}

interface EditHabitProps {
  params: Promise<{ id: string }>;
}

async function EditFormContent({ params }: EditHabitProps) {
  const { id } = await params;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl">Edit Habit</CardTitle>
          <CardDescription>Update your habit schedule and details (ID: {id}).</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 gap-1 text-xs">
          <Trash2 className="size-3.5" />
          <span>Delete</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Habit Name *</Label>
          <Input id="name" defaultValue="Morning 20m Workout" maxLength={100} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            defaultValue="Strength training or cardio exercises"
            maxLength={500}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button asChild variant="outline" size="sm">
            <Link href="/habits">Cancel</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/habits">Update Habit</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EditHabitPage({ params }: EditHabitProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs">
          <Link href="/habits">
            <ArrowLeft className="size-4" />
            <span>Back to Habits</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Card className="p-8"><div className="h-40 animate-pulse bg-muted rounded-lg" /></Card>}>
        <EditFormContent params={params} />
      </Suspense>
    </div>
  );
}
