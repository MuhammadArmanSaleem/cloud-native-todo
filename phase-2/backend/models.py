from sqlmodel import SQLModel, Field, Column, ARRAY, Text
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[str] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, foreign_key="users.id")  # Foreign key to user
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    priority: Optional[str] = Field(default=None, index=True)  # "high", "medium", "low"
    tags: Optional[List[str]] = Field(default=None, sa_column=Column(ARRAY(Text)))  # PostgreSQL array
    due_date: Optional[datetime] = Field(default=None, index=True)
    reminder_time: Optional[datetime] = None
    recurring_pattern: Optional[str] = None  # "daily", "weekly", "monthly"
    next_occurrence: Optional[datetime] = None
    original_task_id: Optional[int] = Field(default=None, foreign_key="tasks.id")  # For recurring tasks
    created_at: datetime = Field(default_factory=datetime.now, index=True)
    updated_at: datetime = Field(default_factory=datetime.now)