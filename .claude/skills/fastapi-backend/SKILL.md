---
name: fastapi-backend
description: |
  Build production-ready FastAPI applications with proper structure, routing, validation, database integration, authentication, and best practices.
  Use when users ask to create FastAPI apps, build REST APIs, implement endpoints, add authentication, integrate databases, or develop backend services with FastAPI.
---

# FastAPI Backend Builder

Create production-ready FastAPI applications following best practices and patterns.

## What This Skill Does

- Creates FastAPI applications with proper project structure
- Implements REST API endpoints with validation and error handling
- Sets up database integration (SQLAlchemy, SQLModel, async patterns)
- Implements authentication and authorization (OAuth2, JWT, API keys)
- Configures middleware, CORS, and security headers
- Creates Pydantic models for request/response validation
- Implements dependency injection patterns
- Sets up testing infrastructure
- Configures deployment-ready applications

## What This Skill Does NOT Do

- Deploy applications to production servers
- Manage infrastructure or cloud resources
- Handle frontend development
- Create mobile applications
- Manage CI/CD pipelines (but can provide configuration examples)

---

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing FastAPI structure, patterns, database setup, authentication methods, project conventions |
| **Conversation** | User's specific requirements, API endpoints needed, database choice, authentication needs, constraints |
| **Skill References** | FastAPI patterns from `references/` (routing, validation, database, security, best practices) |
| **User Guidelines** | Project-specific conventions, team standards, coding style preferences |

Ensure all required context is gathered before implementing.
Only ask user for THEIR specific requirements (domain expertise is in this skill).

---

## Required Clarifications

Ask about USER'S context (not domain knowledge):

1. **Project scope**: "New FastAPI app or adding to existing project?"
2. **Endpoints**: "What API endpoints do you need? (CRUD operations, specific routes)"
3. **Database**: "What database? (SQLite, PostgreSQL, MySQL, MongoDB, or none)"
4. **Authentication**: "Do you need authentication? (OAuth2, JWT, API keys, or none)"
5. **Constraints**: "Any specific requirements? (Python version, dependencies, deployment target)"

---

## Output Specification

### Application Structure

```
project/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance
│   ├── config.py            # Configuration settings
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
│   │   ├── security.py      # Auth utilities
│   │   └── database.py      # DB setup
│   └── db/                  # Database models
│       ├── __init__.py
│       └── models.py
├── tests/
│   ├── __init__.py
│   └── test_api.py
├── requirements.txt
└── README.md
```

### Code Standards

- Use type hints throughout (Python 3.10+ style: `str | None` preferred over `Union[str, None]`)
- Use `Annotated` for dependency injection (modern FastAPI pattern)
- Pydantic v2 models with proper validation
- Async/await for I/O operations
- Proper error handling with HTTPException
- Response models for all endpoints
- OpenAPI documentation with tags and descriptions

---

## Domain Standards

### Must Follow

- **Type Safety**: Always use type hints; FastAPI uses them for validation
- **Pydantic Models**: Use Pydantic models for request/response validation
- **Dependency Injection**: Use `Depends()` for reusable logic (auth, DB sessions)
- **Async First**: Use `async def` for path operations; sync only when necessary
- **Error Handling**: Use `HTTPException` with appropriate status codes
- **Response Models**: Define `response_model` for all endpoints
- **Documentation**: Add `summary`, `description`, and `tags` to endpoints
- **Security**: Never hardcode secrets; use environment variables
- **Database Sessions**: Use dependency injection for DB sessions; close properly
- **Validation**: Leverage Pydantic validators for complex validation
- **Input Sanitization**: Sanitize all user input to prevent XSS and injection attacks
- **SQL Injection Prevention**: Always use parameterized queries (ORM/parameterized SQL)
- **Data Validation**: Validate and sanitize data before database storage
- **Output Escaping**: Escape HTML/scripts when rendering user content
- **RBAC Implementation**: Implement Role-Based Access Control with roles and permissions
- **Authorization Checks**: Verify user permissions before allowing resource access

### Must Avoid

- **Synchronous DB Operations**: Don't use sync DB operations in async endpoints
- **Global State**: Avoid global variables; use dependencies
- **Hardcoded Values**: Never hardcode URLs, secrets, or configuration
- **Missing Error Handling**: Always handle potential errors
- **Skipping Validation**: Don't skip request/response validation
- **Blocking Operations**: Avoid blocking I/O in async functions
- **Circular Dependencies**: Structure dependencies to avoid cycles
- **Security Anti-patterns**: Don't store passwords in plain text, expose sensitive data
- **SQL String Concatenation**: Never concatenate user input into SQL queries
- **Unsanitized Input**: Never store user input without sanitization (HTML/scripts/SQL)
- **Trusting User Input**: Always validate and sanitize before database storage
- **Script Tag Storage**: Never allow HTML/script tags to be stored in database

---

## Implementation Workflow

1. **Project Setup**
   - Create application structure
   - Set up configuration management
   - Initialize FastAPI app with proper settings

2. **Models & Schemas**
   - Define Pydantic models for requests/responses
   - Create database models if needed
   - Set up model relationships

3. **Database Integration** (if needed)
   - Configure database connection
   - Set up session management
   - Create database models
   - Implement migrations setup

4. **API Endpoints**
   - Create route handlers
   - Implement request validation
   - Add response models
   - Configure OpenAPI documentation

5. **Dependencies**
   - Set up shared dependencies
   - Implement authentication dependencies
   - Create database session dependencies

6. **Security** (if needed)
   - Implement authentication
   - Set up authorization
   - Configure CORS and security headers
   - Add rate limiting if required
   - **Input sanitization**: Remove HTML/script tags from user input
   - **SQL injection prevention**: Use parameterized queries only
   - **Data validation**: Validate and sanitize before database storage
   - **Output escaping**: Escape HTML when rendering user content

7. **Error Handling**
   - Create custom exception handlers
   - Set up validation error handling
   - Add proper error responses

8. **Testing** (optional but recommended)
   - Set up test client
   - Create test fixtures
   - Write endpoint tests

---

## Common Patterns

### Basic Endpoint

```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI()

class ItemCreate(BaseModel):
    name: str
    description: str | None = None

class ItemResponse(BaseModel):
    id: int
    name: str
    description: str | None

@app.post("/items/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate):
    # Implementation
    return ItemResponse(id=1, **item.model_dump())
```

### Dependency Injection

```python
from typing import Annotated
from fastapi import Depends, FastAPI

def get_db():
    # Database session logic
    yield session

DBDep = Annotated[Session, Depends(get_db)]

@app.get("/items/")
async def get_items(db: DBDep):
    # Use db session
    pass
```

### Authentication

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Validate token and return user
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user
```

See `references/` for detailed patterns and examples.

---

## Output Checklist

Before delivering, verify:

- [ ] Application structure follows best practices
- [ ] All endpoints have request/response models
- [ ] Type hints used throughout
- [ ] Error handling implemented
- [ ] Authentication configured (if needed)
- [ ] Database integration set up (if needed)
- [ ] Dependencies properly injected
- [ ] OpenAPI documentation complete
- [ ] No hardcoded secrets or configuration
- [ ] Async patterns used correctly
- [ ] Code follows project conventions
- [ ] Tests included (if requested)
- [ ] **Input sanitization implemented** - HTML/script tags removed from user input
- [ ] **SQL injection prevention** - Only parameterized queries used
- [ ] **Data validation before storage** - All user input validated and sanitized
- [ ] **Output escaping** - HTML escaped when rendering user content
- [ ] **Security headers configured** - CSP, X-Frame-Options, etc.

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/core-concepts.md` | Understanding FastAPI fundamentals, routing, validation |
| `references/database-patterns.md` | Database integration, SQLAlchemy, SQLModel, async DB operations |
| `references/authentication.md` | OAuth2, JWT, API keys, security patterns |
| `references/dependency-injection.md` | Dependency patterns, shared dependencies, sub-dependencies |
| `references/best-practices.md` | Production patterns, performance, security, testing |
| `references/anti-patterns.md` | Common mistakes to avoid |
| `references/request-response.md` | Request parameters, body validation, response models |
| `references/security-validation.md` | **Input sanitization, SQL injection prevention, XSS prevention, data validation before storage** |
| `references/rbac.md` | **Role-Based Access Control, permissions, role hierarchies, resource-based authorization** |

