# Feature: Recurring Tasks

## User Stories

- As a user, I can create a recurring task (e.g., "weekly meeting")
- As a user, I can set recurrence pattern (daily, weekly, monthly)
- As a user, recurring tasks auto-reschedule after completion
- As a user, I can see which tasks are recurring
- As a user, I can stop recurrence for a task

## Acceptance Criteria

### Recurrence Patterns
- Daily: Task repeats every day
- Weekly: Task repeats every week on same day
- Monthly: Task repeats every month on same date
- Pattern stored in task record

### Auto-Rescheduling
- When recurring task is marked complete
- New task instance created with next occurrence date
- Original task remains (for history)
- Or: Original task updated with new due date

### UI/UX
- Recurrence selector in task form
- Visual indicator for recurring tasks
- Show next occurrence date
- Option to stop recurrence

### Edge Cases
- Handle month-end dates (e.g., Jan 31 → Feb 28)
- Handle leap years
- Handle timezone considerations
- Handle skipped occurrences

## Database Schema

- `recurring_pattern`: string (enum: "daily", "weekly", "monthly", nullable)
- `next_occurrence`: timestamp (nullable)
- `original_task_id`: integer (nullable, for tracking series)

## API Changes

- Include recurring fields in task creation/update
- Endpoint to stop recurrence
- Logic to create next occurrence

