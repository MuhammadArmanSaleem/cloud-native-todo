# Project Constitution: Hackathon II: The Evolution of Todo - Phase II

<!-- Sync Impact Report:
Version change: 2.0.0 → 2.1.0
List of modified principles: 
  - IV. Component-Based Frontend Architecture → IV. Techy-Minimalist Frontend Architecture (expanded with shadcn/ui, Formik, theme tokens, typography)
Added sections: 
  - Theme Token System (in Additional Constraints)
  - Typography System (in Additional Constraints)
  - Form Validation Framework (in Additional Constraints)
  - Responsive Design System (in Additional Constraints)
Removed sections: N/A
Templates requiring updates: 
  - ⚠ pending: plan-template.md (if exists)
  - ⚠ pending: spec-template.md (if exists)
  - ⚠ pending: tasks-template.md (if exists)
Follow-up TODOs: None
-->

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All implementation must be generated through Claude Code based on specifications; Specifications must be precise, testable, and complete before implementation generation; All development follows SpecKit Plus workflow (constitution → spec → plan → tasks → implement).
<!-- Rationale: Ensures deterministic, specification-based development with full traceability -->

### II. Full-Stack Web Application Architecture
Frontend and backend are separate services communicating via REST API with JWT authentication; Frontend uses Next.js 16+ App Router with TypeScript; Backend uses FastAPI with SQLModel; Database uses Neon Serverless PostgreSQL.
<!-- Rationale: Modern, scalable architecture with clear separation of concerns -->

### III. User Authentication and Security
All API endpoints require JWT authentication; User data is isolated per authenticated user; Input validation and sanitization on both frontend and backend; Modern password hashing (Argon2, bcrypt, scrypt) with unique salts.
<!-- Rationale: Ensures secure, multi-user application with proper data isolation -->

### IV. Techy-Minimalist Frontend Architecture
Frontend uses Next.js 16+ App Router with Server and Client Components; All components use TypeScript with explicit prop interfaces; Data rendering uses maps with proper keys; UI built with shadcn/ui primitives (no custom basic components); All forms use Formik with Yup/Zod validation; Design follows "Tech Innovation" aesthetic with centralized theme tokens; Typography uses next/font with CSS variables; Components are props-driven and content-agnostic (no hardcoded data); Responsive design with mobile-first approach and clamp() for scaling.
<!-- Rationale: Maintainable, type-safe frontend with consistent design system, accessible components, and future-ready architecture -->

### V. API-First Backend Design
Backend provides RESTful API with clear endpoint structure; All endpoints follow OpenAPI standards; Request/response validation using Pydantic; Comprehensive error handling with proper HTTP status codes.
<!-- Rationale: Clean API design enables frontend flexibility and future integrations -->

### VI. Database Schema and Migrations
Database schema designed with proper relationships, constraints, and indexes; All schema changes use versioned migrations; Data integrity enforced at database level; Performance optimized with appropriate indexes.
<!-- Rationale: Reliable data storage with proper integrity and performance -->

### VII. Form Validation and Security
Client-side validation prevents invalid API calls; Input sanitization prevents XSS and injection attacks; Security checks before data reaches backend; Validation reduces API costs and improves UX.
<!-- Rationale: Security-first approach with cost optimization -->

## Additional Constraints

**Technology Stack**: 
- Frontend: Next.js 16+ App Router, React 18+, TypeScript 5+, Tailwind CSS 3+, shadcn/ui, Formik, Yup/Zod
- Backend: Python 3.13+, FastAPI, SQLModel, asyncpg
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- Package Management: npm/uv, Spec-Kit Plus, Claude Code

**Theme Token System**:
- Centralized design tokens in `globals.css` using CSS variables
- Base theme: Electric Blue (#0066ff), Neon Cyan (#00ffff), Dark Gray (#1e1e1e), White (#ffffff)
- Extended tokens: muted, border, ring, destructive, success, warning, card, popover
- Dark mode tokens (dark-first design)
- All tokens mapped in `tailwind.config.ts` for Tailwind integration
- No inline styles or scattered hex codes; only theme tokens

**Typography System**:
- Primary font (Headings): DejaVu Sans Bold (or closest web-available substitute)
- Secondary font (Body/UI): DejaVu Sans (or closest substitute)
- Use `next/font` for font loading
- CSS variables: `--font-heading`, `--font-body`
- Tailwind font families reference CSS variables
- Responsive typography with clamp() or 2xl scaling rules

**Form Validation Framework**:
- All forms use Formik with Yup or Zod validation
- Validation schemas in `/lib/validators/` with reusable schemas
- Client-side validation BEFORE API calls (reduces costs, improves UX)
- Form components are reusable with `initialValues` and `onSubmit` props
- No validation logic in component files; all in validator schemas

**Responsive Design System**:
- Mobile-first design with md/lg/xl/2xl breakpoints
- Avoid fixed px sizing that feels small on 1920+ displays
- Use clamp() for key typography/spacing or provide 2xl scaling rules
- Consistent container utility: centered layout, max-width responsive, responsive padding
- Layout balanced at 1440px and 1920px viewports

**Development Standards**:
- Follow Next.js App Router best practices
- Use TypeScript throughout with proper type definitions
- Implement client-side form validation with Formik + Yup/Zod
- Use shadcn/ui primitives (do not reinvent basic components)
- Follow FastAPI best practices for API design
- Use SQLModel for database operations
- Maintain specification history in `/specs-history`
- Create PHR (Prompt History Records) for all work
- All components props-driven; no hardcoded content
- Lists rendered via map() from arrays with stable IDs
- UI behavior isolated: presentational components receive callbacks from containers

## Development Workflow

**SpecKit Plus Workflow**: 
1. Constitution → Establish/update principles
2. Specification → Create feature specs with user stories
3. Planning → Create technical plans with Context7 research
4. Tasks → Break into testable, dependency-ordered tasks
5. Implementation → Execute tasks following skill patterns
6. Analysis → Validate against spec and requirements

All specifications must be stored with `@specs/...` path references. Each specification iteration must be dated/timestamped for traceability. PHR records must be created for all work phases.

## Governance

This constitution supersedes all other development practices for Phase II; All implementation must comply with constitutional principles; Amendments require explicit documentation and approval before implementation; All development must follow the spec-driven workflow outlined in this constitution.

**Version**: 2.1.0 | **Ratified**: 2025-01-05 | **Last Amended**: 2025-01-27

