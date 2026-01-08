# Specification: Task List + TaskCard UI

## Feature Description

Implement the core UI for displaying tasks in a list format with individual task cards. This feature focuses on building the Task List page (PLP - Product List Page) and TaskCard components to show task details. All UI components are props-driven and reusable, using mock data for now. Formik is used for task form handling and validation.

## User Scenarios & Testing

### Scenario 1: Viewing Task List
**As a user**, I can see all my tasks displayed in a list format.

**Given** I am on the tasks page
**When** the page loads
**Then** I see a list of all tasks
**And** each task is displayed in a card format
**And** tasks show title, priority, due date, and completion status
**And** I can see a checkbox to toggle completion for each task

### Scenario 2: Task List with No Tasks
**As a user**, I see a helpful message when I have no tasks.

**Given** I have no tasks
**When** I view the tasks page
**Then** I see an empty state message
**And** the message is clear and helpful
**And** I understand how to add my first task

### Scenario 3: Task List Loading State
**As a user**, I see a loading indicator while tasks are being fetched.

**Given** tasks are being loaded
**When** I view the tasks page
**Then** I see a loading state (skeleton loader or spinner)
**And** the loading state indicates content is coming
**And** the layout structure is visible during loading

### Scenario 4: Viewing Task Details in Card
**As a user**, I can see important task information at a glance.

**Given** I am viewing the task list
**When** I look at a task card
**Then** I see the task title
**And** I see a priority badge (low, medium, high) if priority is set
**And** I see a due date with calendar icon if due date exists
**And** I see a checkbox indicating completion status
**And** I can see the task description if available

### Scenario 5: Filtering Tasks by Status
**As a user**, I can filter tasks to see only completed or all tasks.

**Given** I have both completed and pending tasks
**When** I select a filter option (all, completed, pending)
**Then** the task list updates to show only matching tasks
**And** the filter state is clearly indicated
**And** I can easily switch between filter options

### Scenario 6: Toggling Task Completion
**As a user**, I can mark tasks as complete or incomplete.

**Given** I am viewing a task card
**When** I click the completion checkbox
**Then** the task's completion status toggles
**And** the visual state updates immediately
**And** the change is reflected in the task card appearance

### Scenario 7: Responsive Task List Display
**As a user**, the task list adapts to my screen size.

**Given** I view the task list on different devices
**When** I resize my browser or switch devices
**Then** tasks are displayed in an appropriate layout (grid or list)
**And** task cards remain readable and usable
**And** all information is accessible on mobile devices

## Functional Requirements

### Task List Component
- Component receives tasks array as props (no hardcoded data)
- Renders all tasks using TaskCard components
- Supports filtering by completion status (all, completed, pending) via props
- Displays loading state when tasks are being fetched
- Displays empty state when no tasks are available
- Uses grid or list layout with Tailwind utilities
- Responsive design that works on mobile and desktop
- Maps over tasks array with stable IDs for keys

### Task Card Component
- Component receives task data as props (title, description, status, priority, due date)
- Displays task title prominently
- Shows task description if available
- Displays completion checkbox that toggles task status
- Shows priority badge (low, medium, high) using shadcn Badge component
- Displays due date with calendar icon if due date exists
- Uses shadcn/ui components for consistent styling
- All data comes from props (no hardcoded content)
- Accessible keyboard navigation and screen reader support

### Data Handling
- Uses mock data from `/content/mockTasks.ts` or similar configuration
- Task data structure includes: id, title, description, completed, priority, dueDate
- Data is passed from parent component to TaskList, then to TaskCard
- No API calls in this phase (mock data only)

### Layout and Styling
- Uses Tailwind CSS classes for styling
- Responsive design with mobile-first approach
- Grid or list layout that adapts to screen size
- Consistent spacing and typography using theme tokens
- No inline styles (all via Tailwind classes)

### Component Architecture
- Components are reusable and props-driven
- No hardcoded task data inside components
- TypeScript interfaces for all props
- Proper component composition (TaskList contains TaskCard components)
- Uses shadcn/ui components (Badge, Button, Card if needed)

## Success Criteria

- Task list displays all tasks correctly from mock data
- TaskCard shows all required information (title, priority badge, due date, completion status)
- TaskCard completion checkbox toggles status correctly
- Loading state displays appropriately when data is being fetched
- Empty state displays when no tasks are available
- Task list supports filtering by completion status
- Layout is responsive and works on mobile and desktop viewports
- All components are props-driven with no hardcoded data
- Components are reusable and can be used in different contexts
- UI is accessible via keyboard and screen readers

## Key Entities

### Task Data Structure
- Task object with properties: id, title, description, completed, priority, dueDate
- Priority values: "low" | "medium" | "high" | null
- Due date: Date string or null
- Completion status: boolean

### Filter State
- Filter type: "all" | "completed" | "pending"
- Filter state managed by parent component
- Passed to TaskList as props

## Edge Cases

- Empty task list: Show empty state message
- Task with no priority: Do not show priority badge
- Task with no due date: Do not show due date or calendar icon
- Task with no description: Handle gracefully (optional field)
- Very long task title: Truncate or wrap appropriately
- Very long task description: Truncate with expand option or scroll
- Loading state timeout: Show error state if loading takes too long
- Invalid task data: Handle missing required fields gracefully
- Many tasks: List should scroll or paginate appropriately
- Rapid checkbox toggling: Prevent duplicate state updates

## Assumptions

- Mock data is available in `/content/mockTasks.ts` or similar location
- Task data structure matches the expected format
- shadcn/ui Badge and other components are already installed
- Theme tokens are already configured from previous bootstrap work
- Formik is available for future form handling (not used in this phase for display)
- Parent component manages filter state and passes it to TaskList
- Completion toggle is handled via callback prop (no API call in this phase)
- Responsive breakpoints follow standard Tailwind defaults (sm, md, lg, xl)

## Out of Scope

- API integration (mock data only)
- Task creation or editing forms (display only)
- Task deletion functionality
- Search functionality
- Advanced filtering (only completion status filter)
- Sorting functionality
- Task detail page or modal
- Real-time updates
- Backend changes
- Database work
- Authentication integration


