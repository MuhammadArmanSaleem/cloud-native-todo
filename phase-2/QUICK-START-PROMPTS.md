# Quick Start Prompts for Phase 2

Copy and paste these prompts to start Phase 2 development with skills.

## 🚀 Complete Phase 2 Setup

```
Use the task-triage-orchestrator skill to build Phase 2 of the todo app:

Goal: Transform Phase 1 console app into full-stack web application

Break this into chunks and delegate to appropriate orchestrators:
1. Database schema design (Neon PostgreSQL)
2. Backend API (FastAPI with JWT)
3. Frontend UI (Next.js with Better Auth)
4. All features (Basic, Intermediate, Advanced, Bonus)

Reference @specs/overview.md and @specs/architecture.md for requirements.
Use Context7 for latest patterns in each domain.
Follow SpecKit Plus workflow for each chunk.
```

## 📊 Database Setup

```
Use the database-sdd-orchestrator skill to design the Neon PostgreSQL 
database schema for Phase 2 following SpecKit Plus workflow.

Requirements:
- Tasks table with all fields (priority, tags, due_date, recurring_pattern)
- User isolation
- Proper indexes
- Migration strategy

Reference @specs/database/schema.md for detailed schema requirements.
Use Context7 for latest PostgreSQL patterns.
```

## 🔧 Backend API Setup

```
Use the backend-sdd-orchestrator skill to implement the FastAPI backend 
for Phase 2 following SpecKit Plus workflow.

Requirements:
- REST API endpoints for tasks
- JWT authentication middleware
- SQLModel database models
- Filter, search, and sort functionality

Reference @specs/api/rest-endpoints.md for API specification.
Reference @specs/features/task-crud.md for feature requirements.
Use Context7 for latest FastAPI patterns.
```

## 🎨 Frontend UI Setup

```
Use the frontend-sdd-orchestrator skill to implement the Next.js frontend 
for Phase 2 following SpecKit Plus workflow.

Requirements:
- Task list with priorities and tags
- Search and filter UI
- Sort functionality
- Better Auth integration
- Responsive design

Reference @specs/ui/components.md for component specifications.
Reference @specs/features/task-crud.md for feature requirements.
Use Context7 for latest Next.js patterns.
```

## 🔐 Authentication Feature

```
Use the backend-sdd-orchestrator skill to implement Better Auth integration 
with FastAPI JWT verification following SpecKit Plus workflow.

Requirements:
- JWT token verification middleware
- User extraction from token
- User isolation on all endpoints

Reference @specs/features/authentication.md for requirements.
Use Context7 for latest JWT and FastAPI authentication patterns.
```

## 🏷️ Priorities & Tags Feature

```
Use the frontend-sdd-orchestrator skill to implement priorities and tags 
UI components following SpecKit Plus workflow.

Requirements:
- Priority selector (high/medium/low)
- Tag input with autocomplete
- Visual indicators

Reference @specs/features/priorities-tags.md for requirements.
Use Context7 for latest Next.js component patterns.
```

## 🔍 Search & Filter Feature

```
Use the backend-sdd-orchestrator skill to implement search and filter 
API endpoints following SpecKit Plus workflow.

Requirements:
- Search by keyword
- Filter by status, priority, tags
- Combined filters

Reference @specs/features/search-filter.md for requirements.
Use Context7 for latest FastAPI query patterns.
```

## 📅 Recurring Tasks Feature

```
Use the task-triage-orchestrator skill to implement recurring tasks feature:

Break into chunks:
1. Database schema (recurring_pattern, next_occurrence)
2. Backend logic (auto-reschedule)
3. Frontend UI (recurrence selector)

Delegate to:
- Database → database-sdd-orchestrator
- Backend → backend-sdd-orchestrator
- Frontend → frontend-sdd-orchestrator

Reference @specs/features/recurring-tasks.md for requirements.
```

## 🎤 Voice Commands Feature

```
Use the frontend-sdd-orchestrator skill to implement voice commands 
following SpecKit Plus workflow.

Requirements:
- Web Speech API integration
- Voice input for task creation
- Voice commands for operations

Reference @specs/features/voice-commands.md for requirements.
Use Context7 for latest Web Speech API patterns.
```

## 🌐 Multi-Language Feature

```
Use the frontend-sdd-orchestrator skill to implement Urdu language support 
following SpecKit Plus workflow.

Requirements:
- i18n integration
- Urdu translations
- RTL layout support

Reference @specs/features/multi-language.md for requirements.
Use Context7 for latest Next.js i18n patterns.
```

## 💡 Tips

1. **Always mention the skill name** - "Use the [skill-name] skill..."
2. **Reference specs** - Use `@specs/features/[feature].md`
3. **Request Context7** - Skills will use it automatically, but you can mention it
4. **Follow workflow** - Skills will follow SpecKit Plus automatically
5. **Be specific** - Describe what you want clearly

## Example: Feature-by-Feature

```
For Phase 2, implement features one by one using appropriate orchestrators:

1. First, use database-sdd-orchestrator for schema design
2. Then, use backend-sdd-orchestrator for API endpoints
3. Finally, use frontend-sdd-orchestrator for UI components

Start with: Use the database-sdd-orchestrator skill to design the database 
schema for Phase 2. Reference @specs/database/schema.md
```


