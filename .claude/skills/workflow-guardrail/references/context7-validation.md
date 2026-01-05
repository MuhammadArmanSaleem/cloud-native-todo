# Context7 Validation

How to validate that Context7 is being used for latest documentation.

## Validation Framework

### Step 1: Context7 Usage Check

**For All Skills**:
```text
Check:
- Has Context7 been queried? → Must have Context7 queries
- Are queries relevant? → Must match task domain
- Are findings documented? → Must be in research.md or context package
```

### Step 2: Per-Skill Context7 Requirements

**Frontend Tasks**:
```text
Required:
- Context7 query for Next.js documentation
- Latest App Router patterns
- Component architecture patterns
- Data fetching strategies

Validation:
- Query made? → Check for Context7 calls
- Next.js library queried? → Must query /vercel/next.js
- Patterns documented? → Must be in research.md
```

**Backend Tasks**:
```text
Required:
- Context7 query for FastAPI documentation
- Latest routing patterns
- Security best practices
- Database integration patterns

Validation:
- Query made? → Check for Context7 calls
- FastAPI library queried? → Must query /websites/fastapi_tiangolo
- Patterns documented? → Must be in research.md
```

**Database Tasks**:
```text
Required:
- Context7 query for PostgreSQL documentation
- Latest schema design patterns
- Security best practices (password hashing)
- Migration patterns

Validation:
- Query made? → Check for Context7 calls
- PostgreSQL library queried? → Must query /websites/postgresql
- Patterns documented? → Must be in research.md
```

**Orchestrator Tasks**:
```text
Required:
- Context7 queries for each chunk
- Latest patterns for technologies involved
- Integration approaches
- Best practices

Validation:
- Queries made per chunk? → Check for multiple Context7 calls
- Relevant libraries queried? → Must match chunk technologies
- Findings consolidated? → Must be in context packages
```

### Step 3: Context7 Query Validation

**Check Query Quality**:
```text
For each Context7 query:
- Is query specific? → Should be targeted, not generic
- Is library correct? → Must match technology stack
- Are results used? → Must be referenced in implementation
```

**Example Valid Queries**:
```text
✅ Good: "Next.js App Router server components, client components, data fetching patterns"
✅ Good: "FastAPI authentication OAuth2, security best practices, error handling"
✅ Good: "PostgreSQL password hashing Argon2, schema design best practices"

❌ Bad: "Next.js" (too generic)
❌ Bad: "API" (not specific)
❌ Bad: "Database" (too broad)
```

### Step 4: Documentation Validation

**Check Documentation**:
```text
For Context7 findings:
- Are findings in research.md? → Must document decisions
- Are patterns referenced? → Must cite Context7 findings
- Are code examples included? → Should have examples if available
```

## Validation Examples

### Example 1: Missing Context7 Query

```text
User: "Build frontend with Next.js"
AI: [Starts implementing without Context7]

Guardrail:
- Detects: No Context7 query
- Blocks: "Must query Context7 for latest Next.js patterns"
- Guides: "Query Context7 for: Next.js App Router patterns, component architecture"
```

### Example 2: Wrong Library Queried

```text
User: "Create FastAPI backend"
AI: [Queries React documentation instead of FastAPI]

Guardrail:
- Detects: Wrong library queried
- Blocks: "Must query FastAPI documentation, not React"
- Guides: "Query Context7 for: /websites/fastapi_tiangolo"
```

### Example 3: Generic Query

```text
User: "Design database schema"
AI: [Queries Context7 with "database"]

Guardrail:
- Detects: Query too generic
- Blocks: "Context7 query must be specific"
- Guides: "Query: PostgreSQL schema design, password hashing Argon2, security best practices"
```

### Example 4: Findings Not Documented

```text
User: "Build REST API"
AI: [Queries Context7 but doesn't document findings]

Guardrail:
- Detects: Context7 queried but findings not documented
- Blocks: "Must document Context7 findings in research.md"
- Guides: "Add findings to research.md with decisions and rationale"
```

## Enforcement Rules

### Rule 1: Context7 Required for All Skills

```text
For ANY skill execution:
- Context7 MUST be queried
- Latest patterns MUST be researched
- Findings MUST be documented
```

### Rule 2: Library Must Match Task

```text
Frontend task → Must query Next.js docs
Backend task → Must query FastAPI docs
Database task → Must query PostgreSQL docs
```

### Rule 3: Queries Must Be Specific

```text
✅ "Next.js App Router patterns, component architecture"
❌ "Next.js"
```

### Rule 4: Findings Must Be Used

```text
- Context7 findings must be referenced in implementation
- Patterns must be applied
- Best practices must be followed
```

## Best Practices

1. **Check Before Execution**: Validate Context7 usage before allowing implementation
2. **Verify Library Match**: Ensure correct library is queried
3. **Require Documentation**: Findings must be documented
4. **Enforce Specificity**: Queries must be targeted
5. **Validate Usage**: Findings must be applied in implementation

