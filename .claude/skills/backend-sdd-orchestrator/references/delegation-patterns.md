# Delegation to fastapi-backend Skill

How to delegate implementation tasks to the fastapi-backend skill.

## Delegation Workflow

### When to Delegate

Delegate to `fastapi-backend` skill when:
- Creating API endpoints
- Implementing authentication
- Setting up database integration
- Creating Pydantic models
- Implementing security features

### How to Delegate

1. **Load Task Context**
   - Read task from tasks.md
   - Understand requirements
   - Identify edge cases

2. **Invoke fastapi-backend Skill**
   - Use skill's patterns from references/
   - Follow FastAPI best practices
   - Apply security patterns
   - Use proper validation

3. **Verify Implementation**
   - Check against spec requirements
   - Verify edge cases handled
   - Ensure FastAPI best practices

## Task-to-Skill Mapping

### Endpoint Creation Tasks

```text
Task: "Create POST /users endpoint"
    ↓
Delegate to fastapi-backend:
- Use core-concepts.md
- Define request/response models
- Implement validation
- Handle errors
```

### Authentication Tasks

```text
Task: "Implement OAuth2 authentication"
    ↓
Delegate to fastapi-backend:
- Use authentication.md
- Implement token generation
- Add security dependencies
- Handle edge cases
```

### Database Tasks

```text
Task: "Integrate SQLAlchemy database"
    ↓
Delegate to fastapi-backend:
- Use database-patterns.md
- Set up session management
- Create models
- Handle transactions
```

## Integration Pattern

### Complete Example

```text
Task from tasks.md:
"Phase 3.1: Create POST /users endpoint for user registration"

1. Load task context
   - Endpoint should create users
   - Validate input
   - Hash passwords
   - Return user data

2. Delegate to fastapi-backend skill:
   - Create UserCreate model
   - Create UserResponse model
   - Implement password hashing
   - Add validation
   - Handle errors

3. Implement using skill patterns:
   - core-concepts.md for routing
   - authentication.md for password hashing
   - security-validation.md for input sanitization
   - edge-cases.md for error handling

4. Verify:
   - Matches spec requirements
   - Edge cases handled
   - FastAPI best practices followed
```

