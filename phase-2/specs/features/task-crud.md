# Feature: Task CRUD Operations (Web Version)

## User Stories

- As a user, I can create a new task via web interface
- As a user, I can view all my tasks in a list
- As a user, I can update a task's details
- As a user, I can delete a task
- As a user, I can mark a task as complete/incomplete

## Acceptance Criteria

### Create Task
- Title is required (1-200 characters)
- Description is optional (max 1000 characters)
- Task is associated with logged-in user
- Task defaults to incomplete status
- Created timestamp is set automatically

### View Tasks
- Only show tasks for current authenticated user
- Display title, status, created date
- Support filtering by status (all/pending/completed)
- Responsive design for mobile and desktop

### Update Task
- Can update title and/or description
- Validation rules same as creation
- Updated timestamp is refreshed
- Only owner can update their tasks

### Delete Task
- Only owner can delete their tasks
- Confirmation dialog before deletion
- Task is permanently removed from database

### Mark Complete
- Toggle completion status
- Visual indicator shows completion state
- Updated timestamp is refreshed

## API Endpoints

See `@specs/api/rest-endpoints.md` for detailed API specification.

## UI Components

See `@specs/ui/components.md` for component specifications.

## Database Schema

See `@specs/database/schema.md` for database structure.

