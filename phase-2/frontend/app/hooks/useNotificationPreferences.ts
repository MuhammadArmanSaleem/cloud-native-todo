"use client";

import { useState, useEffect } from "react";
import {
  NotificationPreferences,
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_STORAGE_KEY,
} from "../types/notifications";

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      }
    } catch (error) {
      console.error("Error loading notification preferences:", error);
      // Use defaults if localStorage fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage
  const updatePreferences = (newPreferences: NotificationPreferences) => {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      return true;
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      return false;
    }
  };

  // Update a single preference
  const updatePreference = (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    const updated = { ...preferences, [key]: value };
    return updatePreferences(updated);
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    updatePreference,
  };
}

