# Backend Guidelines - Phase II

## Stack

- **Framework**: FastAPI
- **Language**: Python 3.13+
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT token verification

## Project Structure

```
backend/
├── main.py            # FastAPI app entry point
├── models.py          # SQLModel database models
├── schemas.py         # Pydantic request/response models
├── routes/            # API route handlers
│   ├── tasks.py      # Task endpoints
│   └── auth.py       # Auth utilities
├── db.py             # Database connection
├── auth.py           # JWT verification
└── config.py         # Configuration
```

## API Conventions

- All routes under `/api/`
- Return JSON responses
- Use Pydantic models for request/response validation
- Handle errors with `HTTPException`
- Use proper HTTP status codes

## Database

- Use SQLModel for all database operations
- Connection string from environment variable: `DATABASE_URL`
- All queries filtered by `user_id` (from JWT token)
- Use migrations for schema changes

## Authentication

### JWT Verification

All protected routes must verify JWT token:

```python
from fastapi import Depends, HTTPException
from .auth import get_current_user

@app.get("/api/tasks")
async def get_tasks(current_user: dict = Depends(get_current_user)):
    # current_user contains user info from JWT token
    user_id = current_user["id"]
    # Filter tasks by user_id
    tasks = get_tasks_by_user(user_id)
    return tasks
```

### User Isolation

- All database queries must filter by `user_id`
- Never return data from other users
- Enforce ownership on all operations

## Models

Use SQLModel for database models:

```python
from sqlmodel import SQLModel, Field

class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    title: str = Field(max_length=200)
    description: str | None = None
    completed: bool = Field(default=False)
    # ... other fields
```

## Error Handling

```python
from fastapi import HTTPException

# Not found
raise HTTPException(status_code=404, detail="Task not found")

# Unauthorized
raise HTTPException(status_code=401, detail="Invalid token")

# Validation error
raise HTTPException(status_code=422, detail="Validation error")
```

## Security

- Validate all input with Pydantic
- Sanitize user input (prevent SQL injection, XSS)
- Use parameterized queries (SQLModel handles this)
- Implement RBAC if needed
- Follow security patterns from `fastapi-backend` skill

## Running

```bash
cd backend
uvicorn main:app --reload --port 8000
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Shared secret for JWT (same as frontend)

## Best Practices

1. **Type Safety**: Use Pydantic for validation
2. **Error Handling**: Proper HTTP status codes
3. **Security**: Input validation, SQL injection prevention
4. **Performance**: Use database indexes, optimize queries
5. **Testing**: Write tests for all endpoints

## Available Skills

When building backend features:
- Use `backend-sdd-orchestrator` for complete features
- Follow SpecKit Plus workflow
- Use Context7 for latest FastAPI patterns
- Reference `fastapi-backend` skill patterns

