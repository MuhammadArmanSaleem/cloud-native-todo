# Context7 Integration for Database Orchestration

How to use Context7 during database SDD orchestration.

## When to Query Context7

### During Planning Phase

**Query for**:
- Latest PostgreSQL patterns
- Security best practices
- Schema design patterns
- Performance optimization

**Example**:
```text
Query: "PostgreSQL database security, password hashing, encryption, authentication best practices"
Library: /websites/postgresql
```

### During Implementation

**Query for**:
- Specific SQL patterns
- Edge case handling patterns
- Security patterns
- Migration patterns

**Example**:
```text
Query: "PostgreSQL password hashing crypt function, Argon2, bcrypt implementation"
Library: /websites/postgresql
```

### During Clarification

**Query for**:
- Resolve technical questions
- Find recommended approaches
- Understand trade-offs

**Example**:
```text
Query: "PostgreSQL index types, when to use B-tree vs GIN vs GiST"
Library: /websites/postgresql
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

