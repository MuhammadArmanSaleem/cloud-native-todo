# FastAPI Authentication Patterns

Authentication and authorization patterns for FastAPI applications.

## OAuth2 with Password Flow

### Basic Setup

```python
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

### User Model

```python
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr | None = None
    full_name: str | None = None

class UserInDB(UserBase):
    hashed_password: str

class User(UserBase):
    disabled: bool | None = None
```

### Token Generation

```python
from datetime import datetime, timedelta
from typing import Annotated
from jose import JWTError, jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### Authentication Dependencies

```python
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
```

### Login Endpoint

```python
@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return current_user
```

## API Key Authentication

### Header API Key

```python
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import APIKeyHeader

API_KEY = "your-api-key"
api_key_header = APIKeyHeader(name="X-API-Key")

async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API Key"
        )
    return api_key

@app.get("/protected/")
async def protected_route(api_key: str = Depends(get_api_key)):
    return {"message": "Access granted"}
```

### Query Parameter API Key

```python
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import APIKeyQuery

api_key_query = APIKeyQuery(name="api_key")

async def get_api_key(api_key: str = Depends(api_key_query)):
    if api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API Key"
        )
    return api_key
```

## Role-Based Access Control

### Role Dependencies

```python
from enum import Enum
from typing import Annotated

class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

def require_role(required_role: Role):
    async def role_checker(
        current_user: Annotated[User, Depends(get_current_active_user)]
    ):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user
    return role_checker

@app.get("/admin/")
async def admin_route(
    user: Annotated[User, Depends(require_role(Role.ADMIN))]
):
    return {"message": "Admin access"}
```

## JWT Token with Refresh

### Token Models

```python
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
```

### Refresh Token Endpoint

```python
@app.post("/refresh")
async def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(
            refresh_token, SECRET_KEY, algorithms=[ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    access_token = create_access_token(data={"sub": username})
    return {"access_token": access_token, "token_type": "bearer"}
```

## Security Best Practices

1. **Never store passwords in plain text** - Always hash passwords
2. **Use environment variables** for secrets - Never hardcode
3. **Set appropriate token expiration** - Short-lived access tokens
4. **Use HTTPS in production** - Protect tokens in transit
5. **Validate tokens properly** - Check expiration and signature
6. **Implement rate limiting** - Prevent brute force attacks
7. **Use secure password hashing** - bcrypt, argon2, etc.
8. **Store refresh tokens securely** - HttpOnly cookies or secure storage
9. **Implement token rotation** - Refresh tokens should be rotated
10. **Log authentication events** - Monitor for suspicious activity

## Common Patterns

### Password Verification

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

### User Authentication

```python
def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
```

### Optional Authentication

```python
from typing import Annotated, Optional

async def get_current_user_optional(
    token: Annotated[Optional[str], Depends(oauth2_scheme)] = None
):
    if token is None:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None
    return get_user(fake_users_db, username=username)
```


