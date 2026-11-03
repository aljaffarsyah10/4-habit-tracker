import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const PRESET_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#f43f5e", "#06b6d4"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function NewHabitPage() {
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

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create New Habit</CardTitle>
          <CardDescription>
            Set up a positive routine you want to track consistently.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name *</Label>
            <Input id="name" placeholder="e.g., Read 15 pages of book" maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" placeholder="e.g., Every morning after coffee" maxLength={500} />
          </div>

          <div className="space-y-2">
            <Label>Schedule & Days</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-secondary/50"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-3 pt-1">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  style={{ backgroundColor: color }}
                  className="size-7 rounded-full transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href="/habits">Cancel</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/habits">Save Habit</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

