---
name: frontend-sdd-orchestrator
description: |
  Orchestrates complete frontend development using SpecKit Plus workflow (constitution → spec → plan → tasks → implement) with Next.js frontend skill. Handles edge cases, uses Context7 for latest docs, and ensures full SDD process completion.
  Use when users ask to build complete frontend applications, create full UI implementations, or develop frontend features end-to-end with spec-driven development.
---

# Frontend SDD Orchestrator

Orchestrates complete frontend development through SpecKit Plus workflow, delegating implementation to Next.js frontend skill.

## What This Skill Does

- Orchestrates full SpecKit Plus workflow for frontend development
- Runs constitution → spec → plan → tasks → implement phases automatically
- Delegates implementation to `nextjs-frontend` skill
- Handles edge cases and clarifications throughout the process
- Uses Context7 for latest Next.js documentation
- Ensures complete SDD process with all artifacts created
- Manages feature branches and specification history

## What This Skill Does NOT Do

- Create backend or database code
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
| **Domain Skill** | Next.js frontend patterns from `nextjs-frontend` skill references |
| **Context7** | Latest Next.js documentation when needed for clarifications |

Ensure all required context is gathered before orchestrating.
Only ask user for THEIR specific requirements (SpecKit Plus workflow is embedded in this skill).

---

## Required Clarifications

Ask about USER'S context (not workflow knowledge):

1. **Goal**: "What frontend feature/application do you want to build?"
2. **Scope**: "Complete application or specific feature?"
3. **Existing project**: "New project or adding to existing codebase?"
4. **Constraints**: "Any specific requirements? (design system, tech stack, timeline)"

---

## Orchestration Workflow

### Phase 1: Constitution Check

1. **Check if constitution exists**
   - Read `.specify/memory/constitution.md`
   - If missing or incomplete → Run `sp.constitution` workflow
   - Ensure frontend-specific principles are included

2. **Validate constitution**
   - Check for frontend development principles
   - Verify alignment with Next.js best practices
   - Update if needed

### Phase 2: Specification Creation

1. **Run `sp.specify` workflow**
   - Parse user's goal into feature description
   - Create feature branch and spec directory
   - Generate `specs/<feature-name>/spec.md` with:
     - User scenarios
     - Functional requirements
     - Success criteria
     - Key entities (if data involved)
   - Handle clarifications (max 3 NEEDS CLARIFICATION markers)

2. **Edge Case Handling**
   - Identify edge cases from spec
   - Document in spec.md under "Edge Cases" section
   - Include error scenarios, empty states, loading states

### Phase 3: Planning

1. **Run `sp.plan` workflow**
   - Generate `specs/<feature-name>/plan.md` with:
     - Technical context
     - Constitution check
     - Phase 0: Research (use Context7 for latest Next.js patterns)
     - Phase 1: Data models, component structure
     - Phase 2: Architecture decisions

2. **Context7 Integration**
   - Query latest Next.js documentation for:
     - Component patterns
     - Data fetching strategies
     - Styling approaches
     - Performance optimization
   - Resolve all NEEDS CLARIFICATION items

3. **Edge Case Planning**
   - Plan for error handling
   - Plan for loading states
   - Plan for empty states
   - Plan for validation edge cases

### Phase 4: Task Breakdown

1. **Run `sp.tasks` workflow**
   - Generate `specs/<feature-name>/tasks.md` with:
     - Phase 1: Setup (Next.js project initialization)
     - Phase 2: Foundational (base components, layouts)
     - Phase 3+: User stories in priority order
     - Each task: testable, dependency-ordered

2. **Task Organization**
   - Group by user story
   - Order by dependencies
   - Include edge case tasks
   - Add validation tasks

### Phase 5: Implementation

1. **Delegate to `nextjs-frontend` skill**
   - For each task in tasks.md:
     - Load task context
     - Use `nextjs-frontend` skill patterns
     - Implement following Next.js best practices
     - Handle edge cases as specified

2. **Implementation Phases**
   - Phase 1: Project setup and structure
   - Phase 2: Base components and utilities
   - Phase 3+: Feature implementation per user story
   - Final: Polish, edge cases, validation

3. **Edge Case Implementation**
   - Error boundaries
   - Loading states
   - Empty states
   - Form validation
   - Accessibility

### Phase 6: Validation

1. **Run `sp.analyze` workflow**
   - Check consistency with spec
   - Verify all requirements met
   - Validate edge cases handled
   - Check Next.js best practices followed

2. **Quality Checks**
   - All tasks completed
   - Edge cases handled
   - Tests passing (if applicable)
   - Code follows conventions

---

## Edge Case Handling

### Common Frontend Edge Cases

1. **Data Loading**
   - Empty data states
   - Loading states
   - Error states
   - Network failures
   - Timeout handling

2. **User Input**
   - Form validation
   - Invalid input handling
   - Character limits
   - Special characters
   - XSS prevention

3. **State Management**
   - Concurrent updates
   - Race conditions
   - Stale data
   - Cache invalidation

4. **UI/UX**
   - Responsive design edge cases
   - Browser compatibility
   - Accessibility (keyboard navigation, screen readers)
   - Performance (large lists, slow networks)

5. **Authentication/Authorization**
   - Unauthorized access
   - Token expiration
   - Role-based UI rendering
   - Session management

---

## Context7 Integration

### When to Query Context7

1. **During Planning Phase**
   - Latest Next.js patterns
   - Component architecture
   - Data fetching strategies
   - Performance optimization

2. **During Implementation**
   - Specific API usage
   - Edge case patterns
   - Best practices
   - Security patterns

3. **During Clarification**
   - Resolve technical questions
   - Find recommended approaches
   - Understand trade-offs

---

## Workflow Automation

### Automated Steps

```text
User Goal: "Build a todo app frontend"
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
5. Implement (using nextjs-frontend skill)
    - Execute each task
    - Handle edge cases
    - Follow Next.js patterns
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
- [ ] Context7 used for latest patterns
- [ ] Next.js best practices followed
- [ ] Code validated and tested
- [ ] PHR created for workflow

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/speckit-workflow.md` | SpecKit Plus workflow phases and commands |
| `references/edge-cases.md` | Common frontend edge cases and handling patterns |
| `references/context7-integration.md` | How to use Context7 during orchestration |
| `references/delegation-patterns.md` | How to delegate to nextjs-frontend skill |

