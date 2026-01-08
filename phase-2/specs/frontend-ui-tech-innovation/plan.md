# Plan: Techy-Minimalist Frontend UI Implementation (Tech Innovation Aesthetic)

## Technical Context

Building complete frontend UI for Phase 2 Todo application using Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui components, Formik forms, and centralized theme tokens. The frontend will provide a polished, dark-forward "Tech Innovation" aesthetic interface with full feature progression support (Basic → Intermediate → Advanced).

## Constitution Check

✅ **Spec-Driven Development**: Following SpecKit Plus workflow
✅ **Techy-Minimalist Frontend Architecture**: Using Next.js 16+ App Router, shadcn/ui, Formik, theme tokens
✅ **Component-Based Architecture**: Props-driven, content-agnostic components
✅ **Form Validation**: Formik + Yup/Zod validation before API calls
✅ **Theme Token System**: Centralized CSS variables, no inline styles
✅ **Typography System**: next/font with CSS variables
✅ **Responsive Design**: Mobile-first with clamp() scaling

## Phase 0: Research (Context7)

### Latest Next.js 16 Patterns
- Next.js 16 App Router best practices
- Server vs Client Components patterns
- next/font configuration for custom fonts (DejaVu Sans)
- CSS variables integration with Tailwind
- TypeScript 5+ patterns

### shadcn/ui Integration
- Installation and setup with Next.js 16
- Component initialization via CLI
- Theme customization with CSS variables
- Component composition patterns
- Accessibility features

### Formik + Validation
- Formik setup with Next.js App Router
- Yup schema validation patterns
- Zod adapter for Formik (if needed)
- Form state management
- Error handling and display

### Theme Token System
- CSS variables in globals.css
- Tailwind config integration
- Dark mode token structure
- Color palette: Electric Blue (#0066ff), Neon Cyan (#00ffff), Dark Gray (#1e1e1e)
- Extended tokens: muted, border, ring, destructive, success, warning, card, popover

### Typography System
- next/font for DejaVu Sans (or closest substitute)
- CSS variable setup: --font-heading, --font-body
- Tailwind font family configuration
- Responsive typography with clamp()

### Responsive Design Patterns
- Mobile-first breakpoints (md/lg/xl/2xl)
- clamp() for typography/spacing
- Container utilities for centered layouts
- 1440px and 1920px viewport optimization

## Phase 1: Foundation Setup

### 1.1 Project Structure
- Create folder structure per specification
- Set up app/ directory with routes
- Create components/ directory structure
- Set up lib/, types/, content/ directories

### 1.2 Theme Token System
- Create globals.css with CSS variables
- Define base theme tokens (Electric Blue, Neon Cyan, Dark Gray, White)
- Define extended tokens (muted, border, ring, destructive, success, warning, card, popover)
- Configure tailwind.config.ts to map CSS variables
- Test token usage in sample component

### 1.3 Typography System
- Set up next/font for DejaVu Sans (or substitute)
- Configure CSS variables: --font-heading, --font-body
- Update tailwind.config.ts font families
- Test typography in sample component

### 1.4 shadcn/ui Setup
- Install shadcn/ui CLI
- Initialize shadcn/ui in project
- Configure components.json
- Install required base components: Button, Card, Badge, Dialog, Sheet, DropdownMenu, Tabs, Input, Textarea, Select, Switch
- Install Calendar/Popover if available
- Customize components to use theme tokens

### 1.5 Formik Setup
- Install Formik and Yup (or Zod)
- Create form validation utilities in lib/validators/
- Set up reusable form field components
- Create form wrapper components in components/forms/

## Phase 2: Data Models and API Client

### 2.1 Type Definitions
- Create types/task.ts with Task, Priority, RecurringRule types
- Create types/ui.ts with filter/sort types
- Ensure all types match backend schema expectations

### 2.2 API Client Stub
- Create lib/api/client.ts with typed API functions
- Implement getTasks(), createTask(), updateTask(), deleteTask(), toggleComplete()
- Use mock in-memory data or placeholder endpoints
- Ensure easy replacement with real API later

### 2.3 Mock Data
- Create content/mockTasks.ts with sample task data
- Create content/navigation.ts with navigation structure
- Create content/uiCopy.ts with UI labels (future i18n ready)

## Phase 3: Layout Components

### 3.1 App Shell
- Create app/layout.tsx with root layout
- Set up font variables in layout
- Configure global styles

### 3.2 Header Component
- Create components/layout/Header.tsx
- Include search input, add task button, user menu placeholder
- Use shadcn/ui components (Input, Button, DropdownMenu)
- Responsive design (mobile/desktop)

### 3.3 Sidebar Component
- Create components/layout/Sidebar.tsx (desktop)
- Navigation links
- Responsive: hidden on mobile

### 3.4 Mobile Navigation
- Create components/layout/MobileNav.tsx or drawer
- Bottom nav or drawer pattern
- Responsive: shown on mobile, hidden on desktop

### 3.5 Footer Component (Optional)
- Create components/layout/Footer.tsx if needed

## Phase 4: Base UI Components

### 4.1 Shared Components
- Create components/shared/EmptyState.tsx
- Create components/shared/LoadingSkeleton.tsx
- Create components/shared/ErrorState.tsx
- All props-driven, reusable

### 4.2 Utility Functions
- Create lib/cn.ts for className merging (clsx + tailwind-merge)
- Create lib/formatters/date.ts for date formatting
- Create lib/formatters/priority.ts for priority helpers

## Phase 5: Task Components (Basic Features)

### 5.1 TaskCard Component
- Create components/task/TaskCard.tsx
- Display: title, description, status, priority, tags, due date
- Completion toggle
- Edit/delete actions
- Props-driven, no hardcoded data

### 5.2 TaskList Component
- Create components/task/TaskList.tsx
- Map over tasks array with stable IDs
- Render TaskCard for each task
- Handle empty state
- Handle loading state

### 5.3 TaskForm Component
- Create components/task/TaskForm.tsx
- Use Formik with validation schema
- Fields: title (required), description (optional), priority, tags, dueDate
- Reusable for create and edit (initialValues prop)
- Error display with Formik

### 5.4 Task Validation Schema
- Create lib/validators/task.ts
- Yup schema for TaskCreateForm
- Validation rules: title min/max, description max, etc.

## Phase 6: Intermediate Features UI

### 6.1 PriorityBadge Component
- Create components/task/PriorityBadge.tsx
- Visual indicator for priority (high/medium/low)
- Use theme tokens for colors
- shadcn/ui Badge component

### 6.2 TagChip Component
- Create components/task/TagChip.tsx
- Display tags as chips
- Use theme tokens
- shadcn/ui Badge component

### 6.3 TaskFilters Component
- Create components/task/TaskFilters.tsx
- Search input (real-time)
- Filter controls: status, priority, tags
- Use shadcn/ui components (Input, Select, Switch)

### 6.4 TaskSortMenu Component
- Create components/task/TaskSortMenu.tsx
- Sort options: due date, priority, created
- Use shadcn/ui DropdownMenu

## Phase 7: Advanced Features UI

### 7.1 Date Picker Integration
- Integrate shadcn/ui Calendar/Popover for due dates
- Create date picker wrapper component
- Handle date formatting and validation

### 7.2 Recurring Rule UI
- Create recurring pattern selector
- Options: daily, weekly, monthly, custom
- Use shadcn/ui Select or RadioGroup

### 7.3 Reminder Settings UI
- Create reminder time picker
- Browser notification permission UI
- Use shadcn/ui Switch for toggles

## Phase 8: Pages Implementation

### 8.1 Dashboard/Home Page
- Create app/page.tsx
- Integrate TaskList, TaskFilters, TaskSortMenu
- Handle task CRUD operations
- Connect to API client

### 8.2 Tasks List Page
- Create app/tasks/page.tsx
- Full task list view
- All filters and sorting
- Empty/loading/error states

### 8.3 Task Detail Page
- Create app/tasks/[id]/page.tsx
- Individual task view
- Edit form integration
- Delete confirmation

### 8.4 Settings Page
- Create app/settings/page.tsx
- Theme toggle (optional)
- Language selector placeholder
- Reminder permission UI

## Phase 9: Integration and Polish

### 9.1 API Integration
- Wire all components to API client
- Handle loading states
- Handle error states
- Handle success feedback (Toast)

### 9.2 Responsive Polish
- Test on mobile (375px, 768px)
- Test on tablet (1024px)
- Test on desktop (1440px, 1920px)
- Adjust spacing, typography, layout
- Ensure clamp() scaling works

### 9.3 Accessibility
- Keyboard navigation (tab order)
- Focus states visible
- ARIA labels where needed
- Screen reader testing

### 9.4 Theme Consistency
- Verify all components use theme tokens
- No inline styles or hex codes
- Consistent spacing and typography
- Dark mode tokens working

## Architecture Decisions

### Component Architecture
- **Decision**: Use shadcn/ui primitives, not custom basic components
- **Rationale**: Faster development, accessibility built-in, consistent design
- **Trade-off**: Less customization, but sufficient for requirements

### Form Management
- **Decision**: Formik + Yup for all forms
- **Rationale**: Industry standard, good TypeScript support, validation before API calls
- **Trade-off**: Additional dependency, but provides structure

### Theme System
- **Decision**: CSS variables in globals.css, mapped to Tailwind
- **Rationale**: Centralized, easy to swap themes, no inline styles
- **Trade-off**: Slightly more setup, but better maintainability

### API Client Abstraction
- **Decision**: Typed API client stub with mock data
- **Rationale**: Frontend can work independently, easy to swap with real API
- **Trade-off**: Mock data may not match real API exactly, but acceptable for frontend-only work

### Responsive Strategy
- **Decision**: Mobile-first with clamp() for scaling
- **Rationale**: Works across all viewports, future-proof
- **Trade-off**: More complex than fixed breakpoints, but better UX

## Risk Analysis

### Risk 1: shadcn/ui Component Customization
- **Blast Radius**: Medium - affects all UI components
- **Mitigation**: Test component customization early, have fallback plan
- **Kill Switch**: Can revert to custom components if needed

### Risk 2: Formik + Next.js App Router Integration
- **Blast Radius**: Medium - affects all forms
- **Mitigation**: Research integration patterns, test early
- **Kill Switch**: Can use React Hook Form as alternative

### Risk 3: Theme Token System Complexity
- **Blast Radius**: Low - isolated to styling
- **Mitigation**: Start simple, expand tokens as needed
- **Kill Switch**: Can use Tailwind config directly if needed

### Risk 4: DejaVu Sans Font Availability
- **Blast Radius**: Low - typography only
- **Mitigation**: Have fallback fonts ready (Inter, Roboto)
- **Kill Switch**: Use system fonts or Google Fonts alternative

## Evaluation Criteria

- All components use shadcn/ui primitives
- All forms use Formik with validation
- Theme tokens centralized and used consistently
- Typography system properly configured
- Responsive design works on all target viewports
- Components are props-driven and reusable
- API client abstraction allows easy backend swap
- No inline styles or scattered hex codes
- Keyboard accessible
- Clear interactive states

