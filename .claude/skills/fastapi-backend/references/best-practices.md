# FastAPI Best Practices

Production-ready patterns and best practices for FastAPI applications.

## Project Structure

### Recommended Structure

```
project/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance
│   ├── config.py            # Configuration
│   ├── dependencies.py      # Shared dependencies
│   ├── models/              # Pydantic models
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── api/                 # API routes
│   │   ├── __init__.py
│   │   ├── deps.py          # Route dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── endpoints/
│   ├── core/                # Core functionality
│   │   ├── security.py
│   │   └── database.py
│   └── db/                  # Database models
│       ├── __init__.py
│       └── models.py
├── tests/
├── requirements.txt
└── README.md
```

## Configuration Management

### Environment-Based Configuration

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "My API"
    debug: bool = False
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()
```

## Error Handling

### Custom Exception Handlers

```python
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )
```

## Security

### Security Headers Middleware

```python
from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()

# Redirect HTTP to HTTPS in production
if not settings.debug:
    app.add_middleware(HTTPSRedirectMiddleware)

# Trust only specific hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["example.com", "*.example.com"]
)
```

### CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # From config
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)
```

## Performance

### Response Caching

```python
from fastapi import FastAPI, Response
from functools import lru_cache
import time

@app.get("/items/")
async def read_items(response: Response):
    response.headers["Cache-Control"] = "public, max-age=3600"
    return {"items": []}
```

### Async Operations

```python
# Good: Use async for I/O operations
@app.get("/items/")
async def read_items():
    items = await fetch_items_from_db()
    return items

# Avoid: Blocking operations in async functions
@app.get("/items/")
async def read_items():
    items = fetch_items_from_db()  # Blocking!
    return items
```

## Testing

### Test Client Setup

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_item():
    response = client.get("/items/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1
```

### Test Fixtures

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
    Base.metadata.drop_all(bind=engine)
```

## Logging

### Structured Logging

```python
import logging
from fastapi import Request

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    return response
```

## Documentation

### Comprehensive API Documentation

```python
app = FastAPI(
    title="My API",
    description="""
    ## My API
    
    This API provides endpoints for managing items.
    
    ### Features
    
    * Create items
    * Read items
    * Update items
    * Delete items
    """,
    version="1.0.0",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "API Support",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)
```

### Endpoint Documentation

```python
@app.post(
    "/items/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an item",
    description="""
    Create a new item with the following information:
    
    * **name**: Item name (required)
    * **description**: Item description (optional)
    * **price**: Item price (required, must be positive)
    """,
    response_description="The created item",
    tags=["items"],
    responses={
        201: {
            "description": "Item created successfully",
            "content": {
                "application/json": {
                    "example": {"id": 1, "name": "Item", "price": 10.0}
                }
            },
        },
        422: {"description": "Validation error"},
    },
)
async def create_item(item: ItemCreate):
    return item
```

## Database Best Practices

1. **Use connection pooling** - Configure appropriate pool size
2. **Close connections properly** - Use try/finally or context managers
3. **Use transactions** - Group related operations
4. **Handle database errors** - Catch and handle DB exceptions
5. **Use migrations** - Never modify schema directly
6. **Index frequently queried fields** - Improve query performance
7. **Use async for I/O** - When possible, use async database operations

## Code Quality

1. **Type hints everywhere** - Leverage FastAPI's type system
2. **Use Pydantic models** - For all request/response validation
3. **Follow PEP 8** - Python style guide
4. **Write docstrings** - Document functions and classes
5. **Use linters** - flake8, black, mypy
6. **Write tests** - Unit and integration tests
7. **Version control** - Use Git with meaningful commits

## Deployment

### Production Checklist

- [ ] Set `debug=False` in production
- [ ] Use environment variables for secrets
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS/TLS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Use production database
- [ ] Configure connection pooling
- [ ] Set up health check endpoints
- [ ] Use process manager (systemd, supervisor)
- [ ] Configure reverse proxy (nginx, traefik)

### Health Check Endpoint

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "database": "connected"  # Check DB connection
    }
```


