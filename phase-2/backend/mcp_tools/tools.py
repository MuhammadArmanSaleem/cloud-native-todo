"""Task CRUD tools for the chat agent; use ChatContext for user_id and session."""
from typing import Optional
from datetime import datetime

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from models import Task
from chat.context import ChatContext


async def list_tasks(
    ctx: ChatContext,
    status_filter: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = None,
    order: Optional[str] = "desc",
) -> str:
    """List the user's tasks. status_filter: 'all'|'pending'|'completed'. priority: 'high'|'medium'|'low'. sort: 'created_at'|'due_date'|'priority'|'title'. order: 'asc'|'desc'."""
    session = ctx.session
    user_id = ctx.user_id
    statement = select(Task).where(Task.user_id == user_id)
    if status_filter == "pending":
        statement = statement.where(Task.completed == False)
    elif status_filter == "completed":
        statement = statement.where(Task.completed == True)
    if priority:
        statement = statement.where(Task.priority == priority)
    if search:
        term = f"%{search}%"
        statement = statement.where(
            Task.title.ilike(term) | Task.description.ilike(term)
        )
    if sort == "due_date":
        statement = statement.order_by(
            Task.due_date.desc().nulls_last() if order == "desc" else Task.due_date.asc().nulls_last()
        )
    elif sort == "title":
        statement = statement.order_by(
            Task.title.desc() if order == "desc" else Task.title.asc()
        )
    else:
        statement = statement.order_by(
            Task.created_at.desc() if order == "desc" else Task.created_at.asc()
        )
    result = await session.execute(statement)
    tasks = result.scalars().all()
    if not tasks:
        return "No tasks found."
    lines = []
    for t in tasks:
        line = f"- [{'x' if t.completed else ' '}] id={t.id} title={t.title!r}"
        if t.priority:
            line += f" priority={t.priority}"
        if t.due_date:
            line += f" due={t.due_date.date()}"
        lines.append(line)
    return "\n".join(lines)


async def create_task(
    ctx: ChatContext,
    title: str,
    description: Optional[str] = None,
    priority: Optional[str] = None,
    completed: bool = False,
) -> str:
    """Create a new task. title is required (1-200 chars). priority: 'high'|'medium'|'low'."""
    if not title or len(title.strip()) < 1 or len(title) > 200:
        return "Error: title is required and must be 1-200 characters."
    session = ctx.session
    user_id = ctx.user_id
    task = Task(
        user_id=user_id,
        title=title.strip(),
        description=description[:1000] if description else None,
        priority=priority if priority in ("high", "medium", "low") else None,
        completed=completed,
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return f"Created task id={task.id} title={task.title!r}."


async def get_task(ctx: ChatContext, task_id: int) -> str:
    """Get a single task by id."""
    session = ctx.session
    user_id = ctx.user_id
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    if not task:
        return f"Task {task_id} not found."
    return f"id={task.id} title={task.title!r} completed={task.completed} priority={task.priority} description={task.description or ''}."


async def update_task(
    ctx: ChatContext,
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[str] = None,
) -> str:
    """Update a task by id. Pass only the fields you want to change."""
    session = ctx.session
    user_id = ctx.user_id
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    if not task:
        return f"Task {task_id} not found."
    if title is not None:
        if len(title.strip()) < 1 or len(title) > 200:
            return "Error: title must be 1-200 characters."
        task.title = title.strip()
    if description is not None:
        task.description = description[:1000] if description else None
    if completed is not None:
        task.completed = completed
    if priority is not None and priority in ("high", "medium", "low"):
        task.priority = priority
    task.updated_at = datetime.now()
    await session.commit()
    await session.refresh(task)
    return f"Updated task id={task.id} title={task.title!r}."


async def delete_task(ctx: ChatContext, task_id: int) -> str:
    """Delete a task by id."""
    session = ctx.session
    user_id = ctx.user_id
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    if not task:
        return f"Task {task_id} not found."
    await session.delete(task)
    await session.commit()
    return f"Deleted task id={task_id}."


async def toggle_task_complete(ctx: ChatContext, task_id: int) -> str:
    """Toggle a task's completed status (mark done or pending) by id."""
    session = ctx.session
    user_id = ctx.user_id
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(statement)
    task = result.scalar_one_or_none()
    if not task:
        return f"Task {task_id} not found."
    task.completed = not task.completed
    task.updated_at = datetime.now()
    await session.commit()
    await session.refresh(task)
    status_text = "completed" if task.completed else "pending"
    return f"Task id={task.id} marked as {status_text}."
