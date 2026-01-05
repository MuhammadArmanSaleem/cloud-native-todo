# Delegation Patterns

How to delegate chunks to skills with rich context.

## Delegation Structure

### Components

Each delegation should include:

1. **Chunk Description**: What needs to be done
2. **Context Package**: Context7 findings and requirements
3. **Dependencies**: What this chunk depends on
4. **Integration Points**: How it connects to other chunks
5. **Edge Cases**: Known edge cases to handle

## Delegation Format

### Template

```text
Delegating to: [skill-name]

Chunk: [chunk title]

Description:
[Clear description of what needs to be built]

Context Package:
- Context7 Findings: [latest patterns, best practices]
- Requirements: [specific requirements]
- Constraints: [any constraints]
- Edge Cases: [known edge cases]

Dependencies:
- Depends on: [other chunks]
- Provides to: [other chunks]

Integration Points:
- Connects with: [other chunks]
- Integration approach: [how to integrate]

Deliverables:
- [Expected outputs]
```

## Delegation Examples

### Example 1: Database Chunk

```text
Delegating to: database-sdd-orchestrator

Chunk: Database Schema for Todo App

Description:
Design secure database schema for todo application with user authentication and todo management.

Context Package:
- Context7 Findings:
  * PostgreSQL password hashing: Use Argon2 with unique salts
  * Schema design: Normalize tables, use proper indexes
  * Security: Implement constraints, audit logging
- Requirements:
  * Users table with secure password storage
  * Todos table with user relationships
  * Indexes for performance
- Constraints:
  * Must use PostgreSQL
  * Must follow security best practices
- Edge Cases:
  * Data integrity violations
  * Migration rollbacks
  * Concurrent access

Dependencies:
- Depends on: None (foundational)
- Provides to: Backend API chunk

Integration Points:
- Connects with: Backend API (provides schema)
- Integration approach: Backend will use this schema

Deliverables:
- SQL migration files
- Schema documentation
- Security functions
```

### Example 2: Backend Chunk

```text
Delegating to: backend-sdd-orchestrator

Chunk: REST API for Todo Operations

Description:
Build FastAPI REST API for todo operations with user authentication, CRUD operations, and error handling.

Context Package:
- Context7 Findings:
  * FastAPI patterns: Use dependency injection, Pydantic models
  * Security: OAuth2, JWT tokens, input validation
  * Error handling: Proper HTTP status codes, error messages
- Requirements:
  * User authentication endpoints
  * Todo CRUD endpoints
  * Input validation
  * Error handling
- Constraints:
  * Must use FastAPI
  * Must follow security best practices
- Edge Cases:
  * Invalid input
  * Authentication failures
  * Database errors

Dependencies:
- Depends on: Database Schema chunk
- Provides to: Frontend UI chunk

Integration Points:
- Connects with: Database (uses schema), Frontend (provides API)
- Integration approach: Frontend will consume these endpoints

Deliverables:
- FastAPI application
- API endpoints
- Authentication system
- Error handling
```

### Example 3: Frontend Chunk

```text
Delegating to: frontend-sdd-orchestrator

Chunk: Todo UI with Voice Controls

Description:
Create Next.js frontend for todo application with minimalist design, voice controls, and real-time updates.

Context Package:
- Context7 Findings:
  * Next.js App Router: Use Server/Client Components
  * Voice UI: Web Speech API integration patterns
  * Styling: Tailwind CSS, minimalist design
- Requirements:
  * Todo list interface
  * Voice input controls
  * User authentication UI
  * Real-time updates
- Constraints:
  * Must use Next.js
  * Must follow minimalist design
- Edge Cases:
  * Empty states
  * Loading states
  * Error states
  * Voice recognition failures

Dependencies:
- Depends on: Backend API chunk
- Provides to: Voice Integration chunk

Integration Points:
- Connects with: Backend API (consumes endpoints), Voice Integration (provides UI)
- Integration approach: Voice integration will enhance this UI

Deliverables:
- Next.js application
- UI components
- Voice controls
- State management
```

## Context Package Details

### Context7 Findings

Include:
- Latest patterns and examples
- Best practices
- Security considerations
- Performance optimization
- Integration approaches

### Requirements

Specify:
- Functional requirements
- Non-functional requirements
- Constraints
- Preferences

### Edge Cases

Document:
- Known edge cases
- Error scenarios
- Failure modes
- Cross-chunk interactions

## Best Practices

1. **Be Specific**: Clear, detailed descriptions
2. **Provide Context**: Rich context packages
3. **Document Dependencies**: Clear dependency chain
4. **Explain Integration**: How chunks connect
5. **Note Edge Cases**: Known issues to handle
6. **Set Expectations**: Clear deliverables

