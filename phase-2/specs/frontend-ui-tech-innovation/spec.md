# Specification: Techy-Minimalist Frontend UI (Tech Innovation Aesthetic)

## Feature Description

Complete frontend UI implementation for Phase 2 Todo application with Techy-Minimalist "Tech Innovation" aesthetic. The frontend provides a polished, dark-forward interface using shadcn/ui components, Formik forms, centralized theme tokens, and responsive design. Supports feature progression: Basic (Core CRUD + completion), Intermediate (Priorities/Tags + Search/Filter + Sort), Advanced (Recurring + Due Dates + Reminders UI).

## User Stories

### Basic Features
- As a user, I can sign in/sign up to access my tasks
- As a user, I can view all my tasks in a list with completion toggle
- As a user, I can create new tasks with title and description using a validated form
- As a user, I can update existing tasks
- As a user, I can delete tasks with confirmation
- As a user, I can mark tasks as complete/incomplete

### Intermediate Features
- As a user, I can assign priorities (high/medium/low) to tasks with visual indicators
- As a user, I can add tags/categories to tasks with chip UI
- As a user, I can search tasks by keyword in real-time
- As a user, I can filter tasks by status, priority, or tags
- As a user, I can sort tasks by date, priority, or title

### Advanced Features
- As a user, I can set due dates for tasks with date picker
- As a user, I can set reminder times for tasks with time picker
- As a user, I can create recurring tasks (daily/weekly/monthly) with UI controls
- As a user, I see browser notification permission UI for reminders
- As a user, I can access settings page for theme and language preferences

## Functional Requirements

### Theme System
- Centralized theme tokens in `globals.css` using CSS variables
- Base colors: Electric Blue (#0066ff), Neon Cyan (#00ffff), Dark Gray (#1e1e1e), White (#ffffff)
- Extended tokens: muted, border, ring, destructive, success, warning, card, popover
- Dark mode tokens (dark-first design)
- All tokens mapped in `tailwind.config.ts`
- No inline styles or scattered hex codes

### Typography System
- Primary font (Headings): DejaVu Sans Bold or closest web-available substitute
- Secondary font (Body/UI): DejaVu Sans or closest substitute
- Use `next/font` for font loading
- CSS variables: `--font-heading`, `--font-body`
- Tailwind font families reference CSS variables
- Responsive typography with clamp() or 2xl scaling rules

### Component Architecture
- All components use shadcn/ui primitives (Button, Card, Badge, Dialog, Sheet, DropdownMenu, Tabs, Input, Textarea, Select, Switch, Calendar/Popover)
- Components are props-driven and content-agnostic (no hardcoded data)
- Lists rendered via map() from arrays with stable IDs
- UI behavior isolated: presentational components receive callbacks from containers
- TypeScript interfaces for all component props

### Form System
- All forms use Formik with Yup or Zod validation
- Validation schemas in `/lib/validators/` with reusable schemas
- Client-side validation BEFORE API calls
- Form components reusable with `initialValues` and `onSubmit` props
- TaskCreateForm: title required (min/max), description optional, priority optional, tags optional, dueDate optional
- TaskEditForm: same validation rules

### API Integration
- Typed API client stub in `/lib/api/client.ts`
- Functions: getTasks(), createTask(), updateTask(), deleteTask(), toggleComplete()
- Can use placeholder endpoints or mock in-memory data for now
- All API calls abstracted through client, not in components
- Easy to replace mock API with real endpoints without refactoring UI

### Responsive Design
- Mobile-first design with md/lg/xl/2xl breakpoints
- Avoid fixed px sizing that feels small on 1920+ displays
- Use clamp() for key typography/spacing or provide 2xl scaling rules
- Consistent container utility: centered layout, max-width responsive, responsive padding
- Layout balanced at 1440px and 1920px viewports

### App Shell
- Left sidebar (desktop) + bottom nav or drawer (mobile)
- Header with search input + add task button + user menu placeholder
- Responsive navigation patterns

### Pages / UX Flow
1. **App Shell**: Layout with sidebar/nav, header, main content area
2. **Tasks List View**: Task list with completion toggle, empty state, loading skeleton, TaskCard shows title, status, priority, tags, due date
3. **Task Create / Edit**: Modal (Dialog) or dedicated page with Formik validated form
4. **Intermediate Features UI**: Priority + Tags UI (chips), Search bar, Filter controls (status, priority, tags), Sort menu (due date, priority, created)
5. **Advanced UI**: Due date picker, Recurring rule UI (daily/weekly/custom), Reminder settings UI (browser notifications toggle)
6. **Settings Page**: Theme toggle (optional), Language selector placeholder (future i18n), Reminder permission UI

## Technical Requirements

### Stack (Mandatory)
- Next.js 16+ App Router + TypeScript
- TailwindCSS + shadcn/ui (use shadcn primitives; do not reinvent basic components)
- Formik for all forms + Yup (or Zod via adapter) for validation
- next/font for typography
- No inline styles; no scattered hex codes; only theme tokens

### Folder Structure (Mandatory)
```
frontend/
  app/
    layout.tsx
    page.tsx                  # dashboard/home
    tasks/page.tsx            # task list page
    tasks/[id]/page.tsx       # task detail
    settings/page.tsx         # preferences (language, reminders UI)
  components/
    ui/                       # shadcn (generated)
    layout/                   # Header, Sidebar, Footer
    sections/                 # page-level sections (DashboardHeader, StatsBar, etc.)
    task/                     # TaskCard, TaskList, TaskFilters, TaskForm, TagChip, PriorityBadge
    forms/                    # Formik wrappers, Field components
    shared/                   # EmptyState, LoadingSkeleton, ErrorState
  content/
    navigation.ts
    mockTasks.ts
    uiCopy.ts                 # labels for future i18n
  lib/
    cn.ts
    validators/               # yup schemas
    formatters/               # date/priority helpers
    api/                      # typed API client stubs
  types/
    task.ts
    ui.ts
```

### Data Models (Mandatory)
Define types in `/types/task.ts`:
- Task: { id, title, description?, completed, priority, tags[], dueDate?, recurringRule?, createdAt, updatedAt }
- Priority: "low" | "medium" | "high"
- RecurringRule: (string or structured type)

Define UI types for filters/sort in `/types/ui.ts`.

## Success Criteria

- UI feels techy-minimalist and matches "Tech Innovation" palette
- All forms are Formik-based with validation schemas
- Components are reusable and props-driven
- App works end-to-end with mock API client (no backend required)
- Easy to later replace mock API with real endpoints without refactoring UI components
- Theme tokens centralized and used consistently
- Typography system properly configured with next/font
- Responsive design works on mobile, tablet, and desktop (1440px, 1920px)
- Keyboard accessible (tab navigation)
- Clear interactive states (hover, focus, active)
- No hardcoded palette inside component files

## Edge Cases

- Empty task list (show EmptyState component)
- Loading states (show LoadingSkeleton)
- Error states (show ErrorState component)
- Form validation errors (display inline with Formik)
- Network errors (handle gracefully with user feedback)
- Invalid date inputs (validate and show error)
- Duplicate tags (prevent or handle gracefully)
- Long task titles/descriptions (truncate with ellipsis or expand)
- Many tags (wrap or scroll)
- Browser notification permission denied (show UI message)

## Out of Scope

- Backend API implementation (use mock client)
- Database work
- Real authentication flow (placeholder for now)
- Actual browser notifications (UI only)
- Multi-language implementation (placeholder UI only)
- Production deployment
- Performance optimization beyond basic responsive design

