// Form validation - following nextjs-frontend skill patterns for client-side validation
import { TaskCreate } from '@/app/types/task';

export interface ValidationErrors {
  title?: string;
  description?: string;
  due_date?: string;
  reminder_time?: string;
  [key: string]: string | undefined;
}

// Sanitize input to prevent XSS
export function sanitizeString(input: string): string {
  let sanitized = input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .trim();
  return sanitized;
}

// Security check for dangerous patterns
export function isSafeInput(input: string): boolean {
  if (/<script/i.test(input)) return false;
  if (/on\w+\s*=/i.test(input)) return false;
  if (/javascript:/i.test(input)) return false;
  if (/data:text\/html/i.test(input)) return false;
  return true;
}

// Validate task data before API call
export function validateTask(data: TaskCreate): ValidationErrors {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required';
  } else {
    const sanitized = sanitizeString(data.title);
    if (!isSafeInput(sanitized)) {
      errors.title = 'Invalid characters detected';
    } else if (sanitized.length < 1) {
      errors.title = 'Title cannot be empty';
    } else if (sanitized.length > 200) {
      errors.title = 'Title must be 200 characters or less';
    }
  }

  // Description validation
  if (data.description) {
    const sanitized = sanitizeString(data.description);
    if (!isSafeInput(sanitized)) {
      errors.description = 'Invalid characters detected';
    } else if (sanitized.length > 1000) {
      errors.description = 'Description must be 1000 characters or less';
    }
  }

  // Due date validation
  if (data.due_date) {
    const dueDate = new Date(data.due_date);
    if (isNaN(dueDate.getTime())) {
      errors.due_date = 'Invalid date format';
    }
  }

  // Reminder time validation
  if (data.reminder_time) {
    const reminderTime = new Date(data.reminder_time);
    if (isNaN(reminderTime.getTime())) {
      errors.reminder_time = 'Invalid time format';
    } else if (data.due_date) {
      const dueDate = new Date(data.due_date);
      if (reminderTime > dueDate) {
        errors.reminder_time = 'Reminder time must be before due date';
      }
    }
  }

  return errors;
}

