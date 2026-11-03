import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Settings,
  PlusCircle,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export const MAIN_NAVIGATION: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Habits",
    href: "/habits",
    icon: CheckSquare,
  },
  {
    name: "Statistics",
    href: "/statistics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const QUICK_ACTIONS = [
  {
    name: "New Habit",
    href: "/habits/new",
    icon: PlusCircle,
  },
];

