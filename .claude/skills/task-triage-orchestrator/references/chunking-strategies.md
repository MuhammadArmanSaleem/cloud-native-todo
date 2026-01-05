# Chunking Strategies

How to break complex goals into logical, delegatable chunks.

## Chunking Principles

### 1. Independence
Each chunk should be independently delegatable with clear boundaries.

### 2. Completeness
Each chunk should be a complete, testable unit.

### 3. Dependencies
Chunks should have clear, minimal dependencies.

### 4. Delegatability
Each chunk should map to a specific skill or implementation approach.

## Chunking Patterns

### Pattern 1: Layer-Based Chunking

Break by architectural layers:

```text
Goal: "Build a todo app"

Chunks:
1. Database Layer (database-sdd-orchestrator)
   - Schema design
   - Tables and relationships
   - Constraints and indexes

2. Backend Layer (backend-sdd-orchestrator)
   - API endpoints
   - Business logic
   - Authentication

3. Frontend Layer (frontend-sdd-orchestrator)
   - UI components
   - User interactions
   - State management
```

### Pattern 2: Feature-Based Chunking

Break by features:

```text
Goal: "Add user authentication to app"

Chunks:
1. Database: User tables and authentication schema
2. Backend: Authentication endpoints and logic
3. Frontend: Login/register UI and flows
```

### Pattern 3: Integration-Based Chunking

Break by integrations:

```text
Goal: "Add payment processing"

Chunks:
1. Research: Payment provider APIs (Context7)
2. Backend: Payment endpoints and webhooks
3. Frontend: Payment UI and checkout flow
4. Integration: Connect to payment provider
```

## Chunk Characteristics

### Good Chunks

✅ **Clear Boundaries**: Well-defined scope
✅ **Single Responsibility**: One primary purpose
✅ **Testable**: Can be validated independently
✅ **Delegatable**: Maps to specific skill
✅ **Dependency-Aware**: Clear dependencies

### Bad Chunks

❌ **Too Broad**: "Build the entire app"
❌ **Too Narrow**: "Create one function"
❌ **Unclear Scope**: Vague boundaries
❌ **Mixed Concerns**: Multiple unrelated tasks
❌ **Circular Dependencies**: Chunks depend on each other

## Chunk Sizing

### Small Chunks (1-2 days)
- Single feature
- Simple integration
- One component

### Medium Chunks (3-5 days)
- Feature with multiple components
- Integration with backend/frontend
- Complex component

### Large Chunks (1+ weeks)
- Full layer (database, backend, frontend)
- Major feature with dependencies
- Complete integration

## Dependency Management

### Dependency Types

1. **Sequential**: Chunk B depends on Chunk A completing
2. **Parallel**: Chunks can execute simultaneously
3. **Partial**: Chunk B needs some of Chunk A

### Dependency Graph Example

```text
Chunk 1: Database Schema
    ↓
Chunk 2: Backend API (depends on Chunk 1)
    ↓
Chunk 3: Frontend UI (depends on Chunk 2)
    ↓
Chunk 4: Voice Integration (depends on Chunk 2 and 3)
```

### Parallel Execution

```text
Chunk 1: Database Schema
    ↓
Chunk 2: Backend API ──┐
    ↓                   │
Chunk 3: Frontend UI ───┼──→ Chunk 4: Integration
    ↓                   │
Chunk 5: Documentation ──┘
```

## Chunk Descriptions

### Format

Each chunk should include:

1. **Title**: Clear, descriptive name
2. **Scope**: What's included
3. **Dependencies**: What it depends on
4. **Deliverables**: What it produces
5. **Skill**: Which skill handles it
6. **Context**: Context7 findings and requirements

### Example

```text
Chunk 1: Database Schema for Todo App

Scope:
- Users table with secure password storage
- Todos table with relationships
- Indexes for performance

Dependencies:
- None (foundational)

Deliverables:
- SQL migration files
- Schema documentation
- Security functions

Skill: database-sdd-orchestrator

Context:
- Context7 findings: PostgreSQL password hashing best practices
- Requirements: Argon2 hashing, unique salts, constraints
- Edge cases: Data integrity, migration rollbacks
```

## Best Practices

1. **Start with Foundation**: Database schema first
2. **Build Upward**: Backend then frontend
3. **Integrate Last**: Add integrations after core
4. **Keep Chunks Focused**: One primary purpose
5. **Document Dependencies**: Clear execution order
6. **Consider Edge Cases**: Cross-chunk interactions
7. **Validate Completeness**: All parts of goal covered

