import { ReactNode, Suspense } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNavigation } from "./mobile-nav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar with Suspense */}
      <Suspense fallback={<div className="hidden lg:flex w-64 border-r border-border bg-card h-screen" />}>
        <Sidebar />
      </Suspense>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation with Suspense */}
      <Suspense fallback={null}>
        <MobileNavigation />
      </Suspense>
    </div>
  );
}
