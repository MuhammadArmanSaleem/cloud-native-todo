# FastAPI Database Patterns

Database integration patterns for FastAPI applications.

## SQLAlchemy Integration

### Basic Setup

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

### Database Models

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    items = relationship("Item", back_populates="owner")
```

### Dependency Injection for Sessions

```python
from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DBDep = Annotated[Session, Depends(get_db)]

@app.get("/users/")
async def read_users(db: DBDep):
    users = db.query(User).all()
    return users
```

## SQLModel Integration

### Setup

```python
from sqlmodel import Field, Session, SQLModel, create_engine

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
```

### SQLModel Definition

```python
from sqlmodel import Field, SQLModel
from typing import Optional

class HeroBase(SQLModel):
    name: str = Field(index=True)
    age: Optional[int] = None

class Hero(HeroBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    secret_name: str

class HeroPublic(HeroBase):
    id: int

class HeroCreate(HeroBase):
    secret_name: str

class HeroUpdate(SQLModel):
    name: Optional[str] = None
    age: Optional[int] = None
    secret_name: Optional[str] = None
```

### CRUD Operations

```python
from sqlmodel import select

@app.post("/heroes/", response_model=HeroPublic)
def create_hero(hero: HeroCreate, session: SessionDep):
    db_hero = Hero.model_validate(hero)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero

@app.get("/heroes/", response_model=list[HeroPublic])
def read_heroes(session: SessionDep, offset: int = 0, limit: int = 100):
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes

@app.get("/heroes/{hero_id}", response_model=HeroPublic)
def read_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero

@app.patch("/heroes/{hero_id}", response_model=HeroPublic)
def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
    hero_db = session.get(Hero, hero_id)
    if not hero_db:
        raise HTTPException(status_code=404, detail="Hero not found")
    hero_data = hero.model_dump(exclude_unset=True)
    hero_db.sqlmodel_update(hero_data)
    session.add(hero_db)
    session.commit()
    session.refresh(hero_db)
    return hero_db

@app.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, session: SessionDep):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(hero)
    session.commit()
    return {"ok": True}
```

## Async Database Operations

### Async SQLAlchemy Setup

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

DATABASE_URL = "postgresql+asyncpg://user:password@localhost/dbname"

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

AsyncDBSession = Annotated[AsyncSession, Depends(get_async_session)]
```

### Async CRUD Operations

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

@app.get("/users/")
async def read_users(session: AsyncDBSession):
    result = await session.execute(select(User))
    users = result.scalars().all()
    return users

@app.post("/users/")
async def create_user(user: UserCreate, session: AsyncDBSession):
    db_user = User(**user.model_dump())
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user
```

## Database Migrations

### Alembic Setup

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### Alembic Configuration

```python
# alembic/env.py
from app.db.base import Base
target_metadata = Base.metadata
```

## Connection Pooling

### Pool Configuration

```python
from sqlalchemy import create_engine

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,    # Recycle connections after 1 hour
)
```

## Best Practices

1. **Always use dependency injection** for database sessions
2. **Close sessions properly** using try/finally or context managers
3. **Use async for I/O operations** when possible
4. **Set up connection pooling** for production
5. **Use migrations** (Alembic) for schema changes
6. **Separate models from schemas** (database models vs Pydantic models)
7. **Use transactions** for operations that must succeed together
8. **Handle database errors** gracefully with proper exceptions

## Common Patterns

### Pagination

```python
from fastapi import Query

@app.get("/items/")
async def read_items(
    session: DBDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    items = session.query(Item).offset(skip).limit(limit).all()
    total = session.query(Item).count()
    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit
    }
```

### Filtering and Searching

```python
@app.get("/items/")
async def read_items(
    session: DBDep,
    name: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None
):
    query = session.query(Item)
    if name:
        query = query.filter(Item.name.contains(name))
    if min_price:
        query = query.filter(Item.price >= min_price)
    if max_price:
        query = query.filter(Item.price <= max_price)
    return query.all()
```


