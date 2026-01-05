# FastAPI Core Concepts

Essential FastAPI concepts and patterns for building APIs.

## FastAPI Overview

FastAPI is a modern, fast web framework for building APIs with Python based on standard Python type hints. Key features:

- **High Performance**: On par with NodeJS and Go (thanks to Starlette and Pydantic)
- **Fast Development**: Increase development speed by 200-300%
- **Type Safety**: Automatic validation based on Python type hints
- **Standards-Based**: OpenAPI (Swagger) and JSON Schema compliant
- **Automatic Documentation**: Interactive API docs at `/docs` and `/redoc`

## Application Setup

### Basic FastAPI App

```python
from fastapi import FastAPI

app = FastAPI(
    title="My API",
    description="API description",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

### Application Configuration

```python
from fastapi import FastAPI
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "My API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"

settings = Settings()
app = FastAPI(title=settings.app_name)
```

## Routing

### Path Operations

```python
from fastapi import FastAPI

app = FastAPI()

# GET endpoint
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

# POST endpoint
@app.post("/items/")
async def create_item(item: dict):
    return item

# PUT endpoint
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: dict):
    return {"item_id": item_id, **item}

# DELETE endpoint
@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    return {"message": "Item deleted"}
```

### Path Parameters

```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):  # Automatic type conversion
    return {"item_id": item_id}

# Path with validation
from fastapi import Path

@app.get("/items/{item_id}")
async def read_item(
    item_id: int = Path(..., gt=0, description="Item ID must be positive")
):
    return {"item_id": item_id}
```

### Query Parameters

```python
# Optional query parameter
@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Query with validation
from fastapi import Query

@app.get("/items/")
async def read_items(
    q: str | None = Query(None, min_length=3, max_length=50),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    return {"q": q, "skip": skip, "limit": limit}
```

## Request Body

### Pydantic Models

```python
from pydantic import BaseModel, Field
from typing import Optional

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0, description="Price must be positive")
    tax: Optional[float] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    tax: Optional[float] = None

@app.post("/items/")
async def create_item(item: ItemCreate):
    return item
```

### Request Body Validation

```python
from pydantic import BaseModel, validator, field_validator

class Item(BaseModel):
    name: str
    price: float
    
    @field_validator('price')
    @classmethod
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError('Price must be positive')
        return v
```

## Response Models

### Response Model Definition

```python
class ItemResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    
    class Config:
        from_attributes = True  # For Pydantic v2

@app.get("/items/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    return ItemResponse(id=item_id, name="Item", price=10.0)
```

### Response Status Codes

```python
from fastapi import status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate):
    return item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    return None
```

## Error Handling

### HTTPException

```python
from fastapi import HTTPException, status

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return items[item_id]
```

### Custom Exception Handlers

```python
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )
```

## Middleware

### CORS Middleware

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Custom Middleware

```python
from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

## Background Tasks

```python
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def write_log(message: str):
    with open("log.txt", mode="a") as log:
        log.write(message)

@app.post("/send-notification/{email}")
async def send_notification(email: str, background_tasks: BackgroundTasks):
    message = f"message to {email}"
    background_tasks.add_task(write_log, message)
    return {"message": "Notification sent"}
```

## WebSockets

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        pass
```

## OpenAPI Documentation

### Endpoint Documentation

```python
@app.post(
    "/items/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an item",
    description="Create a new item with the provided information",
    response_description="The created item",
    tags=["items"]
)
async def create_item(item: ItemCreate):
    return item
```

### Tags and Metadata

```python
app = FastAPI(
    title="My API",
    description="API for managing items",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "items",
            "description": "Operations with items",
        },
        {
            "name": "users",
            "description": "User management operations",
        },
    ]
)
```


