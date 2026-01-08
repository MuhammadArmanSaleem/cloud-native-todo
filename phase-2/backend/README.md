# Phase 2 Backend - FastAPI Todo API

## 🚀 Quick Start

**📖 For detailed step-by-step instructions, see [START_GUIDE.md](./START_GUIDE.md)**

### Quick Commands

1. **Navigate to backend directory**
   ```bash
   cd phase-2/backend
   ```

2. **Create `.env.local` file** with your database connection string:
   ```bash
   DATABASE_URL=bhag
   BETTER_AUTH_SECRET=your-secret-key-change-this-in-production
   ```

3. **Install Dependencies**
   ```bash
   uv sync  # or: pip install -e .
   ```

4. **Run the Server**
   ```bash
   uv run uvicorn main:app --reload --port 8000
   # or with pip: uvicorn main:app --reload --port 8000
   ```

5. **Test the API**
   - Health check: http://localhost:8000/health
   - API docs: http://localhost:8000/docs

## Database

- **Type**: Neon PostgreSQL (Serverless)
- **Connection**: Configured in `database.py`
- **ORM**: SQLModel (async)
- **Connection Pool**: Configured for serverless (pool_pre_ping=True)

See `DATABASE_SETUP.md` for detailed database configuration.

## API Endpoints

All endpoints require JWT authentication (Bearer token).

- `GET /api/tasks` - List all tasks (with filters)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle completion

## Authentication

Uses JWT tokens from Better Auth (frontend). The backend verifies tokens using the `BETTER_AUTH_SECRET` environment variable.

## Project Structure

```
backend/
├── main.py          # FastAPI app and routes
├── database.py      # Database connection and session
├── models.py        # SQLModel database models
├── auth.py         # JWT authentication logic
└── pyproject.toml  # Dependencies
```


