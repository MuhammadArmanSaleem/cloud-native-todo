# System Architecture - Phase II

## Architecture Overview

Full-stack web application with separate frontend and backend services communicating via REST API with JWT authentication.

## System Components

### Frontend (Next.js)
- **Location**: `/frontend`
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **API Client**: Custom API client with JWT token handling

### Backend (FastAPI)
- **Location**: `/backend`
- **Framework**: FastAPI
- **Language**: Python 3.13+
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT token verification

### Database (Neon PostgreSQL)
- **Type**: Serverless PostgreSQL
- **Connection**: Via `DATABASE_URL` environment variable
- **ORM**: SQLModel for all database operations

## Authentication Architecture

### Flow
1. User logs in on Frontend → Better Auth creates session
2. Better Auth issues JWT token with user information
3. Frontend stores token and includes in API requests
4. Backend verifies JWT token on each request
5. Backend extracts user ID from token
6. Backend filters all operations by user ID

### Security
- JWT tokens signed with shared secret (`BETTER_AUTH_SECRET`)
- Tokens expire automatically (configurable, e.g., 7 days)
- Stateless authentication (no shared database sessions)
- User isolation enforced on all operations

## API Architecture

### RESTful Design
- Base URL: `/api`
- All endpoints require JWT authentication
- JSON request/response format
- Standard HTTP status codes

### Endpoint Structure
```
GET    /api/tasks              # List all tasks for user
POST   /api/tasks              # Create new task
GET    /api/tasks/{id}         # Get task details
PUT    /api/tasks/{id}         # Update task
DELETE /api/tasks/{id}         # Delete task
PATCH  /api/tasks/{id}/complete # Toggle completion
```

## Data Flow

1. **User Action** → Frontend component
2. **API Call** → Frontend API client (with JWT token)
3. **Request** → FastAPI backend
4. **Auth Check** → JWT verification middleware
5. **Database Query** → SQLModel (filtered by user_id)
6. **Response** → JSON data back to frontend
7. **UI Update** → React component re-render

## Database Schema

### Users Table (Better Auth managed)
- `id`: string (primary key)
- `email`: string (unique)
- `name`: string
- `created_at`: timestamp

### Tasks Table
- `id`: integer (primary key, auto-increment)
- `user_id`: string (foreign key → users.id)
- `title`: string (required, 1-200 chars)
- `description`: text (optional, max 1000 chars)
- `completed`: boolean (default false)
- `priority`: string (optional: "high", "medium", "low")
- `tags`: array of strings (optional)
- `due_date`: timestamp (optional)
- `recurring_pattern`: string (optional: "daily", "weekly", "monthly")
- `created_at`: timestamp
- `updated_at`: timestamp

### Indexes
- `tasks.user_id` (for filtering by user)
- `tasks.completed` (for status filtering)
- `tasks.priority` (for priority sorting)
- `tasks.due_date` (for date sorting)

## Deployment Architecture

### Development
- Frontend: `localhost:3000`
- Backend: `localhost:8000`
- Database: Neon serverless (cloud)

### Production (Future)
- Frontend: Vercel/Netlify
- Backend: Railway/Render/Fly.io
- Database: Neon PostgreSQL (production tier)

## Monorepo Structure

```
phase-2/
├── frontend/          # Next.js app
├── backend/           # FastAPI app
├── specs/             # Specifications
└── .spec-kit/         # Spec-Kit config
```

Benefits:
- Single context for Claude Code
- Cross-cutting changes easier
- Shared specifications
- Unified development workflow

