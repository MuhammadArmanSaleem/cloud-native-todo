# Specification: Task Deletion UI

## Feature Description

Implement task deletion functionality with an intuitive user interface that includes confirmation dialogs to prevent accidental deletions. Users can delete tasks from both the Task List view and Task Detail view. The deletion process includes visual feedback and ensures tasks are removed from the UI immediately without page reload. All deletion operations use mock logic for now and do not make API calls.

## User Scenarios & Testing

### Scenario 1: Deleting Task from Task List
**As a user**, I can delete a task directly from the task list view.

**Given** I am viewing the task list
**When** I see a task card with a delete button
**And** I click the delete button
**Then** a confirmation dialog appears
**And** I can confirm or cancel the deletion
**When** I confirm the deletion
**Then** the task is removed from the task list immediately
**And** I see visual feedback that the task was deleted
**And** no page reload is required

### Scenario 2: Deleting Task from Task Detail View
**As a user**, I can delete a task from the task detail page.

**Given** I am viewing a task detail page
**When** I see a delete button
**And** I click the delete button
**Then** a confirmation dialog appears
**And** I can confirm or cancel the deletion
**When** I confirm the deletion
**Then** the task is deleted
**And** I am redirected to the task list or see appropriate feedback
**And** the task no longer appears in the list

### Scenario 3: Canceling Deletion
**As a user**, I can cancel a deletion operation if I change my mind.

**Given** I have clicked the delete button on a task
**When** the confirmation dialog appears
**And** I click the "Cancel" button
**Then** the dialog closes
**And** the task remains in the list
**And** no deletion occurs

### Scenario 4: Delete Button Visibility
**As a user**, I only see delete buttons for tasks I own.

**Given** I am viewing tasks in the list or detail view
**When** I look at tasks
**Then** delete buttons are only visible for tasks that belong to me
**And** tasks owned by other users do not show delete buttons
**And** ownership is determined by mock user data

### Scenario 5: Visual Feedback on Deletion
**As a user**, I receive clear visual feedback when a task is deleted.

**Given** I have confirmed a task deletion
**When** the task is removed from the list
**Then** I see visual feedback (e.g., "Deleted" text, animation, or fade-out effect)
**And** the feedback is clear and not confusing
**And** the task list updates smoothly

### Scenario 6: Multiple Rapid Deletions
**As a user**, I can delete multiple tasks in quick succession.

**Given** I want to delete multiple tasks
**When** I delete one task and confirm
**And** I immediately delete another task
**Then** each deletion shows its own confirmation dialog
**And** each deletion is processed correctly
**And** the task list updates after each deletion

### Scenario 7: Delete Button Hover State
**As a user**, I can see that the delete button is interactive.

**Given** I am viewing a task with a delete button
**When** I hover over the delete button
**Then** I see a visual hover state (e.g., color change, icon highlight)
**And** the hover state clearly indicates the button is clickable

## Functional Requirements

### Delete Button Component
- Delete button displays trash icon
- Button has visible hover state
- Button is only visible for tasks owned by the current user
- Button appears on Task Card component
- Button appears on Task Detail page
- Button is accessible via keyboard navigation
- Button has appropriate ARIA labels for screen readers

### Confirmation Dialog Component
- Dialog component displays when delete button is clicked
- Dialog shows task information (e.g., task title) for context
- Dialog includes "Confirm" button
- Dialog includes "Cancel" button
- Dialog can be closed by clicking Cancel or outside the dialog
- Dialog is accessible via keyboard (ESC to close, Tab to navigate)
- Dialog uses shadcn/ui Dialog component or custom modal
- Dialog state is managed (open/closed)

### Deletion Logic
- Deletion operation is triggered when user confirms
- Deletion uses mock logic (no API calls)
- Task is removed from task list state immediately
- Task list UI updates without page reload
- Parent component manages task list state
- Deletion callback is passed from parent to child components

### UI Feedback
- Visual feedback is shown when task is deleted
- Feedback can be text message, animation, or visual effect
- Feedback is clear and not confusing
- Feedback appears briefly and then disappears
- Task list reflects deletion immediately

### Task Ownership
- Delete button visibility is based on task ownership
- Ownership is determined by comparing task user ID with current user ID
- Mock user data is used for ownership determination
- Tasks owned by other users do not show delete buttons

### State Management
- Parent component (TaskList) manages task list state
- Delete operation updates parent component state
- State updates trigger UI re-render
- No page reload required for state updates
- Confirmation dialog state is managed locally or in parent

## Success Criteria

- Users can delete tasks from both Task List and Task Detail views
- Confirmation dialog appears before every deletion
- Users can cancel deletion operations
- Tasks are removed from UI immediately without page reload
- Visual feedback is provided when tasks are deleted
- Delete buttons are only visible for tasks owned by the current user
- Delete button has clear hover state
- Confirmation dialog is accessible via keyboard
- Multiple deletions can be performed in succession
- Task list state updates correctly after deletion

## Key Entities

### Task Ownership
- Task user ID: identifier of task owner
- Current user ID: identifier of logged-in user (from mock data)
- Ownership check: comparison of task user ID with current user ID

### Deletion State
- Task to delete: task ID or task object
- Confirmation dialog open/closed state
- Deletion in progress state (optional, for future API integration)

### UI Feedback
- Deletion confirmation message
- Visual effect type (text, animation, fade-out)
- Feedback duration

## Edge Cases

- Deleting the last task in list: Show empty state correctly
- Rapid clicking delete button: Prevent multiple dialogs from opening
- Confirming deletion while dialog is closing: Handle state correctly
- Deleting task that doesn't exist: Handle gracefully
- Network error during deletion (future): Show error message
- User ownership changes: Update button visibility correctly
- Multiple users viewing same task list: Each sees only their delete buttons
- Task deleted by another user: Handle state update if needed
- Confirmation dialog on mobile: Ensure touch-friendly interface
- Keyboard navigation: Ensure all dialog actions are keyboard accessible

## Assumptions

- Task Card and Task Detail components already exist
- Task list state is managed in parent component
- Mock user data is available for ownership checks
- shadcn/ui Dialog component is available or can be created
- Trash icon is available (from icon library or shadcn/ui)
- Task ownership is determined by user ID comparison
- Deletion is a destructive action that requires confirmation
- Visual feedback duration is brief (2-3 seconds or fade-out)
- No undo functionality needed in this phase

## Out of Scope

- API integration (mock deletion only)
- Undo deletion functionality
- Bulk deletion (delete multiple tasks at once)
- Soft delete (tasks marked as deleted but not removed)
- Deletion history or audit log
- Permanent deletion vs. archive
- Backend changes
- Database work
- Real-time deletion updates across multiple users
- Deletion permissions or role-based access control (beyond ownership check)


