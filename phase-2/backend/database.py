from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession as SQLModelAsyncSession
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://localhost:5432/todo")

# Create async engine
async_engine = create_async_engine(DATABASE_URL)

# Create async session maker
AsyncSessionLocal = sessionmaker(
    async_engine,
    class_=SQLModelAsyncSession,
    expire_on_commit=False
)

@asynccontextmanager
async def get_async_session() -> AsyncGenerator[SQLModelAsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session