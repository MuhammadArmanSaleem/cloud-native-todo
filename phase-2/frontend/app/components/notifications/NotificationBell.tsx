"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences";
import { useAuth } from "@/lib/auth";

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { preferences, isLoading } = useNotificationPreferences();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  if (!isAuthenticated || isLoading) {
    return null;
  }

  const hasAnyNotificationsEnabled =
    preferences.taskCompletion || preferences.dueDateReminder;

  const handleBellClick = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleBellClick}
        className={`relative p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
          hasAnyNotificationsEnabled
            ? "text-primary hover:bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
        aria-label="Notification settings"
        aria-expanded={showTooltip}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {hasAnyNotificationsEnabled && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50"
          role="tooltip"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Notification Settings
          </h4>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Task Completion</span>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  preferences.taskCompletion
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {preferences.taskCompletion ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Due Date Reminders</span>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  preferences.dueDateReminder
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {preferences.dueDateReminder ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
          <Link
            href="/profile"
            onClick={() => setShowTooltip(false)}
            className="block w-full text-center px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Manage Settings
          </Link>
        </div>
      )}
    </div>
  );
}


