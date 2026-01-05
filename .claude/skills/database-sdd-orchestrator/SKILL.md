---
name: database-sdd-orchestrator
description: |
  Orchestrates complete database development using SpecKit Plus workflow (constitution → spec → plan → tasks → implement) with PostgreSQL database skill. Handles edge cases, uses Context7 for latest docs, and ensures full SDD process completion.
  Use when users ask to design complete database schemas, create full database implementations, or develop database features end-to-end with spec-driven development.
---

# Database SDD Orchestrator

Orchestrates complete database development through SpecKit Plus workflow, delegating implementation to PostgreSQL database skill.

## What This Skill Does

- Orchestrates full SpecKit Plus workflow for database development
- Runs constitution → spec → plan → tasks → implement phases automatically
- Delegates implementation to `postgresql-database` skill
- Handles edge cases and clarifications throughout the process
- Uses Context7 for latest PostgreSQL documentation
- Ensures complete SDD process with all artifacts created
- Manages feature branches and specification history

## What This Skill Does NOT Do

- Create frontend or backend code
- Deploy databases to production
- Handle infrastructure setup
- Create application-level code

---

## Before Implementation

Gather context to ensure successful orchestration:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing SpecKit Plus setup, constitution, previous specs, project structure |
| **Conversation** | User's goal/feature description, requirements, constraints, preferences |
| **SpecKit Plus** | Workflow templates, scripts, constitution requirements |
| **Domain Skill** | PostgreSQL patterns from `postgresql-database` skill references |
| **Context7** | Latest PostgreSQL documentation when needed for clarifications |

Ensure all required context is gathered before orchestrating.
Only ask user for THEIR specific requirements (SpecKit Plus workflow is embedded in this skill).

---

## Required Clarifications

Ask about USER'S context (not workflow knowledge):

1. **Goal**: "What database schema/feature do you want to build?"
2. **Scope**: "Complete schema or specific tables/features?"
3. **Existing project**: "New database or extending existing schema?"
4. **Constraints**: "Any specific requirements? (security, performance, migrations)"

---

## Orchestration Workflow

### Phase 1: Constitution Check

1. **Check if constitution exists**
   - Read `.specify/memory/constitution.md`
   - If missing or incomplete → Run `sp.constitution` workflow
   - Ensure database-specific principles are included

2. **Validate constitution**
   - Check for database design principles
   - Verify alignment with PostgreSQL best practices
   - Update if needed

### Phase 2: Specification Creation

1. **Run `sp.specify` workflow**
   - Parse user's goal into feature description
   - Create feature branch and spec directory
   - Generate `specs/<feature-name>/spec.md` with:
     - Data entities
     - Relationships
     - Constraints
     - Security requirements
   - Handle clarifications (max 3 NEEDS CLARIFICATION markers)

2. **Edge Case Handling**
   - Identify edge cases from spec
   - Document in spec.md under "Edge Cases" section
   - Include data integrity scenarios, migration edge cases, security considerations

### Phase 3: Planning

1. **Run `sp.plan` workflow**
   - Generate `specs/<feature-name>/plan.md` with:
     - Technical context
     - Constitution check
     - Phase 0: Research (use Context7 for latest PostgreSQL patterns)
     - Phase 1: Data models, schema design
     - Phase 2: Migration strategy

2. **Context7 Integration**
   - Query latest PostgreSQL documentation for:
     - Schema design patterns
     - Security patterns
     - Performance optimization
     - Migration patterns
   - Resolve all NEEDS CLARIFICATION items

3. **Edge Case Planning**
   - Plan for data integrity
   - Plan for migration edge cases
   - Plan for security edge cases
   - Plan for performance edge cases

### Phase 4: Task Breakdown

1. **Run `sp.tasks` workflow**
   - Generate `specs/<feature-name>/tasks.md` with:
     - Phase 1: Setup (database initialization)
     - Phase 2: Foundational (base tables, constraints)
     - Phase 3+: Schema features in priority order
     - Each task: testable, dependency-ordered

2. **Task Organization**
   - Group by entity/feature
   - Order by dependencies
   - Include edge case tasks
   - Add security validation tasks

### Phase 5: Implementation

1. **Delegate to `postgresql-database` skill**
   - For each task in tasks.md:
     - Load task context
     - Use `postgresql-database` skill patterns
     - Implement following PostgreSQL best practices
     - Handle edge cases as specified

2. **Implementation Phases**
   - Phase 1: Database setup and structure
   - Phase 2: Base tables and constraints
   - Phase 3+: Schema features per requirement
   - Final: Security, migrations, edge cases

3. **Edge Case Implementation**
   - Data integrity constraints
   - Migration rollbacks
   - Security functions
   - Performance optimization

### Phase 6: Validation

1. **Run `sp.analyze` workflow**
   - Check consistency with spec
   - Verify all requirements met
   - Validate edge cases handled
   - Check PostgreSQL best practices followed

2. **Quality Checks**
   - All tasks completed
   - Edge cases handled
   - Security validated
   - Migrations tested
   - Performance validated

---

## Edge Case Handling

### Common Database Edge Cases

1. **Data Integrity**
   - Foreign key violations
   - Constraint violations
   - Unique constraint conflicts
   - Check constraint failures
   - Transaction conflicts

2. **Migrations**
   - Schema changes with data
   - Column type changes
   - Data migration edge cases
   - Rollback scenarios
   - Concurrent migrations

3. **Security**
   - Password hashing edge cases
   - SQL injection attempts
   - Access control edge cases
   - Encryption edge cases
   - Audit logging edge cases

4. **Performance**
   - Large dataset operations
   - Index optimization
   - Query performance
   - Connection pooling
   - Lock contention

5. **Data Operations**
   - Concurrent updates
   - Race conditions
   - Deadlocks
   - Transaction isolation
   - Backup/restore edge cases

---

## Context7 Integration

### When to Query Context7

1. **During Planning Phase**
   - Latest PostgreSQL patterns
   - Security best practices
   - Schema design patterns
   - Performance optimization

2. **During Implementation**
   - Specific SQL patterns
   - Edge case patterns
   - Security patterns
   - Migration patterns

3. **During Clarification**
   - Resolve technical questions
   - Find recommended approaches
   - Understand trade-offs

---

## Workflow Automation

### Automated Steps

```text
User Goal: "Design secure user database schema"
    ↓
1. Check/Update Constitution (sp.constitution)
    ↓
2. Create Specification (sp.specify)
    - Parse goal into spec.md
    - Identify edge cases
    ↓
3. Create Plan (sp.plan)
    - Research with Context7
    - Design schema
    - Plan edge cases
    ↓
4. Create Tasks (sp.tasks)
    - Break into testable tasks
    - Order by dependencies
    ↓
5. Implement (using postgresql-database skill)
    - Execute each task
    - Handle edge cases
    - Follow PostgreSQL patterns
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
- [ ] Security validated (password hashing, etc.)
- [ ] Migrations tested
- [ ] Context7 used for latest patterns
- [ ] PostgreSQL best practices followed
- [ ] Code validated and tested
- [ ] PHR created for workflow

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/speckit-workflow.md` | SpecKit Plus workflow phases and commands |
| `references/edge-cases.md` | Common database edge cases and handling patterns |
| `references/context7-integration.md` | How to use Context7 during orchestration |
| `references/delegation-patterns.md` | How to delegate to postgresql-database skill |

