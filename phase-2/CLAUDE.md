# Todo App - Hackathon II Phase 2

## Project Overview

This is Phase 2 of the hackathon - a full-stack web application using GitHub Spec-Kit for spec-driven development with Claude Code.

## Spec-Kit Structure

Specifications are organized in `/specs`:

- `/specs/overview.md` - Project overview
- `/specs/architecture.md` - System architecture
- `/specs/features/` - Feature specs (what to build)
- `/specs/api/` - API endpoint and MCP tool specs
- `/specs/database/` - Schema and model specs
- `/specs/ui/` - Component and page specs

## How to Use Specs

1. Always read relevant spec before implementing
2. Reference specs with: `@specs/features/task-crud.md`
3. Update specs if requirements change
4. Follow SpecKit Plus workflow: constitution → spec → plan → tasks → implement

## Project Structure

- `/frontend` - Next.js 16+ app (App Router)
- `/backend` - Python FastAPI server
- `/specs` - All specifications

## Technology Stack

- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLModel, Neon PostgreSQL
- **Auth**: Better Auth with JWT tokens
- **Database**: Neon Serverless PostgreSQL

## Development Workflow

**IMPORTANT**: Always use orchestrator skills for implementation!

1. Read spec: `@specs/features/[feature].md`
2. **Use appropriate orchestrator skill**:
   - Complex goals → `task-triage-orchestrator`
   - Frontend → `frontend-sdd-orchestrator`
   - Backend → `backend-sdd-orchestrator`
   - Database → `database-sdd-orchestrator`
3. Skills will automatically:
   - Follow SpecKit Plus workflow
   - Use Context7 for latest patterns
   - Handle edge cases
   - Delegate to domain skills
4. Test and iterate

**Example Prompt**:
```
Use the backend-sdd-orchestrator skill to implement the task CRUD API 
following SpecKit Plus workflow. Reference @specs/features/task-crud.md
```

See `SKILL-ACTIVATION-PROMPTS.md` and `QUICK-START-PROMPTS.md` for detailed prompt templates.

## Commands

- **Frontend**: `cd frontend && npm run dev`
- **Backend**: `cd backend && uvicorn main:app --reload`
- **Database**: Use Neon PostgreSQL (connection string in `.env`)

## Authentication Flow

1. User logs in on Frontend → Better Auth creates session and issues JWT token
2. Frontend makes API call → Includes JWT token in `Authorization: Bearer <token>` header
3. Backend receives request → Extracts and verifies JWT token
4. Backend identifies user → Decodes token to get user ID
5. Backend filters data → Returns only tasks belonging to that user

## Security

- All API endpoints require valid JWT token
- Requests without token receive 401 Unauthorized
- Each user only sees/modifies their own tasks
- Task ownership enforced on every operation
- Shared secret: `BETTER_AUTH_SECRET` (same in frontend and backend)

## Available Skills

This project uses custom Claude Code skills (located in `.claude/skills/`):
- `task-triage-orchestrator` - For complex multi-part goals
- `frontend-sdd-orchestrator` - For frontend development
- `backend-sdd-orchestrator` - For backend development
- `database-sdd-orchestrator` - For database design
- `workflow-guardrail` - Validates workflow compliance

**Note**: Skills are in `.claude/skills/` at project root. Use natural language 
to activate them (e.g., "Use the frontend-sdd-orchestrator skill..."). 
Do NOT use `/skill-name` syntax.

## Skill Activation

**IMPORTANT**: To use these skills, explicitly mention them in your prompts.

### For Complete Phase 2 Implementation:
```
Use the task-triage-orchestrator skill to build Phase 2 of the todo app:
- Full-stack web application with Next.js and FastAPI
- All Basic, Intermediate, and Advanced features
- Bonus features (reusable intelligence, cloud-native blueprints, 
  multi-language, voice commands)
```

### For Frontend Features:
```
Use the frontend-sdd-orchestrator skill to implement [feature name] 
following SpecKit Plus workflow. Reference @specs/features/[feature].md
```

### For Backend Features:
```
Use the backend-sdd-orchestrator skill to implement [feature name] 
following SpecKit Plus workflow. Reference @specs/features/[feature].md
```

### For Database Design:
```
Use the database-sdd-orchestrator skill to design the database schema 
following SpecKit Plus workflow. Reference @specs/database/schema.md
```

See `SKILL-ACTIVATION-PROMPTS.md` for detailed prompt templates.

## Features to Implement

### Basic Level
- Task CRUD operations (web version)
- User authentication

### Intermediate Level
- Priorities & Tags/Categories
- Search & Filter
- Sort Tasks

### Advanced Level
- Recurring Tasks
- Due Dates & Time Reminders

### Bonus Points
- Reusable Intelligence (Claude Code Skills)
- Cloud-Native Blueprints
- Multi-language Support (Urdu)
- Voice Commands

