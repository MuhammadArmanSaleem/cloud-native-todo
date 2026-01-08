# Specification: Due Date & Recurring Task UI

## Feature Description

Implement user interface components for selecting due dates and configuring recurring task patterns. This feature adds due date picker and recurring task selector components that integrate with the existing task create/edit forms. Users can select due dates using a calendar picker and configure recurring intervals (daily, weekly, custom) for tasks. All components are props-driven and use Formik for validation integration.

## User Scenarios & Testing

### Scenario 1: Selecting a Due Date
**As a user**, I can select a due date for my task using a calendar picker.

**Given** I am creating or editing a task
**When** I interact with the due date field
**Then** I see a calendar picker interface
**And** I can select a date from the calendar
**And** the selected date is displayed in a readable format (e.g., MM/DD/YYYY)
**And** the date is saved with the task data

### Scenario 2: Viewing Due Date on Task
**As a user**, I can see the due date displayed on task cards and in the task list.

**Given** I have tasks with due dates
**When** I view the task list or task cards
**Then** I see the due date displayed as a badge or label
**And** the date is formatted nicely and easy to read
**And** I can distinguish tasks with due dates from those without

### Scenario 3: Selecting Recurring Pattern
**As a user**, I can configure a task to repeat at regular intervals.

**Given** I am creating or editing a task
**When** I want to make the task recurring
**Then** I see options for recurring intervals (daily, weekly, monthly, custom)
**And** I can select one of the predefined options
**And** the recurring pattern is saved with the task data

### Scenario 4: Custom Recurring Pattern
**As a user**, I can specify a custom recurring interval for my task.

**Given** I am creating or editing a task
**When** I select "custom" for the recurring pattern
**Then** I can specify the frequency (e.g., every X days, every X weeks)
**And** I can configure the custom interval
**And** the custom recurring rule is saved with the task data

### Scenario 5: Due Date with Time Information
**As a user**, I can optionally include time information with the due date.

**Given** I am selecting a due date
**When** the due date includes time information
**Then** I can see the time displayed along with the date
**And** the time is formatted clearly
**And** both date and time are saved with the task

### Scenario 6: Clearing Due Date or Recurrence
**As a user**, I can remove a due date or recurring pattern from a task.

**Given** I have a task with a due date or recurring pattern
**When** I edit the task
**Then** I can clear the due date field
**And** I can clear the recurring pattern
**And** the changes are saved correctly

### Scenario 7: Form Validation for Due Date and Recurrence
**As a user**, I see validation errors if I enter invalid date or recurrence data.

**Given** I am filling out the task form
**When** I enter an invalid date format
**Then** I see an error message indicating the date is invalid
**And** the error appears below the due date field
**When** I select an invalid recurring pattern
**Then** I see an error message indicating the pattern is invalid
**And** the error appears below the recurring pattern field

### Scenario 8: Editing Task with Existing Due Date/Recurrence
**As a user**, I can edit tasks that already have due dates or recurring patterns.

**Given** I have a task with a due date and recurring pattern
**When** I open the edit form
**Then** the due date field is pre-populated with the existing date
**And** the recurring pattern field is pre-populated with the existing pattern
**And** I can modify both fields
**And** the changes are saved correctly

## Functional Requirements

### Due Date Picker Component
- Component receives initial date value as prop
- Component provides selected date via callback prop
- Uses calendar picker interface (date picker library or shadcn UI Popover with Calendar)
- Displays selected date in readable format (MM/DD/YYYY or similar)
- Optionally displays time if time information is included
- Allows clearing/removing the date selection
- Integrates with Formik for form validation
- Accessible via keyboard navigation
- Responsive design for mobile and desktop

### Due Date Display
- Due date displayed as badge or label on task cards
- Date formatted nicely and consistently
- Visual distinction between tasks with and without due dates
- Date format is user-friendly and locale-appropriate

### Recurring Task Selector Component
- Component receives initial recurring pattern as prop
- Component provides selected pattern via callback prop
- Options include: daily, weekly, monthly, custom
- Uses radio buttons or dropdown for pattern selection
- For custom option, allows user to specify frequency (every X days/weeks)
- Integrates with Formik for form validation
- Accessible via keyboard navigation
- Responsive design for mobile and desktop

### Task Form Integration
- TaskForm component includes Due Date field
- TaskForm component includes Recurring Pattern field
- Both fields are optional
- Fields integrate with Formik validation
- Fields pre-populate correctly in edit mode
- Form validation works for both fields
- Error messages display below fields when validation fails

### Task Edit Form Integration
- TaskEditForm component includes Due Date field
- TaskEditForm component includes Recurring Pattern field
- Fields pre-populate with existing task data
- Fields can be modified or cleared
- Form validation works for both fields
- Changes are saved correctly

### Data Handling
- Due date data structure: Date | string | null
- Recurring pattern data structure: string | object | null
- Data passed as props from parent component
- Data collected via Formik form state
- No direct API calls from components (handled by parent)
- Mock data can be used for testing

### Validation
- Due date validation:
  - Optional field
  - Must be valid date format if provided
  - Error message displayed if validation fails
- Recurring pattern validation:
  - Optional field
  - Must be valid pattern (daily, weekly, monthly, or custom) if provided
  - Custom pattern must have valid frequency if provided
  - Error message displayed if validation fails

## Success Criteria

- Due date picker works correctly and allows date selection
- Selected due date is formatted nicely and displayed correctly
- Due date is displayed on task cards and in task list
- Recurring task selector allows selection of predefined patterns (daily, weekly, monthly)
- Custom recurring pattern allows specification of frequency
- Task forms (Create/Edit) properly include due date and recurrence fields
- Form validation works for due date and recurrence fields
- Fields pre-populate correctly in edit mode
- Users can clear due date and recurrence fields
- Components are reusable and props-driven
- UI is accessible via keyboard and screen readers
- Components work responsively on mobile and desktop

## Key Entities

### Due Date Data Structure
- Due date: Date | string | null
- Date format: ISO string or Date object
- Optional time component: Date with time | string with time | null
- Display format: MM/DD/YYYY or locale-appropriate format

### Recurring Pattern Data Structure
- Pattern type: "daily" | "weekly" | "monthly" | "custom" | null
- Custom pattern: { type: "custom", frequency: number, unit: "days" | "weeks" }
- Pattern stored as string or structured object

### Form Integration
- Due date field in TaskForm and TaskEditForm
- Recurring pattern field in TaskForm and TaskEditForm
- Both fields optional
- Both fields validated via Formik/Yup/Zod

## Edge Cases

- Invalid date format: Show validation error
- Past dates: Handle gracefully (may be valid for some use cases)
- Very far future dates: Handle appropriately
- Time zone differences: Handle timezone conversion if needed
- Custom recurrence with invalid frequency: Show validation error
- Custom recurrence with zero or negative frequency: Show validation error
- Clearing due date after it was set: Handle state update correctly
- Clearing recurrence after it was set: Handle state update correctly
- Rapid date selection changes: Handle state updates correctly
- Date picker on mobile devices: Ensure touch-friendly interface
- Recurring pattern with no due date: Handle gracefully (may be valid)

## Assumptions

- Date picker library or shadcn/ui Calendar component is available
- Formik and Yup/Zod are already installed and configured
- Task forms (TaskForm, TaskEditForm) already exist and can be extended
- Parent component manages state for due date and recurrence
- Mock task data is available for testing edit form pre-population
- Date formatting utilities are available or can be created
- Timezone handling is consistent (UTC or user's local timezone)
- Custom recurrence frequency has reasonable limits (e.g., 1-365 days)
- Recurring pattern can be stored as string or structured object

## Out of Scope

- Actual recurring task generation logic (backend functionality)
- Reminder notifications (separate feature)
- Time picker for due date time (optional, may be included if time information is supported)
- Advanced recurring patterns (e.g., "every first Monday of month", "every 2nd and 4th Tuesday")
- Recurring task preview or next occurrence calculation
- Calendar view for due dates
- Due date reminders or alerts
- Backend changes
- Database work
- API integration (mock data only)
- Task deletion functionality


