from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession as SQLModelAsyncSession
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from dotenv import load_dotenv

# Load environment variables from .env.local (or .env as fallback)
load_dotenv(".env.local")  # Try .env.local first
load_dotenv()  # Fallback to .env if .env.local doesn't exist

# Database setup
# Neon PostgreSQL connection string format: postgresql+asyncpg://user:password@host/database
# Note: Remove ?sslmode=require from connection string - SSL is configured via connect_args
# Load from environment variable (set in .env.local file)
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is required. "
        "Please create a .env.local file in the backend directory with your Neon database connection string."
    )

# Remove sslmode parameter from connection string if present (asyncpg doesn't support it in URL)
# SSL will be configured via connect_args instead
if "?sslmode=" in DATABASE_URL or "&sslmode=" in DATABASE_URL:
    # Parse and remove sslmode from URL
    from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
    parsed = urlparse(DATABASE_URL)
    query_params = parse_qs(parsed.query)
    query_params.pop('sslmode', None)  # Remove sslmode if present
    # Reconstruct URL without sslmode
    new_query = urlencode(query_params, doseq=True)
    DATABASE_URL = urlunparse(parsed._replace(query=new_query))

# Create async engine with connection pool settings for Neon
# For asyncpg, SSL must be configured via connect_args, not in the connection string
async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    pool_pre_ping=True,  # Verify connections before using them (important for serverless)
    pool_size=5,  # Connection pool size
    max_overflow=10,  # Maximum overflow connections
    connect_args={
        "ssl": "require"  # asyncpg requires SSL for Neon PostgreSQL
    }
)

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