# Skill Activation Prompts

Use these prompts to explicitly activate Claude Code skills for Phase 2 development.

## For Complex Multi-Part Goals

**Prompt Template**:
```
Use the task-triage-orchestrator skill to break down this goal into chunks, 
research with Context7, and delegate to appropriate skills:

[Your goal here]

Example: "Use the task-triage-orchestrator skill to build a complete todo 
web application with authentication, priorities, search, and voice commands."
```

**Example**:
```
Use the task-triage-orchestrator skill to build Phase 2 of the todo app:
- Full-stack web application
- Next.js frontend with Better Auth
- FastAPI backend with JWT
- Neon PostgreSQL database
- All Basic, Intermediate, and Advanced features
- Bonus features (reusable intelligence, cloud-native blueprints, multi-language, voice)
```

## For Frontend Development

**Prompt Template**:
```
Use the frontend-sdd-orchestrator skill to build the frontend following 
SpecKit Plus workflow:

[Feature description]

Example: "Use the frontend-sdd-orchestrator skill to build the task list 
UI with filtering, sorting, and search functionality for Phase 2."
```

**Example**:
```
Use the frontend-sdd-orchestrator skill to implement the task management 
frontend for Phase 2:
- Task list with priorities and tags
- Search and filter UI
- Sort functionality
- Voice input component
- Multi-language support (English/Urdu)
```

## For Backend Development

**Prompt Template**:
```
Use the backend-sdd-orchestrator skill to build the backend following 
SpecKit Plus workflow:

[Feature description]

Example: "Use the backend-sdd-orchestrator skill to implement the REST API 
endpoints for task CRUD operations with JWT authentication."
```

**Example**:
```
Use the backend-sdd-orchestrator skill to implement the FastAPI backend for Phase 2:
- REST API endpoints for tasks
- JWT authentication middleware
- SQLModel database models
- Filter, search, and sort functionality
- Recurring tasks logic
```

## For Database Design

**Prompt Template**:
```
Use the database-sdd-orchestrator skill to design the database schema 
following SpecKit Plus workflow:

[Schema requirements]

Example: "Use the database-sdd-orchestrator skill to design the PostgreSQL 
schema for tasks with priorities, tags, due dates, and recurring patterns."
```

**Example**:
```
Use the database-sdd-orchestrator skill to design the Neon PostgreSQL 
database schema for Phase 2:
- Tasks table with all fields (priority, tags, due_date, recurring_pattern)
- Proper indexes for performance
- User isolation
- Migration strategy
```

## For Complete Phase 2 Implementation

**Full Prompt**:
```
Use the task-triage-orchestrator skill to build Phase 2 of the todo app:

Goal: Transform Phase 1 console app into full-stack web application

Requirements:
- Next.js 16+ frontend with Better Auth
- FastAPI backend with JWT authentication
- Neon PostgreSQL database
- All Basic Level features (web version)
- Intermediate features (priorities, tags, search, filter, sort)
- Advanced features (recurring tasks, due dates, reminders)
- Bonus features (reusable intelligence, cloud-native blueprints, 
  multi-language Urdu, voice commands)

The task-triage-orchestrator should:
1. Break this into logical chunks
2. Research each chunk with Context7
3. Delegate to appropriate orchestrators:
   - Database schema → database-sdd-orchestrator
   - Backend API → backend-sdd-orchestrator
   - Frontend UI → frontend-sdd-orchestrator
4. Coordinate execution across all chunks
```

## For Specific Features

### Authentication Feature
```
Use the backend-sdd-orchestrator skill to implement Better Auth integration 
with FastAPI JWT verification following SpecKit Plus workflow. Reference 
@specs/features/authentication.md for requirements.
```

### Priorities & Tags Feature
```
Use the frontend-sdd-orchestrator skill to implement priorities and tags 
UI components following SpecKit Plus workflow. Reference 
@specs/features/priorities-tags.md for requirements.
```

### Search & Filter Feature
```
Use the backend-sdd-orchestrator skill to implement search and filter 
API endpoints following SpecKit Plus workflow. Reference 
@specs/features/search-filter.md for requirements.
```

## Important Notes

1. **Always mention the skill name** - Explicitly state which skill to use
2. **Reference specs** - Use `@specs/features/[feature].md` syntax
3. **Follow SpecKit Plus** - Skills will automatically follow the workflow
4. **Context7 required** - Skills will use Context7 for latest docs
5. **Workflow guardrail** - The guardrail skill will validate compliance

## Skill Workflow Reminder

When using orchestrator skills, they will automatically:
1. Check/update constitution
2. Create specification (if needed)
3. Generate implementation plan
4. Break into testable tasks
5. Implement using domain skills
6. Use Context7 for latest patterns
7. Handle edge cases
8. Validate completion

## Example: Complete Feature Implementation

```
Use the task-triage-orchestrator skill to implement the recurring tasks 
feature for Phase 2:

1. Break into chunks:
   - Database schema updates
   - Backend API endpoints
   - Frontend UI components
   - Recurrence logic

2. For each chunk, use appropriate orchestrator:
   - Database → database-sdd-orchestrator
   - Backend → backend-sdd-orchestrator  
   - Frontend → frontend-sdd-orchestrator

3. Reference @specs/features/recurring-tasks.md for requirements

4. Use Context7 for latest patterns in each domain

5. Follow SpecKit Plus workflow for each chunk
```


