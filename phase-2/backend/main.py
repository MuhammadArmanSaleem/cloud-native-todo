from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from typing import Optional, List, AsyncGenerator
import os
import uuid
from sqlmodel import SQLModel, Field, select
from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime, timedelta
from pydantic import BaseModel
import better_exceptions
from dotenv import load_dotenv

# Load environment variables from .env.local (or .env as fallback)
load_dotenv(".env.local")  # Try .env.local first
load_dotenv()  # Fallback to .env if .env.local doesn't exist

# Enable better exceptions for debugging
better_exceptions.hook()

# Database setup - import from database.py
from database import async_engine

# Pydantic models for request/response validation
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: Optional[str] = None  # "high", "medium", "low"
    tags: Optional[List[str]] = []
    due_date: Optional[datetime] = None
    reminder_time: Optional[datetime] = None
    recurring_pattern: Optional[str] = None  # "daily", "weekly", "monthly"

class TaskCreate(TaskBase):
    title: str

class TaskUpdate(TaskBase):
    title: Optional[str] = None

class TaskResponse(TaskBase):
    id: int
    user_id: str
    next_occurrence: Optional[datetime] = None
    original_task_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

# Import database session and auth
from database import get_async_session, AsyncSessionLocal
from auth import get_current_user, get_current_user_optional, TokenData, create_access_token
from models import Task as TaskModel, User as UserModel

# Lifespan to handle startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Create database tables on startup
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        print("✅ Database connection successful and tables created/verified")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("⚠️  Please check your DATABASE_URL in .env.local file")
        print("⚠️  The server will start but database operations will fail")
        # Don't raise - allow server to start for health checks
        # This allows the API to be tested even if database is not configured
    yield
    # Cleanup on shutdown if needed

# Create FastAPI app with lifespan
app = FastAPI(
    title="Todo API",
    description="API for the Todo application",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware (must list origins when allow_credentials=True; * is not allowed with credentials)
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Better Auth–compatible endpoints (so frontend Better Auth client gets 200)
class SignInBody(BaseModel):
    email: str
    password: str


class SignUpBody(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


def _token_from_request(request: Request) -> Optional[str]:
    auth = request.headers.get("Authorization")
    if auth and auth.startswith("Bearer "):
        return auth[7:]
    cookie = request.cookies.get("better-auth.session_token")
    if cookie:
        return cookie
    return None


@app.get("/api/auth/get-session")
async def get_session(
    request: Request,
    current_user: Optional[TokenData] = Depends(get_current_user_optional),
    session: AsyncSession = Depends(get_async_session),
):
    """Return current session for Better Auth client; 200 with null if unauthenticated."""
    token = _token_from_request(request)
    if not token and not current_user:
        return None
    if not current_user and token:
        try:
            import jwt
            from auth import SECRET_KEY, ALGORITHM
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id:
                current_user = TokenData(user_id=user_id, email=payload.get("email"))
        except Exception:
            return None
    if not current_user:
        return None
    result = await session.execute(
        select(UserModel).where(UserModel.id == current_user.user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        return None
    return {
        "user": {"id": user.id, "email": user.email, "name": user.name},
        "session": {"token": token or create_access_token({"sub": user.id, "email": user.email}, timedelta(days=7))},
    }


SESSION_COOKIE = "better-auth.session_token"
SESSION_AGE_DAYS = 7

def _auth_response(user: dict, token: str):
    """JSON response with session cookie so browser sends it on get-session."""
    resp = JSONResponse(content={
        "user": user,
        "session": {"token": token},
    })
    resp.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        max_age=86400 * SESSION_AGE_DAYS,
        path="/",
        httponly=True,
        samesite="lax",
    )
    return resp


@app.post("/api/auth/sign-in/email")
async def sign_in_email(
    body: SignInBody,
    session: AsyncSession = Depends(get_async_session),
):
    """Sign in by email; returns user + session token and sets session cookie."""
    result = await session.execute(select(UserModel).where(UserModel.email == body.email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token({"sub": user.id, "email": user.email}, timedelta(days=SESSION_AGE_DAYS))
    return _auth_response(
        {"id": user.id, "email": user.email, "name": user.name},
        token,
    )


@app.post("/api/auth/sign-up/email")
async def sign_up_email(
    body: SignUpBody,
    session: AsyncSession = Depends(get_async_session),
):
    """Sign up by email; creates user and returns session + session cookie."""
    result = await session.execute(select(UserModel).where(UserModel.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = UserModel(id=str(uuid.uuid4()), email=body.email, name=body.name or None)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    token = create_access_token({"sub": user.id, "email": user.email}, timedelta(days=SESSION_AGE_DAYS))
    return _auth_response(
        {"id": user.id, "email": user.email, "name": user.name},
        token,
    )


@app.post("/api/auth/sign-out")
async def sign_out():
    """Sign out; clear session cookie and return 200."""
    resp = JSONResponse(content={})
    resp.delete_cookie(SESSION_COOKIE, path="/")
    return resp

# Task endpoints
@app.get("/api/tasks")
async def list_tasks(
    status: Optional[str] = None,  # "all" | "pending" | "completed"
    priority: Optional[str] = None,  # "high" | "medium" | "low" (can be multiple comma-separated)
    tags: Optional[str] = None,  # comma-separated tag list
    search: Optional[str] = None,  # keyword search
    sort: Optional[str] = None,  # "created_at" | "due_date" | "priority" | "title"
    order: Optional[str] = "desc",  # "asc" | "desc"
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """List all tasks for the authenticated user with filtering and sorting"""
    from sqlmodel import and_, or_
    
    # Base query - filter by user
    statement = select(TaskModel).where(TaskModel.user_id == current_user.user_id)
    
    # Filter by status
    if status == "pending":
        statement = statement.where(TaskModel.completed == False)
    elif status == "completed":
        statement = statement.where(TaskModel.completed == True)
    # "all" or None shows all tasks
    
    # Filter by priority
    if priority:
        priorities = [p.strip() for p in priority.split(",")]
        statement = statement.where(TaskModel.priority.in_(priorities))
    
    # Filter by tags (PostgreSQL array contains)
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
        # PostgreSQL array overlap operator
        from sqlalchemy import func
        statement = statement.where(func.array_overlap(TaskModel.tags, tag_list))
    
    # Search by keyword (title or description)
    if search:
        search_term = f"%{search}%"
        statement = statement.where(
            or_(
                TaskModel.title.ilike(search_term),
                TaskModel.description.ilike(search_term)
            )
        )
    
    # Sort
    if sort == "due_date":
        if order == "asc":
            statement = statement.order_by(TaskModel.due_date.asc().nulls_last())
        else:
            statement = statement.order_by(TaskModel.due_date.desc().nulls_last())
    elif sort == "priority":
        # Custom order: high > medium > low
        from sqlalchemy import case
        priority_order = case(
            (TaskModel.priority == "high", 1),
            (TaskModel.priority == "medium", 2),
            (TaskModel.priority == "low", 3),
            else_=4
        )
        if order == "asc":
            statement = statement.order_by(priority_order.asc(), TaskModel.created_at.desc())
        else:
            statement = statement.order_by(priority_order.asc(), TaskModel.created_at.desc())
    elif sort == "title":
        if order == "asc":
            statement = statement.order_by(TaskModel.title.asc())
        else:
            statement = statement.order_by(TaskModel.title.desc())
    else:  # Default: created_at
        if order == "asc":
            statement = statement.order_by(TaskModel.created_at.asc())
        else:
            statement = statement.order_by(TaskModel.created_at.desc())
    
    result = await session.execute(statement)
    tasks = result.scalars().all()

    return {"tasks": tasks}

@app.post("/api/tasks", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Create a new task for the authenticated user"""
    # Validate title length
    if not task_data.title or len(task_data.title) < 1 or len(task_data.title) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required and must be 1-200 characters"
        )

    # Validate description length
    if task_data.description and len(task_data.description) > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Description must be 0-1000 characters"
        )

    # Create task
    task = TaskModel(
        user_id=current_user.user_id,
        title=task_data.title,
        description=task_data.description,
        completed=task_data.completed,
        priority=task_data.priority,
        tags=task_data.tags if task_data.tags else [],
        due_date=task_data.due_date,
        reminder_time=task_data.reminder_time,
        recurring_pattern=task_data.recurring_pattern
    )
    
    # Calculate next_occurrence for recurring tasks
    if task_data.recurring_pattern and task_data.due_date:
        try:
            from dateutil.relativedelta import relativedelta
            if task_data.recurring_pattern == "daily":
                task.next_occurrence = task_data.due_date + relativedelta(days=1)
            elif task_data.recurring_pattern == "weekly":
                task.next_occurrence = task_data.due_date + relativedelta(weeks=1)
            elif task_data.recurring_pattern == "monthly":
                task.next_occurrence = task_data.due_date + relativedelta(months=1)
        except ImportError:
            # Fallback if dateutil not available
            pass

    session.add(task)
    await session.commit()
    await session.refresh(task)

    return task

@app.get("/api/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Get a specific task by ID"""
    statement = select(TaskModel).where(
        TaskModel.id == task_id,
        TaskModel.user_id == current_user.user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task

@app.put("/api/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Update a specific task by ID"""
    statement = select(TaskModel).where(
        TaskModel.id == task_id,
        TaskModel.user_id == current_user.user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields if provided
    if task_data.title is not None:
        if not task_data.title or len(task_data.title) < 1 or len(task_data.title) > 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title is required and must be 1-200 characters"
            )
        task.title = task_data.title

    if task_data.description is not None:
        if len(task_data.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description must be 0-1000 characters"
            )
        task.description = task_data.description

    if task_data.completed is not None:
        task.completed = task_data.completed
    if task_data.priority is not None:
        task.priority = task_data.priority
    if task_data.tags is not None:
        task.tags = task_data.tags
    if task_data.due_date is not None:
        task.due_date = task_data.due_date
    if task_data.reminder_time is not None:
        task.reminder_time = task_data.reminder_time
    if task_data.recurring_pattern is not None:
        task.recurring_pattern = task_data.recurring_pattern
        # Recalculate next_occurrence if pattern or due_date changed
        if task_data.recurring_pattern and task.due_date:
            try:
                from dateutil.relativedelta import relativedelta
                if task_data.recurring_pattern == "daily":
                    task.next_occurrence = task.due_date + relativedelta(days=1)
                elif task_data.recurring_pattern == "weekly":
                    task.next_occurrence = task.due_date + relativedelta(weeks=1)
                elif task_data.recurring_pattern == "monthly":
                    task.next_occurrence = task.due_date + relativedelta(months=1)
            except ImportError:
                # Fallback if dateutil not available
                pass

    task.updated_at = datetime.now()

    await session.commit()
    await session.refresh(task)

    return task

@app.delete("/api/tasks/{task_id}")
async def delete_task(
    task_id: int,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Delete a specific task by ID"""
    statement = select(TaskModel).where(
        TaskModel.id == task_id,
        TaskModel.user_id == current_user.user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await session.delete(task)
    await session.commit()

    return {"message": f"Task {task_id} deleted successfully"}

@app.patch("/api/tasks/{task_id}/complete")
async def toggle_task_completion(
    task_id: int,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """Toggle the completion status of a task"""
    statement = select(TaskModel).where(
        TaskModel.id == task_id,
        TaskModel.user_id == current_user.user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.completed = not task.completed
    task.updated_at = datetime.now()

    await session.commit()
    await session.refresh(task)

    status_text = "completed" if task.completed else "pending"
    return {
        "message": f"Task {task_id} marked as {status_text}",
        "task": task
    }

@app.get("/")
async def root():
    return {"message": "Todo API - Phase 2 Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)