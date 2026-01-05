---
name: task-triage-orchestrator
description: |
  Analyzes complex, multi-part goals, breaks them into logical chunks, researches each chunk with Context7, and delegates to appropriate specialized skills. Coordinates execution across multiple skills to deliver complete solutions.
  Use when users provide high-level goals requiring multiple components (frontend, backend, database, integrations, etc.) that need systematic breakdown and orchestration.
---

# Task Triage Orchestrator

Analyzes complex goals, breaks them into chunks, researches with Context7, and delegates to specialized skills.

## What This Skill Does

- Analyzes complex, multi-part goals extensively
- Breaks goals into logical, delegatable chunks
- Researches each chunk using Context7 for latest patterns
- Routes chunks to appropriate specialized skills
- Provides rich context to delegated skills
- Coordinates execution order and dependencies
- Tracks overall progress across all chunks

## What This Skill Does NOT Do

- Implement code directly (delegates to specialized skills)
- Handle simple, single-component tasks (use specific skills directly)
- Deploy to production
- Handle infrastructure setup

---

## Before Implementation

Gather context to ensure successful triage:

| Source | Gather |
|--------|--------|
| **User Goal** | Complete goal description, requirements, constraints |
| **Available Skills** | Inventory of available skills and their capabilities |
| **Context7** | Latest patterns and technologies for each chunk |
| **Codebase** | Existing project structure, dependencies, patterns |

Ensure all required context is gathered before triaging.
Only ask user for clarifications if goal is ambiguous or missing critical details.

---

## Required Clarifications

Ask about USER'S context (not workflow knowledge):

1. **Goal Clarity**: "Can you clarify [specific aspect] of your goal?"
2. **Scope**: "Should this include [missing component]?"
3. **Constraints**: "Any specific requirements? (tech stack, timeline, integrations)"
4. **Priority**: "Which parts are most critical?"

---

## Triage Workflow

### Phase 1: Goal Analysis

1. **Parse User Goal**
   - Extract key components (frontend, backend, database, integrations)
   - Identify implicit requirements
   - Note constraints and preferences

2. **Identify Components**
   - Frontend (UI, user interactions)
   - Backend (API, business logic)
   - Database (data storage, schema)
   - Integrations (third-party APIs, services)
   - Special features (voice, AI, automation)

3. **Map to Skills**
   - Frontend → `frontend-sdd-orchestrator`
   - Backend → `backend-sdd-orchestrator`
   - Database → `database-sdd-orchestrator`
   - Other → appropriate specialized skills

### Phase 2: Chunking Strategy

1. **Break into Logical Chunks**
   - Each chunk is independently delegatable
   - Chunks have clear boundaries
   - Dependencies identified between chunks

2. **Determine Execution Order**
   - Database schema first (if needed)
   - Backend API next (depends on schema)
   - Frontend last (depends on API)
   - Integrations in parallel (if independent)

3. **Identify Edge Cases**
   - Cross-chunk dependencies
   - Integration points
   - Error handling across chunks

### Phase 3: Context7 Research

1. **Research Each Chunk**
   - Query Context7 for latest patterns
   - Gather best practices
   - Find integration approaches
   - Document findings

2. **Build Context Package**
   - Latest patterns for chunk
   - Best practices
   - Integration guidance
   - Edge case considerations

### Phase 4: Delegation

1. **Delegate to Specialized Skills**
   - Provide rich context package
   - Explain chunk's role in overall goal
   - Share Context7 findings
   - Specify requirements and constraints

2. **Coordinate Execution**
   - Execute in dependency order
   - Track progress per chunk
   - Handle cross-chunk integration

3. **Validate Completion**
   - Verify all chunks complete
   - Check integration points
   - Validate overall goal met

---

## Chunking Patterns

### Pattern 1: Full-Stack Application

```text
Goal: "Build a todo app with voice automation"

Chunks:
1. Database Schema (database-sdd-orchestrator)
   - Users table
   - Todos table
   - Voice commands table

2. Backend API (backend-sdd-orchestrator)
   - User authentication
   - Todo CRUD operations
   - Voice command processing

3. Frontend UI (frontend-sdd-orchestrator)
   - Todo list interface
   - Voice input controls
   - User authentication UI

4. Voice Integration (research + direct implementation)
   - Speech-to-text API
   - Command parsing
   - Voice feedback
```

### Pattern 2: API Integration

```text
Goal: "Add payment processing to e-commerce app"

Chunks:
1. Payment Provider Research (Context7)
   - Latest payment APIs
   - Security best practices
   - Integration patterns

2. Backend Payment Endpoints (backend-sdd-orchestrator)
   - Payment processing
   - Webhook handling
   - Transaction management

3. Frontend Payment UI (frontend-sdd-orchestrator)
   - Checkout flow
   - Payment form
   - Success/error handling
```

### Pattern 3: Feature Enhancement

```text
Goal: "Add real-time notifications to chat app"

Chunks:
1. Real-time Technology Research (Context7)
   - WebSocket patterns
   - Server-sent events
   - Push notifications

2. Backend Real-time Infrastructure (backend-sdd-orchestrator)
   - WebSocket server
   - Notification service
   - Message broadcasting

3. Frontend Real-time Client (frontend-sdd-orchestrator)
   - WebSocket client
   - Notification UI
   - Real-time updates
```

---

## Skill Routing

### Primary SDD Orchestrators

| Component | Skill | When to Use |
|-----------|-------|-------------|
| Frontend | `frontend-sdd-orchestrator` | UI, user interactions, client-side features |
| Backend | `backend-sdd-orchestrator` | API, business logic, server-side features |
| Database | `database-sdd-orchestrator` | Schema design, migrations, data storage |

### Specialized Skills

| Component | Skill | When to Use |
|-----------|-------|-------------|
| Web Browsing | `browsing-with-playwright` | Web scraping, automation, testing |
| Documentation | `fetch-library-docs` | Library research, API documentation |
| Document Creation | `docx`, `pptx`, `pdf` | Document generation, reports |
| Voice/AI | Research + direct | Voice APIs, AI integrations |

---

## Context7 Integration

### Research Strategy

1. **For Each Chunk**:
   - Identify key technologies
   - Query Context7 for latest patterns
   - Gather best practices
   - Find integration approaches

2. **Build Context Package**:
   - Latest patterns and examples
   - Best practices
   - Security considerations
   - Performance optimization

3. **Provide to Delegated Skill**:
   - Include Context7 findings in delegation
   - Explain relevance to chunk
   - Share code examples if available

---

## Delegation Pattern

### Complete Example

```text
User Goal: "Make a todo app with voice automation like Jarvis"

1. Analysis:
   - Components: Frontend, Backend, Database, Voice AI
   - Dependencies: Database → Backend → Frontend → Voice Integration

2. Chunking:
   Chunk 1: Database Schema
   Chunk 2: Backend API
   Chunk 3: Frontend UI
   Chunk 4: Voice Integration

3. Context7 Research:
   - Voice APIs: Web Speech API, speech recognition patterns
   - Todo app patterns: Best practices, UX patterns
   - Integration: How to connect voice to todo operations

4. Delegation:
   → database-sdd-orchestrator:
      "Design secure database schema for todo app with users and todos.
       Context7 findings: [password security patterns, schema design best practices]"
   
   → backend-sdd-orchestrator:
      "Build REST API for todo operations with user authentication.
       Context7 findings: [FastAPI patterns, security best practices]"
   
   → frontend-sdd-orchestrator:
      "Create todo UI with voice controls and minimalist design.
       Context7 findings: [Next.js patterns, voice UI patterns]"
   
   → Voice Integration (direct implementation):
      "Integrate Web Speech API for voice commands.
       Context7 findings: [speech recognition patterns, command parsing]"

5. Coordination:
   - Execute chunks in order
   - Integrate voice with frontend/backend
   - Validate complete solution
```

---

## Output Checklist

Before completing triage, verify:

- [ ] Goal fully analyzed
- [ ] Chunks identified and logical
- [ ] Dependencies mapped
- [ ] Context7 research completed for each chunk
- [ ] Appropriate skills identified
- [ ] Rich context packages prepared
- [ ] Execution order determined
- [ ] Integration points identified
- [ ] Edge cases considered
- [ ] Delegation instructions clear

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/analysis-patterns.md` | How to analyze complex goals |
| `references/chunking-strategies.md` | Strategies for breaking goals into chunks |
| `references/context7-integration.md` | How to use Context7 for research |
| `references/skill-routing.md` | How to route chunks to appropriate skills |
| `references/delegation-patterns.md` | How to delegate with rich context |
| `references/coordination.md` | How to coordinate multi-chunk execution |

