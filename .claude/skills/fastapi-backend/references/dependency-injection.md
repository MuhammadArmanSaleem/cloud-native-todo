# FastAPI Dependency Injection

Dependency injection patterns and best practices in FastAPI.

## Basic Dependency Injection

### Simple Dependency

```python
from fastapi import Depends, FastAPI

app = FastAPI()

def get_query_params(q: str | None = None, skip: int = 0, limit: int = 10):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: dict = Depends(get_query_params)):
    return commons
```

### Annotated Dependencies (Modern Pattern)

```python
from typing import Annotated
from fastapi import Depends

def get_query_params(q: str | None = None, skip: int = 0, limit: int = 10):
    return {"q": q, "skip": skip, "limit": limit}

QueryParams = Annotated[dict, Depends(get_query_params)]

@app.get("/items/")
async def read_items(params: QueryParams):
    return params
```

## Class-Based Dependencies

### Dependency Class

```python
from typing import Annotated
from fastapi import Depends

class CommonQueryParams:
    def __init__(self, q: str | None = None, skip: int = 0, limit: int = 10):
        self.q = q
        self.skip = skip
        self.limit = limit

@app.get("/items/")
async def read_items(commons: Annotated[CommonQueryParams, Depends()]):
    return commons
```

## Sub-dependencies

### Nested Dependencies

```python
from typing import Annotated
from fastapi import Depends

def get_query(q: str | None = None):
    return q

def get_user_id(user_id: int):
    return user_id

def get_user_data(
    q: Annotated[str | None, Depends(get_query)],
    user_id: Annotated[int, Depends(get_user_id)]
):
    return {"q": q, "user_id": user_id}

@app.get("/items/")
async def read_items(data: Annotated[dict, Depends(get_user_data)]):
    return data
```

## Database Session Dependency

### Session Management

```python
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DBDep = Annotated[Session, Depends(get_db)]

@app.get("/items/")
async def read_items(db: DBDep):
    items = db.query(Item).all()
    return items
```

### Async Session Dependency

```python
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

AsyncDBSession = Annotated[AsyncSession, Depends(get_async_session)]

@app.get("/items/")
async def read_items(session: AsyncDBSession):
    result = await session.execute(select(Item))
    return result.scalars().all()
```

## Authentication Dependencies

### Current User Dependency

```python
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

@app.get("/users/me")
async def read_users_me(current_user: CurrentUser):
    return current_user
```

### Active User Dependency

```python
async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

ActiveUser = Annotated[User, Depends(get_current_active_user)]
```

## Dependency with Background Tasks

```python
from typing import Annotated
from fastapi import BackgroundTasks, Depends

def get_query(background_tasks: BackgroundTasks, q: str | None = None):
    if q:
        message = f"found query: {q}\n"
        background_tasks.add_task(write_log, message)
    return q

@app.post("/send-notification/{email}")
async def send_notification(
    email: str,
    background_tasks: BackgroundTasks,
    q: Annotated[str, Depends(get_query)]
):
    message = f"message to {email}\n"
    background_tasks.add_task(write_log, message)
    return {"message": "Notification sent"}
```

## Dependency Overrides (Testing)

### Override Dependencies

```python
from fastapi.testclient import TestClient
from fastapi import Depends

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)
```

## Global Dependencies

### Router-Level Dependencies

```python
from fastapi import APIRouter, Depends

router = APIRouter(
    dependencies=[Depends(get_current_user)]
)

@router.get("/items/")
async def read_items():
    return {"items": []}
```

### App-Level Dependencies

```python
from fastapi import Depends

app = FastAPI(
    dependencies=[Depends(verify_token)]
)
```

## Dependency Caching

### Cache Dependencies

```python
from functools import lru_cache
from typing import Annotated
from fastapi import Depends

@lru_cache()
def get_settings():
    return Settings()

SettingsDep = Annotated[Settings, Depends(get_settings)]
```

## Best Practices

1. **Use Annotated for type clarity** - Modern Python pattern
2. **Yield for cleanup** - Use generators for resources that need cleanup
3. **Reuse dependencies** - Create reusable dependency functions
4. **Separate concerns** - Keep dependencies focused on single responsibilities
5. **Test with overrides** - Use dependency_overrides for testing
6. **Document dependencies** - Add docstrings to dependency functions
7. **Handle errors in dependencies** - Raise appropriate HTTPExceptions
8. **Use dependency chains** - Build complex dependencies from simple ones

## Common Patterns

### Pagination Dependency

```python
from typing import Annotated
from fastapi import Depends, Query

class PaginationParams:
    def __init__(self, skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100)):
        self.skip = skip
        self.limit = limit

Pagination = Annotated[PaginationParams, Depends()]

@app.get("/items/")
async def read_items(pagination: Pagination):
    return {"skip": pagination.skip, "limit": pagination.limit}
```

### Filtering Dependency

```python
class FilterParams:
    def __init__(
        self,
        name: str | None = Query(None),
        min_price: float | None = Query(None, ge=0),
        max_price: float | None = Query(None, ge=0)
    ):
        self.name = name
        self.min_price = min_price
        self.max_price = max_price

Filters = Annotated[FilterParams, Depends()]

@app.get("/items/")
async def read_items(filters: Filters):
    # Apply filters
    return {"filters": filters}
```


