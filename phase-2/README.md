# Phase II: Todo Full-Stack Web Application

## Overview

Transform the Phase I console app into a modern multi-user web application with persistent storage, implementing Basic, Intermediate, and Advanced level features plus bonus points.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth with JWT |
| Spec-Driven | Claude Code + Spec-Kit Plus |

## Features to Implement

### Basic Level (Core Essentials)
- [x] Add Task – Create new todo items
- [x] Delete Task – Remove tasks from the list
- [x] Update Task – Modify existing task details
- [x] View Task List – Display all tasks
- [x] Mark as Complete – Toggle task completion status

### Intermediate Level (Organization & Usability)
- [ ] Priorities & Tags/Categories – Assign levels (high/medium/low) or labels (work/home)
- [ ] Search & Filter – Search by keyword; filter by status, priority, or date
- [ ] Sort Tasks – Reorder by due date, priority, or alphabetically

### Advanced Level (Intelligent Features)
- [ ] Recurring Tasks – Auto-reschedule repeating tasks (e.g., "weekly meeting")
- [ ] Due Dates & Time Reminders – Set deadlines with date/time pickers; browser notifications

### Bonus Points
- [ ] Reusable Intelligence – Create and use reusable intelligence via Claude Code Subagents and Agent Skills (+200)
- [ ] Cloud-Native Blueprints – Create and use Cloud-Native Blueprints via Agent Skills (+200)
- [ ] Multi-language Support – Support Urdu in chatbot (+100)
- [ ] Voice Commands – Add voice input for todo commands (+100)

## Project Structure

```
phase-2/
├── .spec-kit/           # Spec-Kit configuration
│   └── config.yaml
├── specs/               # Spec-Kit managed specifications
│   ├── overview.md
│   ├── architecture.md
│   ├── features/       # Feature specifications
│   ├── api/            # API specifications
│   ├── database/       # Database specifications
│   └── ui/             # UI specifications
├── frontend/           # Next.js application
├── backend/            # FastAPI application
├── CLAUDE.md          # Root Claude Code instructions
└── README.md          # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.13+
- Neon PostgreSQL database account
- UV package manager

### Setup

1. **Frontend Setup**:
```bash
cd phase-2/frontend
npm install
npm run dev
```

2. **Backend Setup**:
```bash
cd phase-2/backend
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uv sync
uvicorn main:app --reload
```

3. **Environment Variables**:
- Create `.env.local` in frontend/
- Create `.env` in backend/
- Set `BETTER_AUTH_SECRET` (same in both)
- Set `DATABASE_URL` (Neon PostgreSQL)

## Development Workflow

1. Read spec: `@specs/features/[feature].md`
2. Implement backend: `@backend/CLAUDE.md`
3. Implement frontend: `@frontend/CLAUDE.md`
4. Test and iterate

## API Endpoints

All endpoints require JWT token: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks for authenticated user |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/{id}` | Get task details |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion |

## Authentication

- Better Auth handles signup/signin on frontend
- JWT tokens issued on login
- FastAPI backend verifies JWT tokens
- All API requests filtered by authenticated user

## Spec-Driven Development

This project uses Spec-Kit Plus for spec-driven development. All specifications are in `/specs/` directory and can be referenced with `@specs/...` syntax.

## Using Claude Code Skills

**IMPORTANT**: To use the orchestrator skills, explicitly mention them in your prompts.

### Quick Start Prompt:
```
Use the task-triage-orchestrator skill to build Phase 2 of the todo app:
- Full-stack web application
- All Basic, Intermediate, and Advanced features
- Bonus features
```

### For Specific Features:
- Frontend: "Use the frontend-sdd-orchestrator skill to implement [feature]..."
- Backend: "Use the backend-sdd-orchestrator skill to implement [feature]..."
- Database: "Use the database-sdd-orchestrator skill to design [schema]..."

See `SKILL-ACTIVATION-PROMPTS.md` and `QUICK-START-PROMPTS.md` for detailed prompt templates.

