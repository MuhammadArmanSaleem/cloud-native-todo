# FastAPI Request and Response Patterns

Comprehensive guide to handling requests and responses in FastAPI.

## Request Parameters

### Path Parameters

```python
from fastapi import FastAPI, Path

app = FastAPI()

# Basic path parameter
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

# Path parameter with validation
@app.get("/items/{item_id}")
async def read_item(
    item_id: int = Path(..., gt=0, description="Item ID must be positive")
):
    return {"item_id": item_id}

# Multiple path parameters
@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(user_id: int, item_id: int):
    return {"user_id": user_id, "item_id": item_id}
```

### Query Parameters

```python
from fastapi import FastAPI, Query

# Optional query parameter
@app.get("/items/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Query parameter with validation
@app.get("/items/")
async def read_items(
    q: str | None = Query(None, min_length=3, max_length=50),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    return {"q": q, "skip": skip, "limit": limit}

# Multiple values query parameter
@app.get("/items/")
async def read_items(tags: list[str] = Query([])):
    return {"tags": tags}

# Query parameter with alias
@app.get("/items/")
async def read_items(item_query: str = Query(..., alias="item-query")):
    return {"query": item_query}
```

### Request Body

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

# Single body parameter
@app.post("/items/")
async def create_item(item: Item):
    return item

# Multiple body parameters
from fastapi import Body

@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Item,
    user: User,
    importance: int = Body(...)
):
    return {"item_id": item_id, "item": item, "user": user, "importance": importance}

# Body with embedded key
@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Item = Body(..., embed=True)
):
    return {"item_id": item_id, "item": item}
```

### Form Data

```python
from fastapi import FastAPI, Form

@app.post("/login/")
async def login(username: str = Form(...), password: str = Form(...)):
    return {"username": username}
```

### File Uploads

```python
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse

# Single file
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}

# Multiple files
@app.post("/upload/")
async def upload_files(files: list[UploadFile] = File(...)):
    return {"filenames": [file.filename for file in files]}

# File with form data
@app.post("/upload/")
async def upload_file_with_data(
    file: UploadFile = File(...),
    description: str = Form(...)
):
    return {"filename": file.filename, "description": description}
```

### Headers

```python
from fastapi import FastAPI, Header

@app.get("/items/")
async def read_items(
    user_agent: str | None = Header(None),
    x_token: str = Header(..., alias="X-Token")
):
    return {"user_agent": user_agent, "token": x_token}
```

### Cookies

```python
from fastapi import FastAPI, Cookie

@app.get("/items/")
async def read_items(ads_id: str | None = Cookie(None)):
    return {"ads_id": ads_id}
```

## Response Models

### Basic Response Model

```python
from pydantic import BaseModel

class ItemResponse(BaseModel):
    id: int
    name: str
    price: float

@app.get("/items/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    return ItemResponse(id=item_id, name="Item", price=10.0)
```

### Response Model with Exclusions

```python
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str | None = None

class UserInDB(UserBase):
    hashed_password: str

class User(UserBase):
    disabled: bool | None = None

@app.get("/users/me", response_model=User)
async def read_users_me():
    # Password hash excluded from response
    return UserInDB(username="john", email="john@example.com", hashed_password="...")
```

### Multiple Response Models

```python
from typing import Union

class ItemBase(BaseModel):
    name: str

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int

@app.post("/items/", response_model=ItemResponse)
async def create_item(item: ItemCreate):
    return ItemResponse(id=1, **item.model_dump())
```

### Response Status Codes

```python
from fastapi import FastAPI, status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate):
    return item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    return None
```

## Custom Responses

### JSONResponse

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

@app.get("/items/")
async def read_items():
    return JSONResponse(
        status_code=200,
        content={"message": "Items retrieved", "items": []}
    )
```

### PlainTextResponse

```python
from fastapi.responses import PlainTextResponse

@app.get("/", response_class=PlainTextResponse)
async def main():
    return "Hello World"
```

### HTMLResponse

```python
from fastapi.responses import HTMLResponse

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return "<h1>Hello World</h1>"
```

### FileResponse

```python
from fastapi.responses import FileResponse

@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return FileResponse(file_path)
```

### StreamingResponse

```python
from fastapi.responses import StreamingResponse
import io

@app.get("/stream/")
async def stream_data():
    def generate():
        for i in range(10):
            yield f"data: {i}\n\n"
    
    return StreamingResponse(generate(), media_type="text/plain")
```

### RedirectResponse

```python
from fastapi.responses import RedirectResponse

@app.get("/redirect/")
async def redirect():
    return RedirectResponse(url="https://example.com")
```

## Response Headers

### Custom Headers

```python
from fastapi import FastAPI, Response

@app.get("/items/")
async def read_items(response: Response):
    response.headers["X-Custom-Header"] = "custom-value"
    return {"items": []}
```

### Setting Cookies

```python
from fastapi import FastAPI, Response

@app.post("/login/")
async def login(response: Response):
    response.set_cookie(key="session", value="abc123", httponly=True)
    return {"message": "Logged in"}
```

## Response Model Configuration

### Response Model with Config

```python
from pydantic import BaseModel, ConfigDict

class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    price: float
```

### Response Model Serialization

```python
from datetime import datetime
from pydantic import BaseModel, field_serializer

class ItemResponse(BaseModel):
    id: int
    created_at: datetime
    
    @field_serializer('created_at')
    def serialize_datetime(self, value: datetime):
        return value.isoformat()
```

## Advanced Patterns

### Conditional Response Models

```python
from typing import Annotated
from fastapi import FastAPI, Header

def get_response_model(accept: str = Header("application/json")):
    if "application/xml" in accept:
        return XMLResponse
    return JSONResponse

@app.get("/items/")
async def read_items(response_model=Depends(get_response_model)):
    return {"items": []}
```

### Response with Examples

```python
@app.post(
    "/items/",
    response_model=ItemResponse,
    responses={
        200: {
            "description": "Successful Response",
            "content": {
                "application/json": {
                    "example": {"id": 1, "name": "Item", "price": 10.0}
                }
            },
        },
        422: {
            "description": "Validation Error",
            "content": {
                "application/json": {
                    "example": {"detail": [{"loc": ["body", "name"], "msg": "field required"}]}
                }
            },
        },
    },
)
async def create_item(item: ItemCreate):
    return item
```


