# Feature: Due Dates & Time Reminders

## User Stories

- As a user, I can set a due date for a task
- As a user, I can set a reminder time for a task
- As a user, I receive browser notifications for reminders
- As a user, I can see overdue tasks highlighted
- As a user, I can see tasks due soon

## Acceptance Criteria

### Due Dates
- Date picker for selecting due date
- Optional field (tasks can have no due date)
- Display due date in task list
- Visual indicator for overdue tasks (red)
- Visual indicator for tasks due soon (yellow/orange)

### Time Reminders
- Time picker for reminder time
- Optional field (tasks can have no reminder)
- Browser notification at reminder time
- Notification permission request
- Reminder stored in database

### Browser Notifications
- Request notification permission on first use
- Show notification at reminder time
- Notification includes task title and due date
- Click notification opens app

### UI/UX
- Date/time pickers in task form
- Due date display in task list
- Overdue/soon indicators
- Reminder settings

## Database Schema

- `due_date`: timestamp (nullable)
- `reminder_time`: timestamp (nullable)

## API Changes

- Include due_date and reminder_time in task creation/update
- Endpoint to check for upcoming reminders
- Background job to send notifications (or frontend polling)

## Technical Implementation

- Browser Notification API
- Service Worker (optional, for background notifications)
- Or: Frontend polling for reminders
- Date/time handling with proper timezone support

