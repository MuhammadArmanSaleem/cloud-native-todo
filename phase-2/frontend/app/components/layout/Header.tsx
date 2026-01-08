"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "@/lib/auth";
import { uiCopy } from "../../content/uiCopy";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import VoiceCommand from "../task/VoiceCommand";
import NotificationBell from "../notifications/NotificationBell";

interface HeaderProps {
  onAddTaskClick?: () => void;
}

export default function Header({ onAddTaskClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { language } = useLanguage();
  const { isAuthenticated, signOut, session } = useAuth();
  const router = useRouter();
  const t = uiCopy[language];

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between gap-4">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-foreground">
              {t.header.appTitle}
            </h1>
          </Link>
        </div>

        {/* Search Input - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder={t.header.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notification Bell - Only show when authenticated */}
          {isAuthenticated && <NotificationBell />}

          {/* Voice Command - Only show when authenticated */}
          {isAuthenticated && <VoiceCommand />}

          {/* Add Task Button - Only show when authenticated */}
          {isAuthenticated && (
            <button
              onClick={onAddTaskClick}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              {t.header.addTask}
            </button>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {session?.user?.name || session?.user?.email || "User"}
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm bg-card border border-border text-foreground rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm bg-card border border-border text-foreground rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

