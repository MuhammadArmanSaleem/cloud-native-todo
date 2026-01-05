# Feature: Search & Filter

## User Stories

- As a user, I can search tasks by keyword
- As a user, I can filter tasks by status (all/pending/completed)
- As a user, I can filter tasks by priority
- As a user, I can filter tasks by tags
- As a user, I can combine multiple filters
- As a user, I can see active filters and clear them

## Acceptance Criteria

### Search
- Search by keyword in title and description
- Case-insensitive search
- Real-time search results (as user types)
- Highlight matching text in results
- Search works across all user's tasks

### Filter by Status
- Filter: all, pending, completed
- Default: all
- Visual indicator for active filter

### Filter by Priority
- Filter: all, high, medium, low
- Can select multiple priorities
- Visual indicator for active filters

### Filter by Tags
- Select one or more tags
- Shows tasks matching any selected tag (OR logic)
- Tag suggestions from existing tags
- Visual indicator for active tags

### Combined Filters
- Search + status filter
- Search + priority filter
- Search + tag filter
- All filters can be combined
- Clear all filters button

## API Endpoints

- Add query parameters: `search`, `status`, `priority`, `tags`
- Backend handles filtering logic
- Returns filtered results

## UI Components

- Search input with debounce
- Filter dropdowns/buttons
- Active filter indicators
- Clear filters button

