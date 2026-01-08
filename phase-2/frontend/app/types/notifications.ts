export interface NotificationPreferences {
  taskCompletion: boolean;
  dueDateReminder: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  taskCompletion: true,
  dueDateReminder: true,
};

export const NOTIFICATION_STORAGE_KEY = "task_notification_preferences";


