# FastAPI Anti-Patterns

Common mistakes and anti-patterns to avoid in FastAPI development.

## Database Anti-Patterns

### ❌ Synchronous DB Operations in Async Endpoints

```python
# BAD: Blocking database operation in async function
@app.get("/items/")
async def read_items():
    items = db.query(Item).all()  # Blocking!
    return items
```

### ✅ Use Async Database Operations

```python
# GOOD: Async database operation
@app.get("/items/")
async def read_items(session: AsyncDBSession):
    result = await session.execute(select(Item))
    return result.scalars().all()
```

### ❌ Not Closing Database Sessions

```python
# BAD: Session not properly closed
@app.get("/items/")
async def read_items():
    db = SessionLocal()
    items = db.query(Item).all()
    return items  # Session never closed!
```

### ✅ Use Dependency Injection with Proper Cleanup

```python
# GOOD: Session properly managed
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/items/")
async def read_items(db: DBDep):
    items = db.query(Item).all()
    return items
```

## Security Anti-Patterns

### ❌ Hardcoded Secrets

```python
# BAD: Secrets in code
SECRET_KEY = "my-secret-key-12345"
DATABASE_URL = "postgresql://user:password@localhost/db"
```

### ✅ Use Environment Variables

```python
# GOOD: Secrets from environment
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str
    database_url: str
    
    class Config:
        env_file = ".env"
```

### ❌ Plain Text Passwords

```python
# BAD: Storing passwords in plain text
user.password = password  # Never do this!
```

### ✅ Hash Passwords

```python
# GOOD: Hash passwords before storing
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
user.hashed_password = pwd_context.hash(password)
```

### ❌ Exposing Sensitive Data in Responses

```python
# BAD: Returning sensitive fields
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    return user  # Includes password hash!
```

### ✅ Use Response Models to Filter Data

```python
# GOOD: Response model excludes sensitive fields
class UserResponse(BaseModel):
    id: int
    email: str
    # password_hash excluded

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    return user
```

## Validation Anti-Patterns

### ❌ Skipping Request Validation

```python
# BAD: No validation
@app.post("/items/")
async def create_item(data: dict):
    # No validation, can receive any data
    return data
```

### ✅ Use Pydantic Models

```python
# GOOD: Proper validation
class ItemCreate(BaseModel):
    name: str
    price: float = Field(..., gt=0)

@app.post("/items/")
async def create_item(item: ItemCreate):
    return item
```

### ❌ Manual Type Conversion

```python
# BAD: Manual conversion
@app.get("/items/{item_id}")
async def read_item(item_id: str):
    item_id_int = int(item_id)  # Can raise ValueError
    return {"item_id": item_id_int}
```

### ✅ Use Type Hints

```python
# GOOD: Automatic conversion and validation
@app.get("/items/{item_id}")
async def read_item(item_id: int):  # FastAPI handles conversion
    return {"item_id": item_id}
```

## Dependency Injection Anti-Patterns

### ❌ Global Variables

```python
# BAD: Global state
db_session = None

@app.get("/items/")
async def read_items():
    global db_session
    if db_session is None:
        db_session = SessionLocal()
    return db_session.query(Item).all()
```

### ✅ Use Dependency Injection

```python
# GOOD: Dependency injection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/items/")
async def read_items(db: DBDep):
    return db.query(Item).all()
```

### ❌ Circular Dependencies

```python
# BAD: Circular dependency
def get_user(db: DBDep):
    # Uses db
    pass

def get_db(user: UserDep):
    # Uses user
    pass
```

### ✅ Structure Dependencies Properly

```python
# GOOD: One-way dependency
def get_db():
    yield db

def get_user(db: DBDep):
    # Uses db, no circular reference
    pass
```

## Error Handling Anti-Patterns

### ❌ Swallowing Exceptions

```python
# BAD: Silent failure
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    try:
        item = db.query(Item).filter(Item.id == item_id).first()
        return item
    except Exception:
        pass  # Silent failure!
```

### ✅ Proper Error Handling

```python
# GOOD: Proper error handling
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
```

### ❌ Generic Error Messages

```python
# BAD: Unhelpful error message
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    try:
        item = db.query(Item).filter(Item.id == item_id).first()
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error")  # Too generic
```

### ✅ Specific Error Messages

```python
# GOOD: Specific error message
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=404,
            detail=f"Item with id {item_id} not found"
        )
    return item
```

## Performance Anti-Patterns

### ❌ N+1 Query Problem

```python
# BAD: N+1 queries
@app.get("/users/")
async def read_users():
    users = db.query(User).all()
    for user in users:
        user.items = db.query(Item).filter(Item.owner_id == user.id).all()
    return users
```

### ✅ Use Eager Loading

```python
# GOOD: Single query with joins
from sqlalchemy.orm import joinedload

@app.get("/users/")
async def read_users():
    users = db.query(User).options(joinedload(User.items)).all()
    return users
```

### ❌ Loading All Data

```python
# BAD: Loading all records
@app.get("/items/")
async def read_items():
    items = db.query(Item).all()  # Could be millions!
    return items
```

### ✅ Use Pagination

```python
# GOOD: Paginated results
@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    items = db.query(Item).offset(skip).limit(limit).all()
    return items
```

## Code Organization Anti-Patterns

### ❌ Everything in One File

```python
# BAD: All code in main.py
# main.py with 1000+ lines
```

### ✅ Modular Structure

```python
# GOOD: Organized structure
# app/
#   ├── main.py
#   ├── api/
#   │   └── endpoints/
#   ├── models/
#   └── core/
```

### ❌ Duplicate Code

```python
# BAD: Repeated validation logic
@app.post("/items/")
async def create_item(item: dict):
    if "name" not in item or not item["name"]:
        raise HTTPException(...)
    if "price" not in item or item["price"] <= 0:
        raise HTTPException(...)

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: dict):
    if "name" not in item or not item["name"]:
        raise HTTPException(...)
    if "price" not in item or item["price"] <= 0:
        raise HTTPException(...)
```

### ✅ Reusable Models

```python
# GOOD: Reusable Pydantic models
class ItemBase(BaseModel):
    name: str
    price: float = Field(..., gt=0)

class ItemCreate(ItemBase):
    pass

@app.post("/items/")
async def create_item(item: ItemCreate):
    return item

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: ItemUpdate):
    return item
```

## Summary

Common anti-patterns to avoid:

1. **Database**: Blocking operations, unclosed sessions, N+1 queries
2. **Security**: Hardcoded secrets, plain text passwords, exposed sensitive data
3. **Validation**: Skipping validation, manual type conversion
4. **Dependencies**: Global variables, circular dependencies
5. **Errors**: Swallowing exceptions, generic error messages
6. **Performance**: Loading all data, inefficient queries
7. **Organization**: Monolithic files, duplicate code

Always follow FastAPI best practices and leverage its built-in features for validation, dependency injection, and type safety.


