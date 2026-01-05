# Backend Edge Cases

Comprehensive edge case handling for backend development.

## Input Validation Edge Cases

### Invalid Data Types

```python
# Handle type mismatches
@app.post("/users/")
async def create_user(user: UserCreate):
    try:
        # Pydantic handles type validation
        return create_user_service(user)
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=e.errors()
        )
```

### Missing Required Fields

```python
# Pydantic automatically validates required fields
class UserCreate(BaseModel):
    email: str  # Required
    name: str   # Required
    age: int | None = None  # Optional

# FastAPI returns 422 if required fields missing
```

### Out-of-Range Values

```python
# Use Pydantic validators
from pydantic import BaseModel, field_validator

class UserCreate(BaseModel):
    age: int
    
    @field_validator('age')
    @classmethod
    def validate_age(cls, v):
        if v < 0 or v > 150:
            raise ValueError('Age must be between 0 and 150')
        return v
```

## Authentication Edge Cases

### Invalid Tokens

```python
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return get_user(username)
```

### Expired Tokens

```python
# JWT automatically validates expiration
# Handle JWTExpiredError
try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
except ExpiredSignatureError:
    raise HTTPException(status_code=401, detail="Token expired")
```

## Database Edge Cases

### Connection Failures

```python
# Handle database connection errors
try:
    user = db.query(User).filter(User.id == user_id).first()
except SQLAlchemyError as e:
    logger.error(f"Database error: {e}")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Database connection failed"
    )
```

### Transaction Conflicts

```python
# Handle transaction conflicts
try:
    db.commit()
except IntegrityError as e:
    db.rollback()
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Resource conflict"
    )
```

## API Error Edge Cases

### Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/endpoint")
@limiter.limit("10/minute")
async def endpoint(request: Request):
    return {"message": "Success"}
```

### Timeout Handling

```python
import asyncio

async def fetch_with_timeout(url: str, timeout: int = 5):
    try:
        async with asyncio.timeout(timeout):
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                return response.json()
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Request timeout"
        )
```

## Security Edge Cases

### SQL Injection Prevention

```python
# Always use parameterized queries
# Good: ORM handles parameterization
user = db.query(User).filter(User.email == email).first()

# Bad: Never do this
# query = f"SELECT * FROM users WHERE email = '{email}'"
```

### XSS Prevention

```python
# Sanitize input before storage
from html import escape

def sanitize_input(text: str) -> str:
    return escape(text)

# Use in validation
class PostCreate(BaseModel):
    content: str
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        return sanitize_input(v)
```

## Best Practices

1. **Validate all input** - Use Pydantic models
2. **Handle authentication errors** - Proper error messages
3. **Database error handling** - Connection, transaction errors
4. **Rate limiting** - Prevent abuse
5. **Timeout handling** - Prevent hanging requests
6. **Security checks** - SQL injection, XSS prevention
7. **Error logging** - Log errors for debugging
8. **Graceful degradation** - Handle failures gracefully

