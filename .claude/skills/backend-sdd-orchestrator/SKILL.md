---
name: backend-sdd-orchestrator
description: |
  Orchestrates complete backend development using SpecKit Plus workflow (constitution → spec → plan → tasks → implement) with FastAPI backend skill. Handles edge cases, uses Context7 for latest docs, and ensures full SDD process completion.
  Use when users ask to build complete backend APIs, create full server implementations, or develop backend features end-to-end with spec-driven development.
---

# Backend SDD Orchestrator

Orchestrates complete backend development through SpecKit Plus workflow, delegating implementation to FastAPI backend skill.

## What This Skill Does

- Orchestrates full SpecKit Plus workflow for backend development
- Runs constitution → spec → plan → tasks → implement phases automatically
- Delegates implementation to `fastapi-backend` skill
- Handles edge cases and clarifications throughout the process
- Uses Context7 for latest FastAPI documentation
- Ensures complete SDD process with all artifacts created
- Manages feature branches and specification history

## What This Skill Does NOT Do

- Create frontend or database code
- Deploy applications to production
- Handle infrastructure setup
- Create mobile applications

---

## Before Implementation

Gather context to ensure successful orchestration:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing SpecKit Plus setup, constitution, previous specs, project structure |
| **Conversation** | User's goal/feature description, requirements, constraints, preferences |
| **SpecKit Plus** | Workflow templates, scripts, constitution requirements |
| **Domain Skill** | FastAPI patterns from `fastapi-backend` skill references |
| **Context7** | Latest FastAPI documentation when needed for clarifications |

Ensure all required context is gathered before orchestrating.
Only ask user for THEIR specific requirements (SpecKit Plus workflow is embedded in this skill).

---

## Required Clarifications

Ask about USER'S context (not workflow knowledge):

1. **Goal**: "What backend feature/API do you want to build?"
2. **Scope**: "Complete API or specific endpoints?"
3. **Existing project**: "New project or adding to existing codebase?"
4. **Constraints**: "Any specific requirements? (authentication, database, performance)"

---

## Orchestration Workflow

### Phase 1: Constitution Check

1. **Check if constitution exists**
   - Read `.specify/memory/constitution.md`
   - If missing or incomplete → Run `sp.constitution` workflow
   - Ensure backend-specific principles are included

2. **Validate constitution**
   - Check for API development principles
   - Verify alignment with FastAPI best practices
   - Update if needed

### Phase 2: Specification Creation

1. **Run `sp.specify` workflow**
   - Parse user's goal into feature description
   - Create feature branch and spec directory
   - Generate `specs/<feature-name>/spec.md` with:
     - API endpoints
     - Request/response models
     - Authentication requirements
     - Error handling
   - Handle clarifications (max 3 NEEDS CLARIFICATION markers)

2. **Edge Case Handling**
   - Identify edge cases from spec
   - Document in spec.md under "Edge Cases" section
   - Include error scenarios, validation edge cases, security considerations

### Phase 3: Planning

1. **Run `sp.plan` workflow**
   - Generate `specs/<feature-name>/plan.md` with:
     - Technical context
     - Constitution check
     - Phase 0: Research (use Context7 for latest FastAPI patterns)
     - Phase 1: Data models, API contracts
     - Phase 2: Architecture decisions

2. **Context7 Integration**
   - Query latest FastAPI documentation for:
     - Routing patterns
     - Dependency injection
     - Security patterns
     - Database integration
   - Resolve all NEEDS CLARIFICATION items

3. **Edge Case Planning**
   - Plan for error handling
   - Plan for validation edge cases
   - Plan for security edge cases
   - Plan for performance edge cases

### Phase 4: Task Breakdown

1. **Run `sp.tasks` workflow**
   - Generate `specs/<feature-name>/tasks.md` with:
     - Phase 1: Setup (FastAPI project initialization)
     - Phase 2: Foundational (base models, dependencies)
     - Phase 3+: Endpoints in priority order
     - Each task: testable, dependency-ordered

2. **Task Organization**
   - Group by endpoint/feature
   - Order by dependencies
   - Include edge case tasks
   - Add security validation tasks

### Phase 5: Implementation

1. **Delegate to `fastapi-backend` skill**
   - For each task in tasks.md:
     - Load task context
     - Use `fastapi-backend` skill patterns
     - Implement following FastAPI best practices
     - Handle edge cases as specified

2. **Implementation Phases**
   - Phase 1: Project setup and structure
   - Phase 2: Base models and dependencies
   - Phase 3+: Endpoint implementation per feature
   - Final: Security, validation, edge cases

3. **Edge Case Implementation**
   - Input validation
   - Error handling
   - Security checks
   - Performance optimization

### Phase 6: Validation

1. **Run `sp.analyze` workflow**
   - Check consistency with spec
   - Verify all requirements met
   - Validate edge cases handled
   - Check FastAPI best practices followed

2. **Quality Checks**
   - All tasks completed
   - Edge cases handled
   - Security validated
   - Tests passing (if applicable)

---

## Edge Case Handling

### Common Backend Edge Cases

1. **Input Validation**
   - Invalid data types
   - Missing required fields
   - Out-of-range values
   - SQL injection attempts
   - XSS attempts

2. **Authentication/Authorization**
   - Invalid tokens
   - Expired tokens
   - Missing permissions
   - Role-based access
   - Session management

3. **Database Operations**
   - Connection failures
   - Transaction conflicts
   - Data integrity violations
   - Race conditions
   - Deadlocks

4. **API Errors**
   - Rate limiting
   - Timeout handling
   - Resource not found
   - Conflict resolution
   - Partial failures

5. **Security**
   - Input sanitization
   - SQL injection prevention
   - XSS prevention
   - CSRF protection
   - Rate limiting

---

## Context7 Integration

### When to Query Context7

1. **During Planning Phase**
   - Latest FastAPI patterns
   - Security best practices
   - Database integration patterns
   - Performance optimization

2. **During Implementation**
   - Specific API usage
   - Edge case patterns
   - Security patterns
   - Error handling patterns

3. **During Clarification**
   - Resolve technical questions
   - Find recommended approaches
   - Understand trade-offs

---

## Workflow Automation

### Automated Steps

```text
User Goal: "Build a user management API"
    ↓
1. Check/Update Constitution (sp.constitution)
    ↓
2. Create Specification (sp.specify)
    - Parse goal into spec.md
    - Identify edge cases
    ↓
3. Create Plan (sp.plan)
    - Research with Context7
    - Design architecture
    - Plan edge cases
    ↓
4. Create Tasks (sp.tasks)
    - Break into testable tasks
    - Order by dependencies
    ↓
5. Implement (using fastapi-backend skill)
    - Execute each task
    - Handle edge cases
    - Follow FastAPI patterns
    ↓
6. Analyze (sp.analyze)
    - Validate completion
    - Check quality
```

---

## Output Checklist

Before completing orchestration, verify:

- [ ] Constitution checked/updated
- [ ] Specification created (spec.md)
- [ ] Plan created (plan.md) with all clarifications resolved
- [ ] Tasks created (tasks.md) with dependencies
- [ ] All tasks implemented
- [ ] Edge cases handled
- [ ] Security validated
- [ ] Context7 used for latest patterns
- [ ] FastAPI best practices followed
- [ ] Code validated and tested
- [ ] PHR created for workflow

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/speckit-workflow.md` | SpecKit Plus workflow phases and commands |
| `references/edge-cases.md` | Common backend edge cases and handling patterns |
| `references/context7-integration.md` | How to use Context7 during orchestration |
| `references/delegation-patterns.md` | How to delegate to fastapi-backend skill |

