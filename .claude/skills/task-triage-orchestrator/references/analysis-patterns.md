# Goal Analysis Patterns

How to analyze complex goals and identify components.

## Analysis Framework

### Step 1: Parse Goal

Extract:
- **Nouns**: Entities, components, features
- **Verbs**: Actions, operations, behaviors
- **Adjectives**: Qualities, constraints, requirements
- **Implicit Requirements**: Unstated but necessary components

### Step 2: Identify Components

#### Frontend Components
- User interfaces
- User interactions
- Client-side logic
- Visual design
- User experience

#### Backend Components
- API endpoints
- Business logic
- Data processing
- Authentication/authorization
- Server-side operations

#### Database Components
- Data storage
- Schema design
- Data relationships
- Data integrity
- Migrations

#### Integration Components
- Third-party APIs
- External services
- Webhooks
- Real-time features
- AI/ML services

### Step 3: Map to Skills

| Component Type | Skill | Example |
|----------------|-------|---------|
| Frontend UI | `frontend-sdd-orchestrator` | "Build todo list interface" |
| Backend API | `backend-sdd-orchestrator` | "Create REST API for todos" |
| Database Schema | `database-sdd-orchestrator` | "Design user and todo tables" |
| Web Automation | `browsing-with-playwright` | "Scrape data from website" |
| Documentation | `fetch-library-docs` | "Get latest React patterns" |

## Analysis Examples

### Example 1: Full-Stack App

```text
Goal: "Build a todo app with voice automation"

Analysis:
- Nouns: todo app, voice automation
- Verbs: build
- Implicit: user management, data storage, API, UI

Components Identified:
1. Database: Users, Todos, Voice Commands
2. Backend: Authentication, Todo CRUD, Voice Processing
3. Frontend: Todo UI, Voice Controls, Auth UI
4. Integration: Voice API (Web Speech API)

Skills Needed:
- database-sdd-orchestrator
- backend-sdd-orchestrator
- frontend-sdd-orchestrator
- Direct implementation (voice integration)
```

### Example 2: API Integration

```text
Goal: "Add payment processing to e-commerce app"

Analysis:
- Nouns: payment processing, e-commerce app
- Verbs: add
- Implicit: payment provider, webhooks, transaction management

Components Identified:
1. Backend: Payment endpoints, webhook handlers
2. Frontend: Checkout flow, payment form
3. Integration: Payment provider API (Stripe, PayPal)
4. Database: Transaction records (if new)

Skills Needed:
- backend-sdd-orchestrator
- frontend-sdd-orchestrator
- database-sdd-orchestrator (if new tables)
- Context7 research (payment APIs)
```

### Example 3: Feature Enhancement

```text
Goal: "Add real-time notifications to chat app"

Analysis:
- Nouns: notifications, chat app
- Verbs: add
- Implicit: WebSocket, notification service, UI updates

Components Identified:
1. Backend: WebSocket server, notification service
2. Frontend: Notification UI, WebSocket client
3. Integration: Real-time infrastructure

Skills Needed:
- backend-sdd-orchestrator
- frontend-sdd-orchestrator
- Context7 research (WebSocket patterns)
```

## Dependency Analysis

### Dependency Types

1. **Data Dependencies**: Database schema must exist before backend can use it
2. **API Dependencies**: Backend API must exist before frontend can consume it
3. **Integration Dependencies**: External services must be configured before use
4. **Feature Dependencies**: Some features depend on others

### Dependency Graph

```text
Example: Todo App with Voice

Database Schema
    ↓
Backend API (depends on schema)
    ↓
Frontend UI (depends on API)
    ↓
Voice Integration (depends on Frontend + Backend)
```

## Edge Case Identification

### Cross-Chunk Edge Cases

1. **Integration Points**: How chunks connect
2. **Error Propagation**: Errors across chunks
3. **Data Consistency**: Data flow between chunks
4. **State Management**: Shared state across chunks

### Example Edge Cases

```text
Todo App with Voice:

1. Voice command fails → How does UI handle it?
2. Backend API error → How does frontend display it?
3. Database connection lost → How do all layers handle it?
4. Voice command conflicts with UI action → Which takes precedence?
```

## Best Practices

1. **Be Thorough**: Identify all implicit requirements
2. **Think Dependencies**: Map execution order
3. **Consider Edge Cases**: Cross-chunk interactions
4. **Identify Skills**: Map components to skills
5. **Document Assumptions**: Note any assumptions made

