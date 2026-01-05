# Feature: Sort Tasks

## User Stories

- As a user, I can sort tasks by due date
- As a user, I can sort tasks by priority
- As a user, I can sort tasks alphabetically by title
- As a user, I can sort tasks by creation date
- As a user, I can choose ascending or descending order

## Acceptance Criteria

### Sort Options
- Due date (ascending/descending)
- Priority (high → low, or low → high)
- Title (A → Z, or Z → A)
- Creation date (newest first, or oldest first)
- Default: creation date (newest first)

### UI/UX
- Sort dropdown/selector
- Visual indicator for current sort
- Sort order toggle (ascending/descending)
- Sort persists during session

### Combined with Filters
- Sort works with all filters
- Sort works with search
- Sort applies to filtered results

## API Endpoints

- Add query parameter: `sort` (e.g., "due_date", "priority", "title", "created_at")
- Add query parameter: `order` (e.g., "asc", "desc")
- Backend handles sorting logic

## Database

- Indexes on sortable fields for performance
- Efficient sorting queries

