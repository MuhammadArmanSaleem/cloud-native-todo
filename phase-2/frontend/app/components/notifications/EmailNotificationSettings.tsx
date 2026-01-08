"use client";

import { useState } from "react";
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences";
import Toast from "../ui/Toast";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

export default function EmailNotificationSettings() {
  const { language } = useLanguage();
  const t = uiCopy[language];
  const { preferences, updatePreference, isLoading } = useNotificationPreferences();
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const handleToggle = async (key: "taskCompletion" | "dueDateReminder", value: boolean) => {
    setIsSaving(true);
    try {
      const success = updatePreference(key, value);
      if (success) {
        setToast({
          message: t.notifications.preferencesSaved,
          type: "success",
          isVisible: true,
        });
      } else {
        setToast({
          message: t.notifications.saveError,
          type: "error",
          isVisible: true,
        });
      }
    } catch (error) {
      setToast({
        message: t.notifications.saveError,
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg">
        <p className="text-sm text-muted-foreground">Loading notification settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Email Notification Settings
        </h3>

        <div className="space-y-4">
          {/* Task Completion Notifications */}
          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-md">
            <div className="flex-1">
              <label
                htmlFor="task-completion"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Task Completion Notifications
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive email when tasks are marked as complete
              </p>
            </div>
            <div className="ml-4">
              <button
                type="button"
                id="task-completion"
                onClick={() => handleToggle("taskCompletion", !preferences.taskCompletion)}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${
                  preferences.taskCompletion ? "bg-primary" : "bg-muted"
                }`}
                role="switch"
                aria-checked={preferences.taskCompletion}
                aria-label="Toggle task completion notifications"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.taskCompletion ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Due Date Reminder Notifications */}
          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-md">
            <div className="flex-1">
              <label
                htmlFor="due-date-reminder"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Due Date Reminder Notifications
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive email reminders before tasks are due
              </p>
            </div>
            <div className="ml-4">
              <button
                type="button"
                id="due-date-reminder"
                onClick={() => handleToggle("dueDateReminder", !preferences.dueDateReminder)}
                disabled={isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${
                  preferences.dueDateReminder ? "bg-primary" : "bg-muted"
                }`}
                role="switch"
                aria-checked={preferences.dueDateReminder}
                aria-label="Toggle due date reminder notifications"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.dueDateReminder ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}

