# Specification: Frontend Bootstrap + Theme + App Shell (Todo UI)

## Feature Description

Bootstrap the frontend project and implement the global design system and app shell for a techy minimalist Todo application UI. This includes project initialization, theme token system, typography configuration, and the foundational app shell components (header, sidebar, mobile navigation). This is strictly implementation work - no planning or redesign.

## User Scenarios & Testing

### Scenario 1: Application Bootstrap
**As a developer**, I need the frontend project properly initialized so I can build features on a solid foundation.

**Given** the frontend directory exists
**When** I run the development server
**Then** the application boots successfully with Next.js App Router
**And** TypeScript compilation succeeds
**And** Tailwind CSS styles are applied
**And** shadcn/ui components are available
**And** Formik and Yup are installed and configured

### Scenario 2: Theme System Application
**As a user**, I see a consistent dark, techy, minimalist design throughout the application.

**Given** I open the application
**When** I view any page
**Then** the "Tech Innovation" theme is active
**And** Electric Blue (#0066ff) is used for primary actions
**And** Neon Cyan (#00ffff) is used for accents
**And** Dark Gray (#1e1e1e) is the background
**And** White (#ffffff) is used for foreground text
**And** no raw hex colors appear in component files

### Scenario 3: Typography Rendering
**As a user**, I see consistent typography that matches the techy aesthetic.

**Given** I view any page
**When** I see headings and body text
**Then** headings use DejaVu Sans Bold (or closest substitute)
**And** body text uses DejaVu Sans (or closest substitute)
**And** fonts are loaded via next/font
**And** fonts are referenced through CSS variables

### Scenario 4: App Shell Navigation (Desktop)
**As a user on desktop**, I can navigate the application using the sidebar.

**Given** I am on a desktop viewport (≥1024px)
**When** I view the application
**Then** I see a left sidebar with navigation links
**And** I see a header with app logo/title, search input, add task button, and user menu
**And** navigation links come from a configuration object (not hardcoded)
**And** I can click navigation links to navigate between pages

### Scenario 5: App Shell Navigation (Mobile)
**As a user on mobile**, I can navigate the application using mobile-friendly controls.

**Given** I am on a mobile viewport (<1024px)
**When** I view the application
**Then** the sidebar is hidden
**And** I see a mobile navigation (bottom nav or drawer)
**And** I see a header with essential controls
**And** I can open the mobile navigation to access all pages
**And** navigation works with touch interactions

### Scenario 6: Responsive Layout
**As a user**, the application layout adapts to my screen size.

**Given** I view the application
**When** I resize my browser or view on different devices
**Then** the layout uses a centered container utility
**And** spacing and typography scale appropriately
**And** the layout looks balanced at 1440px and 1920px viewports
**And** no fixed pixel heights cause layout issues

## Functional Requirements

### Project Bootstrap
- Next.js 16+ App Router must be initialized in `/frontend` directory
- TypeScript must be configured and working
- Tailwind CSS must be installed and configured
- shadcn/ui must be installed and initialized (no demo components generated)
- Formik and Yup (or Zod adapter) must be installed and configured
- All dependencies must be properly installed and compatible

### Theme Token System
- Centralized theme system using CSS variables in `globals.css`
- Theme tokens mapped into `tailwind.config.ts` for semantic class usage
- Theme style: "Tech Innovation" (dark, techy, minimalist)
- Color palette implemented as tokens:
  - Primary: Electric Blue (#0066ff)
  - Accent: Neon Cyan (#00ffff)
  - Background: Dark Gray (#1e1e1e)
  - Foreground: White (#ffffff)
  - Extended tokens: muted, border, ring, destructive, success, warning, card, popover
- Light and dark mode tokens prepared (dark-first)
- No raw hex colors inside component files
- All colors must come from theme tokens

### Typography System
- Fonts configured using `next/font`
- Primary font (headings): DejaVu Sans Bold or closest available substitute
- Secondary font (body/UI): DejaVu Sans or closest available substitute
- Fonts bound via CSS variables: `--font-heading`, `--font-body`
- Tailwind font families configured to reference CSS variables
- Fonts can be swapped later from one place

### Global Layout (App Shell)
- `app/layout.tsx` implemented with:
  - Font variables applied globally
  - Theme styles applied globally
  - AppShell component that wraps all pages
- Layout provides consistent structure for all pages

### App Shell Components
- **Header Component**:
  - App logo/title
  - "Add Task" action button (UI only, no functionality)
  - Search input (UI only, no functionality)
  - User menu placeholder
  - Mobile-first responsive design
  - Uses shadcn/ui primitives (Button, Input, DropdownMenu)

- **Sidebar Component** (Desktop):
  - Left sidebar visible on desktop (≥1024px)
  - Navigation links (Tasks, Settings)
  - Navigation data from configuration object (no hardcoded copy)
  - Uses shadcn/ui components
  - Hidden on mobile

- **Mobile Navigation**:
  - Bottom nav or drawer pattern for mobile (<1024px)
  - All navigation links accessible
  - Uses shadcn/ui Sheet component
  - Touch-friendly interactions
  - Hidden on desktop

### Responsiveness & Layout Rules
- Reusable container utility for centered layout
- Spacing and typography scale well at 1440px and 1920px
- No fixed heights or brittle pixel layouts
- Use clamp() or responsive Tailwind utilities where needed
- Mobile-first approach throughout

### Component Architecture Rules
- Components must be reusable and props-driven
- No hardcoded content inside components
- Navigation data must come from configuration objects
- Use semantic HTML
- Accessible navigation (keyboard, screen readers)
- Use shadcn/ui primitives (do not reinvent basic components)

## Success Criteria

- Application boots successfully without errors
- Dark techy theme is active using Electric Blue + Neon Cyan accents
- Fonts are correctly applied via CSS variables and can be swapped from one place
- Header and navigation render correctly on mobile and desktop viewports
- App shell is ready for task-related UI to be added next
- All theme colors come from tokens (no raw hex codes in components)
- Responsive layout works at 1440px, 1920px, and mobile sizes
- Navigation is accessible via keyboard and screen readers
- No hardcoded content in components (all from configuration)

## Key Entities

### Navigation Configuration
- Navigation items structure (label, href, icon?)
- Stored in configuration file (e.g., `content/navigation.ts`)

### Theme Tokens
- CSS variables for colors, spacing, typography
- Mapped to Tailwind config for semantic usage

### Font Configuration
- Font definitions via next/font
- CSS variables for font families
- Tailwind font family mappings

## Edge Cases

- Very small mobile viewports (<375px): Navigation must remain usable
- Very large desktop viewports (>2560px): Layout must not break, typography scales appropriately
- Font loading failure: Fallback fonts must be available
- Theme token missing: Default values must be defined
- Navigation config empty: Empty state must be handled gracefully
- JavaScript disabled: Basic HTML structure must still render

## Assumptions

- Next.js 16+ is the target version
- TypeScript 5+ is available
- Node.js 18+ is available for development
- DejaVu Sans or a suitable substitute is available (Inter or Roboto as fallback)
- shadcn/ui components are compatible with Next.js 16 App Router
- Formik and Yup are compatible with React 18+
- Dark mode is the primary theme (light mode tokens prepared but not required initially)
- Navigation structure is simple (Tasks, Settings) and can be extended later
- No backend API calls needed for this phase (UI only)

## Out of Scope

- Task CRUD functionality (separate feature)
- Form validation logic (Formik setup only)
- API integration (placeholder/mock only)
- Authentication flow (user menu is placeholder)
- Search functionality (search input is UI only)
- Add task functionality (button is UI only)
- Settings page content (navigation link only)
- Backend changes
- Database work
- API implementation beyond placeholders

