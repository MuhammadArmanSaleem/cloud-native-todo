# Skill Routing

How to route chunks to appropriate specialized skills.

## Primary SDD Orchestrators

### Frontend Chunks

**Skill**: `frontend-sdd-orchestrator`

**When to Use**:
- UI components
- User interactions
- Client-side logic
- Visual design
- User experience

**Example**:
```text
Chunk: "Create todo list UI with voice controls"
→ Route to: frontend-sdd-orchestrator
```

### Backend Chunks

**Skill**: `backend-sdd-orchestrator`

**When to Use**:
- API endpoints
- Business logic
- Server-side operations
- Authentication/authorization
- Data processing

**Example**:
```text
Chunk: "Build REST API for todo operations"
→ Route to: backend-sdd-orchestrator
```

### Database Chunks

**Skill**: `database-sdd-orchestrator`

**When to Use**:
- Schema design
- Table creation
- Migrations
- Data integrity
- Security functions

**Example**:
```text
Chunk: "Design secure database schema for todos"
→ Route to: database-sdd-orchestrator
```

## Specialized Skills

### Web Browsing

**Skill**: `browsing-with-playwright`

**When to Use**:
- Web scraping
- Browser automation
- Form submission
- UI testing
- Data extraction

**Example**:
```text
Chunk: "Scrape product data from e-commerce site"
→ Route to: browsing-with-playwright
```

### Documentation

**Skill**: `fetch-library-docs`

**When to Use**:
- Library research
- API documentation
- Code examples
- Best practices

**Example**:
```text
Chunk: "Get latest React patterns and examples"
→ Route to: fetch-library-docs
```

### Document Creation

**Skills**: `docx`, `pptx`, `pdf`

**When to Use**:
- Document generation
- Reports
- Presentations
- PDF creation

**Example**:
```text
Chunk: "Generate project documentation report"
→ Route to: docx or pdf
```

## Direct Implementation

### When to Implement Directly

Some chunks don't map to existing skills:

1. **New Integrations**: Voice APIs, AI services
2. **Custom Logic**: Project-specific features
3. **Configuration**: Setup, deployment
4. **Research**: Technology evaluation

**Example**:
```text
Chunk: "Integrate Web Speech API for voice commands"
→ Implement directly (no specific skill)
→ Use Context7 findings
→ Follow best practices
```

## Routing Decision Tree

```text
Is it a frontend task?
  Yes → frontend-sdd-orchestrator
  No ↓

Is it a backend task?
  Yes → backend-sdd-orchestrator
  No ↓

Is it a database task?
  Yes → database-sdd-orchestrator
  No ↓

Is it web browsing/automation?
  Yes → browsing-with-playwright
  No ↓

Is it documentation research?
  Yes → fetch-library-docs
  No ↓

Is it document creation?
  Yes → docx/pptx/pdf
  No ↓

Implement directly with Context7 findings
```

## Routing Examples

### Example 1: Full-Stack App

```text
Goal: "Build todo app with voice automation"

Chunks:
1. Database Schema → database-sdd-orchestrator
2. Backend API → backend-sdd-orchestrator
3. Frontend UI → frontend-sdd-orchestrator
4. Voice Integration → Direct implementation
```

### Example 2: API Integration

```text
Goal: "Add payment processing"

Chunks:
1. Payment Research → fetch-library-docs
2. Backend Payment → backend-sdd-orchestrator
3. Frontend Checkout → frontend-sdd-orchestrator
4. Provider Integration → Direct implementation
```

### Example 3: Feature Enhancement

```text
Goal: "Add real-time notifications"

Chunks:
1. WebSocket Research → fetch-library-docs
2. Backend WebSocket → backend-sdd-orchestrator
3. Frontend Client → frontend-sdd-orchestrator
```

## Best Practices

1. **Match Skill to Task**: Use most appropriate skill
2. **Consider Dependencies**: Route in correct order
3. **Use SDD Orchestrators**: For full development workflows
4. **Direct Implementation**: For new/integration tasks
5. **Document Routing**: Explain why each route chosen

