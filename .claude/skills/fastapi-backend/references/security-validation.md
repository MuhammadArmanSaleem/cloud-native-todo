# FastAPI Security Validation

Comprehensive security validation patterns to prevent injection attacks, XSS, and malicious data storage.

## Critical Security Principles

1. **Never trust user input** - Always validate and sanitize
2. **Whitelist over blacklist** - Define allowed patterns, not forbidden ones
3. **Validate at boundaries** - API layer validates all external input
4. **Sanitize before storage** - Clean data before database insertion
5. **Use parameterized queries** - Never concatenate user input into SQL
6. **Escape output** - Escape data when rendering to prevent XSS

## Input Sanitization

### HTML/Script Tag Removal

```python
import re
from html import escape
from typing import Any
from pydantic import BaseModel, field_validator

def sanitize_html(text: str) -> str:
    """Remove HTML tags and script content from text."""
    if not text:
        return text
    
    # Remove script tags and content
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove style tags and content
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove all HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove javascript: and data: URLs
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'data:text/html', '', text, flags=re.IGNORECASE)
    
    # Remove event handlers (onclick, onerror, etc.)
    text = re.sub(r'on\w+\s*=', '', text, flags=re.IGNORECASE)
    
    return text.strip()

def sanitize_sql_input(text: str) -> str:
    """Sanitize input to prevent SQL injection."""
    if not text:
        return text
    
    # Remove SQL comment markers
    text = text.replace('--', '')
    text = text.replace('/*', '')
    text = text.replace('*/', '')
    
    # Remove semicolons (statement terminators)
    text = text.replace(';', '')
    
    # Remove common SQL keywords used in injection
    dangerous_keywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'EXEC', 'EXECUTE']
    for keyword in dangerous_keywords:
        text = re.sub(rf'\b{keyword}\b', '', text, flags=re.IGNORECASE)
    
    return text.strip()
```

### Pydantic Validators for Security

```python
from pydantic import BaseModel, field_validator, ValidationError
import re

class SecureTextInput(BaseModel):
    """Base model with security validators."""
    
    @field_validator('*', mode='before')
    @classmethod
    def sanitize_all_strings(cls, v: Any) -> Any:
        """Sanitize all string inputs."""
        if isinstance(v, str):
            return sanitize_html(v)
        return v

class ItemCreate(SecureTextInput):
    name: str
    description: str | None = None
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate and sanitize name field."""
        if not v or len(v.strip()) == 0:
            raise ValueError('Name is required')
        
        # Remove HTML/script tags
        v = sanitize_html(v)
        
        # Check for SQL injection patterns
        if re.search(r'[;\'\"\\]', v):
            raise ValueError('Invalid characters in name')
        
        # Length validation
        if len(v) > 200:
            raise ValueError('Name must be 200 characters or less')
        
        return v.strip()
    
    @field_validator('description')
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        """Validate and sanitize description field."""
        if v is None:
            return None
        
        # Remove HTML/script tags
        v = sanitize_html(v)
        
        # Length validation
        if len(v) > 1000:
            raise ValueError('Description must be 1000 characters or less')
        
        return v.strip()
```

## SQL Injection Prevention

### Using ORM (Recommended)

```python
# ✅ GOOD: Use ORM with parameterized queries
from sqlalchemy.orm import Session
from sqlalchemy import select

@app.get("/items/{item_id}")
async def get_item(item_id: int, db: Session = Depends(get_db)):
    # ORM automatically handles parameterization
    item = db.query(Item).filter(Item.id == item_id).first()
    return item

# ✅ GOOD: Using SQLModel/SQLAlchemy select
from sqlmodel import select

@app.get("/items/")
async def get_items(name: str, db: Session = Depends(get_db)):
    # Parameterized query - safe from SQL injection
    statement = select(Item).where(Item.name == name)
    items = db.exec(statement).all()
    return items
```

### Raw SQL (If Necessary)

```python
# ✅ GOOD: Use parameterized queries with raw SQL
from sqlalchemy import text

@app.get("/items/")
async def get_items(name: str, db: Session = Depends(get_db)):
    # Parameterized query - safe
    result = db.execute(
        text("SELECT * FROM items WHERE name = :name"),
        {"name": name}
    )
    return result.fetchall()

# ❌ BAD: String concatenation - VULNERABLE TO SQL INJECTION
@app.get("/items/")
async def get_items(name: str, db: Session = Depends(get_db)):
    # NEVER DO THIS - vulnerable to SQL injection
    query = f"SELECT * FROM items WHERE name = '{name}'"
    result = db.execute(text(query))
    return result.fetchall()
```

### Input Validation for SQL Safety

```python
from pydantic import BaseModel, field_validator
import re

class SafeQueryParams(BaseModel):
    name: str | None = None
    order_by: str = "id"
    order_direction: str = "ASC"
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        """Validate name doesn't contain SQL injection patterns."""
        if v is None:
            return None
        
        # Check for SQL injection patterns
        dangerous_patterns = [
            r'[\'";]',  # Quotes and semicolons
            r'--',      # SQL comments
            r'/\*',     # SQL comments
            r'\b(DROP|DELETE|INSERT|UPDATE|ALTER|EXEC)\b',  # SQL keywords
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError('Invalid characters in name parameter')
        
        return v.strip()
    
    @field_validator('order_by')
    @classmethod
    def validate_order_by(cls, v: str) -> str:
        """Whitelist allowed column names for ordering."""
        allowed_columns = ['id', 'name', 'created_at', 'updated_at']
        if v not in allowed_columns:
            raise ValueError(f'order_by must be one of: {", ".join(allowed_columns)}')
        return v
    
    @field_validator('order_direction')
    @classmethod
    def validate_order_direction(cls, v: str) -> str:
        """Validate order direction."""
        if v.upper() not in ['ASC', 'DESC']:
            raise ValueError('order_direction must be ASC or DESC')
        return v.upper()
```

## XSS Prevention

### Output Escaping

```python
from html import escape
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

@app.get("/items/{item_id}", response_class=HTMLResponse)
async def get_item_html(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Escape all user-generated content
    safe_name = escape(item.name)
    safe_description = escape(item.description or "")
    
    html = f"""
    <html>
        <body>
            <h1>{safe_name}</h1>
            <p>{safe_description}</p>
        </body>
    </html>
    """
    return html
```

### JSON Response (Automatic Escaping)

```python
# FastAPI automatically escapes JSON responses
@app.get("/items/{item_id}")
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    return item  # JSON is automatically safe
```

### Content Security Policy

```python
from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI()

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; "
        "font-src 'self';"
    )
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

## File Upload Security

### File Type Validation

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
import magic
from pathlib import Path

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.pdf'}
ALLOWED_MIME_TYPES = {
    'image/jpeg', 'image/png', 'image/gif', 'application/pdf'
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not allowed"
        )
    
    # Read file content
    contents = await file.read()
    
    # Validate file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds maximum allowed size"
        )
    
    # Validate MIME type (magic number check)
    mime_type = magic.from_buffer(contents, mime=True)
    if mime_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"MIME type {mime_type} not allowed"
        )
    
    # Sanitize filename
    safe_filename = sanitize_filename(file.filename)
    
    # Save file securely
    file_path = Path("uploads") / safe_filename
    file_path.write_bytes(contents)
    
    return {"filename": safe_filename, "size": len(contents)}

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal and injection."""
    # Remove path components
    filename = Path(filename).name
    
    # Remove dangerous characters
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    
    # Prevent hidden files
    if filename.startswith('.'):
        filename = 'file_' + filename
    
    return filename
```

## Command Injection Prevention

### Safe Command Execution

```python
import subprocess
from pathlib import Path

# ❌ BAD: Command injection vulnerability
def unsafe_execute_command(user_input: str):
    os.system(f"ls {user_input}")  # DANGEROUS!

# ✅ GOOD: Safe command execution
def safe_execute_command(directory: str):
    # Validate input
    if not directory or '..' in directory or '/' in directory:
        raise ValueError("Invalid directory")
    
    # Use Path for safe path handling
    path = Path(directory)
    if not path.exists() or not path.is_dir():
        raise ValueError("Directory does not exist")
    
    # Use subprocess with list arguments
    result = subprocess.run(
        ['ls', str(path)],
        capture_output=True,
        text=True,
        timeout=5
    )
    return result.stdout
```

## Data Validation Before Database Storage

### Complete Validation Pipeline

```python
from pydantic import BaseModel, field_validator, EmailStr
import re
from typing import Any

class SecureUserCreate(BaseModel):
    """User creation model with comprehensive security validation."""
    
    username: str
    email: EmailStr
    password: str
    bio: str | None = None
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        """Validate username - alphanumeric only, no scripts."""
        if not v or len(v.strip()) == 0:
            raise ValueError('Username is required')
        
        # Remove any HTML/script tags
        v = sanitize_html(v)
        
        # Only allow alphanumeric and underscore
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username must contain only letters, numbers, and underscores')
        
        # Length validation
        if len(v) < 3 or len(v) > 30:
            raise ValueError('Username must be 3-30 characters')
        
        return v.strip()
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        
        # Check for common patterns that might be injection attempts
        dangerous_patterns = ['<script', 'javascript:', 'onerror=', 'onclick=']
        for pattern in dangerous_patterns:
            if pattern.lower() in v.lower():
                raise ValueError('Password contains invalid characters')
        
        return v
    
    @field_validator('bio')
    @classmethod
    def validate_bio(cls, v: str | None) -> str | None:
        """Validate and sanitize bio - remove all HTML/scripts."""
        if v is None:
            return None
        
        # Remove all HTML and script tags
        v = sanitize_html(v)
        
        # Remove SQL injection patterns
        v = sanitize_sql_input(v)
        
        # Length validation
        if len(v) > 500:
            raise ValueError('Bio must be 500 characters or less')
        
        return v.strip()

@app.post("/users/", response_model=UserResponse)
async def create_user(user: SecureUserCreate, db: Session = Depends(get_db)):
    # All validation passed - safe to store
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        bio=user.bio  # Already sanitized
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

## Security Middleware

### Request Validation Middleware

```python
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.base import BaseHTTPMiddleware
import re

class SecurityValidationMiddleware(BaseHTTPMiddleware):
    """Middleware to validate and sanitize all incoming requests."""
    
    async def dispatch(self, request: Request, call_next):
        # Check for suspicious patterns in query parameters
        for key, value in request.query_params.items():
            if self.is_suspicious(value):
                raise HTTPException(
                    status_code=400,
                    detail=f"Suspicious input detected in parameter: {key}"
                )
        
        # Check for suspicious patterns in path parameters
        for key, value in request.path_params.items():
            if self.is_suspicious(value):
                raise HTTPException(
                    status_code=400,
                    detail=f"Suspicious input detected in path: {key}"
                )
        
        response = await call_next(request)
        return response
    
    def is_suspicious(self, value: str) -> bool:
        """Check if value contains suspicious patterns."""
        if not isinstance(value, str):
            return False
        
        suspicious_patterns = [
            r'<script',           # Script tags
            r'javascript:',       # JavaScript URLs
            r'on\w+\s*=',        # Event handlers
            r'[\'";]',           # SQL injection markers
            r'--',               # SQL comments
            r'/\*',              # SQL comments
            r'\.\./',            # Path traversal
            r'<iframe',          # Iframe tags
            r'<object',          # Object tags
            r'<embed',            # Embed tags
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, value, re.IGNORECASE):
                return True
        
        return False

app = FastAPI()
app.add_middleware(SecurityValidationMiddleware)
```

## Best Practices Summary

1. **Always use Pydantic models** - Automatic validation and type checking
2. **Sanitize before storage** - Clean data before database insertion
3. **Use ORM/parameterized queries** - Never concatenate user input into SQL
4. **Validate file uploads** - Check file type, size, and content
5. **Escape output** - Escape HTML when rendering user content
6. **Whitelist allowed values** - For enums, order_by, etc.
7. **Set security headers** - CSP, X-Frame-Options, etc.
8. **Rate limiting** - Prevent abuse and brute force attacks
9. **Input length limits** - Prevent buffer overflow attacks
10. **Log security events** - Monitor for suspicious activity

## Security Checklist

Before storing data in database:

- [ ] Input validated with Pydantic models
- [ ] HTML/script tags removed
- [ ] SQL injection patterns checked
- [ ] File uploads validated (type, size, content)
- [ ] Path traversal prevented
- [ ] Command injection prevented
- [ ] Output properly escaped
- [ ] Security headers set
- [ ] Rate limiting configured
- [ ] Input length limits enforced


