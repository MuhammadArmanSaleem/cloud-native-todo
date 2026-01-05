# Skill Behavior Validation

How to validate that skills are following their documented workflows and patterns.

## Validation Framework

### Step 1: Skill Workflow Compliance

**Check Skill Workflow**:
```text
For each skill:
- Is skill following its documented workflow?
- Are skill phases executed in order?
- Are skill patterns being used?
```

**Example - Frontend Orchestrator**:
```text
Required Workflow:
1. Constitution check
2. Specification creation
3. Planning with Context7
4. Task breakdown
5. Implementation using nextjs-frontend skill

Validation:
- All phases present? → Check for each phase
- In correct order? → Verify sequence
- Using nextjs-frontend skill? → Check delegation
```

### Step 2: Skill Reference Usage

**Check Skill References**:
```text
For each skill:
- Are skill reference files being used?
- Are patterns from references applied?
- Are best practices followed?
```

**Example - Backend Skill**:
```text
Required References:
- core-concepts.md (routing, validation)
- authentication.md (OAuth2, JWT)
- security-validation.md (input sanitization)
- rbac.md (role-based access)

Validation:
- References consulted? → Check for pattern usage
- Patterns applied? → Verify implementation matches
```

### Step 3: Edge Case Handling

**Check Edge Cases**:
```text
For each skill:
- Are edge cases identified?
- Are edge cases handled?
- Are error scenarios covered?
```

**Example - Frontend Skill**:
```text
Required Edge Cases:
- Empty states
- Loading states
- Error states
- Validation failures

Validation:
- Edge cases identified? → Check spec/plan
- Edge cases handled? → Verify implementation
```

### Step 4: Delegation Validation (Orchestrators)

**Check Delegation**:
```text
For orchestrators:
- Are chunks delegated to correct skills?
- Is rich context provided?
- Are Context7 findings shared?
```

**Example - Triage Orchestrator**:
```text
Required Delegation:
- Frontend chunk → frontend-sdd-orchestrator
- Backend chunk → backend-sdd-orchestrator
- Database chunk → database-sdd-orchestrator

Validation:
- Correct skills used? → Check delegation
- Context provided? → Verify context packages
```

## Validation Examples

### Example 1: Skill Not Following Workflow

```text
User: "Build frontend UI"
AI: [Starts coding without SpecKit Plus workflow]

Guardrail:
- Detects: frontend-sdd-orchestrator not following workflow
- Blocks: "Must follow SpecKit Plus workflow: constitution → spec → plan → tasks"
- Guides: "Complete all phases before implementation"
```

### Example 2: Missing Skill References

```text
User: "Create REST API"
AI: [Implements without using skill references]

Guardrail:
- Detects: backend-sdd-orchestrator not using references
- Blocks: "Must use skill references for patterns"
- Guides: "Consult: core-concepts.md, authentication.md, security-validation.md"
```

### Example 3: Edge Cases Not Handled

```text
User: "Build todo list UI"
AI: [Implements without handling empty/error states]

Guardrail:
- Detects: Edge cases not identified
- Blocks: "Must handle edge cases: empty states, loading, errors"
- Guides: "Add edge case handling per skill references"
```

### Example 4: Incorrect Delegation

```text
User: "Build full-stack app"
AI: [Triage orchestrator delegates frontend to backend skill]

Guardrail:
- Detects: Wrong skill delegated
- Blocks: "Frontend chunk must use frontend-sdd-orchestrator"
- Guides: "Delegate to correct skill per chunk type"
```

## Skill-Specific Validations

### Frontend Orchestrator

**Required**:
- SpecKit Plus workflow
- Context7 for Next.js
- Delegation to nextjs-frontend skill
- Edge case handling
- Component patterns (props, maps)

**Validation**:
```text
- Workflow followed? → Check phases
- Context7 used? → Check queries
- nextjs-frontend used? → Check delegation
- Edge cases handled? → Check implementation
- Patterns used? → Check code structure
```

### Backend Orchestrator

**Required**:
- SpecKit Plus workflow
- Context7 for FastAPI
- Delegation to fastapi-backend skill
- Security patterns
- Input validation

**Validation**:
```text
- Workflow followed? → Check phases
- Context7 used? → Check queries
- fastapi-backend used? → Check delegation
- Security implemented? → Check validation
- RBAC implemented? → Check authorization
```

### Database Orchestrator

**Required**:
- SpecKit Plus workflow
- Context7 for PostgreSQL
- Delegation to postgresql-database skill
- Password security (Argon2, bcrypt, scrypt)
- Migration patterns

**Validation**:
```text
- Workflow followed? → Check phases
- Context7 used? → Check queries
- postgresql-database used? → Check delegation
- Password hashing? → Check security functions
- Migrations? → Check migration files
```

### Triage Orchestrator

**Required**:
- Goal analysis
- Chunking
- Context7 research per chunk
- Proper delegation
- Coordination

**Validation**:
```text
- Chunks created? → Check breakdown
- Context7 per chunk? → Check queries
- Correct delegation? → Check skill routing
- Coordination? → Check execution order
```

## Best Practices

1. **Validate Workflow**: Ensure skill follows documented workflow
2. **Check References**: Verify skill references are used
3. **Verify Patterns**: Ensure patterns are applied
4. **Validate Edge Cases**: Check edge case handling
5. **Verify Delegation**: Ensure correct skills are used
6. **Check Compliance**: All skill requirements met

