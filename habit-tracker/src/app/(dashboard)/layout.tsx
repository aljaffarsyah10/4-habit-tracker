import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { HabitProvider } from "@/features/habits/context/habit-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <HabitProvider>
      <AppShell>{children}</AppShell>
    </HabitProvider>
  );
}
