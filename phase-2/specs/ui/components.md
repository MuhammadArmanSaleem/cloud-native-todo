# UI Components Specification

## Component Structure

### Layout Components

#### RootLayout
- App-wide layout
- Navigation bar
- User menu (sign in/out)
- Language switcher (English/Urdu)

#### DashboardLayout
- Main app layout
- Sidebar navigation
- Task list area
- Task detail panel

### Authentication Components

#### SignInForm
- Email input
- Password input
- Submit button
- Error messages
- Link to signup

#### SignUpForm
- Name input (optional)
- Email input
- Password input
- Confirm password
- Submit button
- Error messages
- Link to signin

### Task Components

#### TaskList
- Display list of tasks
- Empty state
- Loading state
- Task items
- Responsive grid/list view

#### TaskItem
- Task title
- Description (collapsible)
- Priority indicator
- Tags display
- Due date display
- Completion checkbox
- Actions menu (edit, delete)

#### TaskForm
- Title input
- Description textarea
- Priority selector
- Tags input (with autocomplete)
- Due date picker
- Reminder time picker
- Recurring pattern selector
- Submit/Cancel buttons
- Validation errors

#### TaskFilters
- Search input
- Status filter (all/pending/completed)
- Priority filter (multi-select)
- Tags filter (multi-select)
- Clear filters button

#### TaskSort
- Sort dropdown (due_date, priority, title, created_at)
- Order toggle (asc/desc)
- Visual indicator

### Feature Components

#### PriorityIndicator
- Visual indicator (color/icon)
- High: Red
- Medium: Yellow
- Low: Green

#### TagInput
- Tag input with autocomplete
- Tag chips display
- Remove tag button
- Suggestions from existing tags

#### DatePicker
- Date selection
- Time selection (for reminders)
- Calendar view
- Timezone handling

#### VoiceInput
- Voice button
- Recording indicator
- Recognized text display
- Error handling

### Notification Components

#### NotificationPermission
- Request permission button
- Permission status display
- Instructions

#### NotificationDisplay
- Notification list
- Mark as read
- Clear notifications

## Styling Guidelines

- Use Tailwind CSS
- Minimalist techy design
- Responsive (mobile-first)
- Dark/light mode support (optional)
- RTL support for Urdu

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

## State Management

- Server Components for data fetching
- Client Components for interactivity
- React hooks for local state
- Consider React Query for complex state

