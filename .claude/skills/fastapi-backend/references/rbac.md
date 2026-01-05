# FastAPI RBAC (Role-Based Access Control)

Comprehensive RBAC implementation patterns for FastAPI applications.

## RBAC Overview

Role-Based Access Control (RBAC) provides fine-grained access control based on user roles and permissions. This ensures users can only access resources and perform actions they're authorized for.

## Basic RBAC Structure

### User Model with Roles

```python
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="user")  # user, admin, moderator
    
    # Relationships
    permissions = relationship("UserPermission", back_populates="user")
```

### Role Enum

```python
from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"
    GUEST = "guest"
```

### Permission Enum

```python
from enum import Enum

class Permission(str, Enum):
    # User permissions
    READ_USERS = "read:users"
    WRITE_USERS = "write:users"
    DELETE_USERS = "delete:users"
    
    # Post permissions
    READ_POSTS = "read:posts"
    WRITE_POSTS = "write:posts"
    DELETE_POSTS = "delete:posts"
    MODERATE_POSTS = "moderate:posts"
    
    # Admin permissions
    MANAGE_ROLES = "manage:roles"
    MANAGE_PERMISSIONS = "manage:permissions"
```

## Role-Based Dependencies

### Basic Role Checker

```python
from typing import Annotated
from fastapi import Depends, HTTPException, status
from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Token validation logic
    return user

def require_role(required_role: Role):
    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)]
    ):
        if current_user.role != required_role.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {required_role.value} role"
            )
        return current_user
    return role_checker

# Usage
@app.get("/admin/users")
async def get_all_users(
    user: Annotated[User, Depends(require_role(Role.ADMIN))]
):
    return {"users": []}
```

### Multiple Roles Checker

```python
def require_roles(*allowed_roles: Role):
    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)]
    ):
        if current_user.role not in [role.value for role in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker

# Usage
@app.get("/moderate/posts")
async def moderate_posts(
    user: Annotated[User, Depends(require_roles(Role.ADMIN, Role.MODERATOR))]
):
    return {"posts": []}
```

## Permission-Based Access Control

### Permission Checker

```python
from typing import Annotated, List
from fastapi import Depends, HTTPException, status

class Permission:
    def __init__(self, name: str):
        self.name = name

# Define permissions
READ_USERS = Permission("read:users")
WRITE_USERS = Permission("write:users")
DELETE_USERS = Permission("delete:users")

# Role to permissions mapping
ROLE_PERMISSIONS = {
    Role.ADMIN: [
        READ_USERS, WRITE_USERS, DELETE_USERS,
        READ_POSTS, WRITE_POSTS, DELETE_POSTS, MODERATE_POSTS
    ],
    Role.MODERATOR: [
        READ_POSTS, WRITE_POSTS, MODERATE_POSTS
    ],
    Role.USER: [
        READ_POSTS, WRITE_POSTS
    ]
}

def get_user_permissions(user: User) -> List[Permission]:
    """Get all permissions for a user based on their role."""
    return ROLE_PERMISSIONS.get(Role(user.role), [])

def require_permission(permission: Permission):
    async def permission_checker(
        current_user: Annotated[User, Depends(get_current_user)]
    ):
        user_permissions = get_user_permissions(current_user)
        
        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires permission: {permission.name}"
            )
        return current_user
    return permission_checker

# Usage
@app.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: Annotated[User, Depends(require_permission(DELETE_USERS))]
):
    # Delete user logic
    return {"message": "User deleted"}
```

## Database-Based RBAC

### Permission Model

```python
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

# Many-to-many relationship
user_permissions = Table(
    'user_permissions',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('permission_id', Integer, ForeignKey('permissions.id'))
)

class Permission(Base):
    __tablename__ = "permissions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    
    users = relationship("User", secondary=user_permissions, back_populates="permissions")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default="user")
    
    permissions = relationship("Permission", secondary=user_permissions, back_populates="users")
```

### Database Permission Checker

```python
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DBDep = Annotated[Session, Depends(get_db)]

def require_permission(permission_name: str):
    async def permission_checker(
        current_user: Annotated[User, Depends(get_current_user)],
        db: DBDep
    ):
        # Check if user has permission directly or through role
        user_permission = db.query(Permission).join(
            UserPermission
        ).filter(
            UserPermission.user_id == current_user.id,
            Permission.name == permission_name
        ).first()
        
        if not user_permission:
            # Check role-based permissions
            role_permissions = ROLE_PERMISSIONS.get(Role(current_user.role), [])
            if permission_name not in [p.name for p in role_permissions]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Requires permission: {permission_name}"
                )
        
        return current_user
    return permission_checker
```

## Resource-Based Authorization

### Owner or Admin Check

```python
def require_owner_or_admin(resource_user_id: int):
    async def owner_checker(
        current_user: Annotated[User, Depends(get_current_user)]
    ):
        is_owner = current_user.id == resource_user_id
        is_admin = current_user.role == Role.ADMIN.value
        
        if not (is_owner or is_admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this resource"
            )
        return current_user
    return owner_checker

# Usage
@app.put("/posts/{post_id}")
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: DBDep
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if user is owner or admin
    if post.author_id != current_user.id and current_user.role != Role.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post"
        )
    
    # Update post
    return post
```

## Advanced RBAC Patterns

### Hierarchical Roles

```python
class RoleHierarchy:
    """Define role hierarchy for inheritance."""
    
    HIERARCHY = {
        Role.ADMIN: [Role.MODERATOR, Role.USER],
        Role.MODERATOR: [Role.USER],
        Role.USER: []
    }
    
    @classmethod
    def has_role(cls, user_role: Role, required_role: Role) -> bool:
        """Check if user role includes required role."""
        if user_role == required_role:
            return True
        
        # Check if required role is in hierarchy
        inherited_roles = cls.HIERARCHY.get(user_role, [])
        return required_role in inherited_roles

def require_role_hierarchical(required_role: Role):
    async def role_checker(
        current_user: Annotated[User, Depends(get_current_user)]
    ):
        user_role = Role(current_user.role)
        
        if not RoleHierarchy.has_role(user_role, required_role):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {required_role.value} role or higher"
            )
        return current_user
    return role_checker
```

### Context-Based Permissions

```python
def require_permission_in_context(permission: Permission, get_context):
    """Check permission within a specific context."""
    async def context_checker(
        current_user: Annotated[User, Depends(get_current_user)],
        db: DBDep
    ):
        context = get_context(db)
        
        # Check if user has permission in this context
        if not has_permission_in_context(current_user, permission, context):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Not authorized for this action"
            )
        return current_user
    return context_checker
```

## RBAC Decorator Pattern

### Custom Decorator

```python
from functools import wraps
from typing import Callable

def require_role_decorator(required_role: Role):
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract current_user from kwargs
            current_user = kwargs.get('current_user')
            
            if not current_user or current_user.role != required_role.value:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Requires {required_role.value} role"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

## Complete RBAC Example

### Full Implementation

```python
from typing import Annotated, List
from fastapi import Depends, FastAPI, HTTPException, status
from enum import Enum
from sqlalchemy.orm import Session

app = FastAPI()

class Role(str, Enum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"

class Permission(str, Enum):
    READ_USERS = "read:users"
    WRITE_USERS = "write:users"
    DELETE_USERS = "delete:users"
    MODERATE_POSTS = "moderate:posts"

ROLE_PERMISSIONS = {
    Role.ADMIN: [Permission.READ_USERS, Permission.WRITE_USERS, Permission.DELETE_USERS, Permission.MODERATE_POSTS],
    Role.MODERATOR: [Permission.MODERATE_POSTS],
    Role.USER: []
}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Token validation
    return user

def get_user_permissions(user: User) -> List[Permission]:
    return ROLE_PERMISSIONS.get(Role(user.role), [])

def require_permission(permission: Permission):
    async def permission_checker(
        current_user: Annotated[User, Depends(get_current_user)]
    ):
        user_permissions = get_user_permissions(current_user)
        
        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires permission: {permission.value}"
            )
        return current_user
    return permission_checker

@app.get("/users/")
async def list_users(
    current_user: Annotated[User, Depends(require_permission(Permission.READ_USERS))]
):
    return {"users": []}

@app.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: Annotated[User, Depends(require_permission(Permission.DELETE_USERS))]
):
    return {"message": "User deleted"}
```

## Best Practices

1. **Principle of Least Privilege** - Grant minimum permissions needed
2. **Role Hierarchy** - Use hierarchical roles when appropriate
3. **Permission Granularity** - Fine-grained permissions for flexibility
4. **Database Storage** - Store roles/permissions in database for dynamic management
5. **Audit Logging** - Log all authorization decisions
6. **Cache Permissions** - Cache user permissions for performance
7. **Default Deny** - Deny access by default, explicitly allow
8. **Regular Reviews** - Regularly review and update permissions

