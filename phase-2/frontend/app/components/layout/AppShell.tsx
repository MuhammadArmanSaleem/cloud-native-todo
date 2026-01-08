"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

interface AppShellProps {
  children: ReactNode;
  onAddTaskClick?: () => void;
}

export default function AppShell({
  children,
  onAddTaskClick,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onAddTaskClick={onAddTaskClick} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 container-custom py-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

