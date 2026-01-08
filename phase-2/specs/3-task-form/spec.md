# Specification: Task Create/Edit Form (Formik)

## Feature Description

Implement task creation and editing forms using Formik for form state management and validation. This feature focuses on building reusable form components that allow users to create new tasks and edit existing tasks. Forms include validation for all fields, error message display, and proper data handling. Forms use mock data for now and do not make API calls.

## User Scenarios & Testing

### Scenario 1: Creating a New Task
**As a user**, I can create a new task by filling out a form.

**Given** I want to create a new task
**When** I open the task creation form
**Then** I see a form with fields for title, description, priority, tags, and due date
**And** the title field is required
**And** I can fill in optional fields (description, priority, tags, due date)
**When** I submit the form with valid data
**Then** the form data is collected and ready to be saved
**And** I see a success indication

### Scenario 2: Creating Task with Validation Errors
**As a user**, I see clear error messages when I enter invalid data.

**Given** I am creating a new task
**When** I try to submit the form without a title
**Then** I see an error message indicating title is required
**And** the error message appears below the title field
**And** I cannot submit the form until the error is fixed
**When** I enter a title longer than 200 characters
**Then** I see an error message indicating the title is too long
**And** the error message appears below the title field

### Scenario 3: Editing an Existing Task
**As a user**, I can edit an existing task by modifying its details.

**Given** I have an existing task
**When** I open the task edit form
**Then** the form is pre-populated with the task's current data
**And** I can modify any field (title, description, priority, tags, due date)
**When** I submit the form with changes
**Then** the updated form data is collected and ready to be saved
**And** I see a success indication

### Scenario 4: Form Field Validation
**As a user**, I receive immediate feedback on field validation.

**Given** I am filling out the task form
**When** I enter a description longer than 1000 characters
**Then** I see an error message indicating the description is too long
**And** the error appears below the description field
**When** I select an invalid priority value
**Then** I see an error message indicating the priority must be low, medium, or high
**When** I enter an invalid date format
**Then** I see an error message indicating the date is invalid

### Scenario 5: Optional Fields Handling
**As a user**, I can create tasks with only required fields filled.

**Given** I am creating a new task
**When** I fill in only the required title field
**And** I leave all optional fields empty
**Then** I can successfully submit the form
**And** the form accepts the minimal required data

### Scenario 6: Form Reset and Cancellation
**As a user**, I can cancel or reset the form without losing data unintentionally.

**Given** I am filling out a task form
**When** I click cancel or close the form
**Then** I am returned to the previous view
**And** no data is saved
**When** I reset the form
**Then** all fields are cleared to their initial state
**And** any validation errors are cleared

### Scenario 7: Form Accessibility
**As a user with accessibility needs**, I can use the form with keyboard navigation and screen readers.

**Given** I am using keyboard navigation or a screen reader
**When** I navigate through the form
**Then** all fields are accessible via keyboard
**And** error messages are announced by screen readers
**And** form labels are properly associated with inputs
**And** I can submit the form using keyboard only

## Functional Requirements

### Task Create Form
- Form component receives initial values as props (empty for create mode)
- Form includes the following fields:
  - **Title** (required, 1-200 characters)
  - **Description** (optional, max 1000 characters)
  - **Priority** (optional: low, medium, high)
  - **Tags** (optional: array of strings)
  - **Due Date** (optional: date picker)
- Form uses Formik for state management
- Form uses Yup or Zod for validation schema
- Validation errors display below each field
- Submit button displays "Create Task" text
- Form is reusable and props-driven (no hardcoded data)

### Task Edit Form
- Form component receives existing task data as props (pre-populated for edit mode)
- Form includes the same fields as Create Form
- Form pre-populates all fields with existing task data when editing
- Form uses Formik for state management
- Form uses the same validation schema as Create Form
- Validation errors display below each field
- Submit button displays "Save Changes" text
- Form is reusable and props-driven

### Validation Schema
- Title validation:
  - Required field
  - Minimum 1 character
  - Maximum 200 characters
  - Error message displayed if validation fails
- Description validation:
  - Optional field
  - Maximum 1000 characters if provided
  - Error message displayed if validation fails
- Priority validation:
  - Optional field
  - Must be one of: "low", "medium", "high" if provided
  - Error message displayed if validation fails
- Tags validation:
  - Optional field
  - Array of strings if provided
  - Error message displayed if validation fails
- Due Date validation:
  - Optional field
  - Must be a valid date if provided
  - Error message displayed if validation fails

### Error Display
- Validation errors appear below the corresponding field
- Error messages are clear and actionable
- Errors are displayed immediately when validation fails
- Errors are cleared when the field value becomes valid
- Multiple errors can be displayed simultaneously

### Form Data Handling
- Form data is collected via Formik's form state
- Form data structure matches task data model
- Form data is passed to parent component via onSubmit callback
- No API calls from form components (handled by parent)
- Mock data can be used for testing edit form pre-population

### Component Architecture
- Components are reusable and props-driven
- No hardcoded form data inside components
- TypeScript interfaces for all props
- Form components can be used in different contexts (modal, page, drawer)
- Uses shadcn/ui components for form inputs where applicable

## Success Criteria

- Task create form renders correctly with all required and optional fields
- Task edit form pre-populates correctly with existing task data
- Form validation works for all field types and constraints
- Validation errors display correctly below each field
- Users can successfully create tasks with valid data
- Users can successfully edit tasks with valid data
- Form prevents submission when validation fails
- Form allows submission when all validations pass
- Error messages are clear and help users correct their input
- Form is accessible via keyboard and screen readers
- Form components are reusable in different contexts
- Form data is correctly collected and passed to parent component

## Key Entities

### Task Form Data Structure
- Task form object with properties: title, description, priority, tags, dueDate
- Title: string (required, 1-200 characters)
- Description: string | null (optional, max 1000 characters)
- Priority: "low" | "medium" | "high" | null (optional)
- Tags: string[] | null (optional)
- Due Date: Date | string | null (optional, valid date format)

### Validation Rules
- Title: required, min 1, max 200 characters
- Description: optional, max 1000 characters
- Priority: optional, must be "low", "medium", or "high" if provided
- Tags: optional, array of strings if provided
- Due Date: optional, valid date if provided

### Form Modes
- Create mode: form starts empty, submit button says "Create Task"
- Edit mode: form pre-populated with task data, submit button says "Save Changes"

## Edge Cases

- Empty title on submit: Show required field error
- Title exceeding 200 characters: Show max length error
- Description exceeding 1000 characters: Show max length error
- Invalid priority value: Show validation error
- Invalid date format: Show date validation error
- Past due date: Handle gracefully (may be valid for some use cases)
- Very long tag names: Truncate or validate appropriately
- Many tags: Handle array size limits if needed
- Special characters in title/description: Validate and sanitize appropriately
- Form submission during validation: Prevent submission until valid
- Rapid form field changes: Handle validation state correctly
- Network errors (future): Handle gracefully when API integration is added

## Assumptions

- Formik and Yup/Zod are already installed and configured
- shadcn/ui form components (Input, Textarea, Select, etc.) are available
- Date picker component is available (shadcn/ui Calendar or similar)
- Mock task data is available in `/content/mockTasks.ts` for testing edit form
- Parent component handles form submission (onSubmit callback)
- Form components receive initialValues and onSubmit as props
- Validation schema is defined in a shared location (e.g., `/lib/validators/`)
- Form can be used in different contexts (modal, page, drawer)
- Theme tokens are already configured from previous bootstrap work

## Out of Scope

- API integration (form data passed to parent, no direct API calls)
- Task deletion functionality
- Form persistence (auto-save drafts)
- File uploads or attachments
- Rich text editing for description
- Tag autocomplete or suggestions
- Date picker advanced features (time zones, recurring patterns)
- Form analytics or tracking
- Backend changes
- Database work
- Real-time validation (validation on submit is sufficient for this phase)


