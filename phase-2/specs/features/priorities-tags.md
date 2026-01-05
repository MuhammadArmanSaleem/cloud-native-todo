# Feature: Priorities & Tags/Categories

## User Stories

- As a user, I can assign priority levels to tasks (high/medium/low)
- As a user, I can add tags/categories to tasks (e.g., "work", "home", "personal")
- As a user, I can filter tasks by priority
- As a user, I can filter tasks by tags
- As a user, I can see visual indicators for priorities

## Acceptance Criteria

### Priorities
- Three priority levels: high, medium, low
- Priority is optional (default: medium)
- Visual indicators (colors/icons) for each priority
- Can filter and sort by priority

### Tags/Categories
- Multiple tags per task (array of strings)
- Tags are user-defined (no predefined list)
- Tags are case-insensitive
- Can filter tasks by one or more tags
- Tag suggestions based on existing tags

### UI/UX
- Priority selector in task form
- Tag input with autocomplete
- Visual priority indicators in task list
- Filter UI for priorities and tags

## Database Schema

- `priority`: string (enum: "high", "medium", "low", nullable)
- `tags`: array of strings (nullable)

## API Changes

- Include priority and tags in task creation/update
- Add query parameters for filtering by priority/tags

