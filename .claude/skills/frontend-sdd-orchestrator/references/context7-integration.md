# Context7 Integration for Frontend Orchestration

How to use Context7 during frontend SDD orchestration.

## When to Query Context7

### During Planning Phase

**Query for**:
- Latest Next.js App Router patterns
- Component architecture best practices
- Data fetching strategies
- Performance optimization techniques

**Example**:
```text
Query: "Next.js App Router server components, client components, data fetching patterns, props passing"
Library: /vercel/next.js or /websites/nextjs_app
```

### During Implementation

**Query for**:
- Specific API usage
- Edge case handling patterns
- Security patterns
- Styling approaches

**Example**:
```text
Query: "Next.js form validation, input sanitization, XSS prevention patterns"
Library: /vercel/next.js
```

### During Clarification

**Query for**:
- Resolve technical questions
- Find recommended approaches
- Understand trade-offs

**Example**:
```text
Query: "Next.js state management patterns, when to use Server vs Client Components"
Library: /vercel/next.js
```

## Query Strategy

### Research Phase (sp.plan)

1. **Identify unknowns** from Technical Context
2. **Query Context7** for each unknown
3. **Consolidate findings** in research.md
4. **Resolve all NEEDS CLARIFICATION** items

### Implementation Phase

1. **Query before implementing** complex features
2. **Use latest patterns** from Context7
3. **Verify best practices** are followed

## Integration Workflow

```text
Planning Phase:
    ↓
Identify NEEDS CLARIFICATION
    ↓
Query Context7 for each unknown
    ↓
Document findings in research.md
    ↓
Resolve all clarifications
    ↓
Proceed to implementation
```

## Best Practices

1. **Query early** - During planning phase
2. **Query specific** - Ask targeted questions
3. **Document findings** - Record in research.md
4. **Verify patterns** - Check against skill references
5. **Update knowledge** - Keep skill references current

