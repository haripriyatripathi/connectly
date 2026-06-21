import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-[700px] px-3 pb-28 pt-4 sm:px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
