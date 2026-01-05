# Delegation to postgresql-database Skill

How to delegate implementation tasks to the postgresql-database skill.

## Delegation Workflow

### When to Delegate

Delegate to `postgresql-database` skill when:
- Creating database schemas
- Designing tables
- Implementing security functions
- Creating migrations
- Optimizing performance

### How to Delegate

1. **Load Task Context**
   - Read task from tasks.md
   - Understand requirements
   - Identify edge cases

2. **Invoke postgresql-database Skill**
   - Use skill's patterns from references/
   - Follow PostgreSQL best practices
   - Apply security patterns
   - Use proper data types

3. **Verify Implementation**
   - Check against spec requirements
   - Verify edge cases handled
   - Ensure PostgreSQL best practices

## Task-to-Skill Mapping

### Schema Creation Tasks

```text
Task: "Create users table with secure password storage"
    ↓
Delegate to postgresql-database:
- Use database-models.md
- Use password-security.md
- Define proper constraints
- Implement password hashing
```

### Migration Tasks

```text
Task: "Create migration to add posts table"
    ↓
Delegate to postgresql-database:
- Use migrations.md
- Create versioned migration
- Handle rollback
- Test migration
```

### Security Tasks

```text
Task: "Implement password hashing with Argon2"
    ↓
Delegate to postgresql-database:
- Use password-security.md
- Implement Argon2 hashing
- Add unique salts
- Create verification functions
```

## Integration Pattern

### Complete Example

```text
Task from tasks.md:
"Phase 3.1: Create users table with secure password storage"

1. Load task context
   - Table should store users
   - Secure password hashing
   - Proper constraints
   - Indexes for performance

2. Delegate to postgresql-database skill:
   - Create table with proper types
   - Add password hashing function
   - Add constraints
   - Create indexes

3. Implement using skill patterns:
   - database-models.md for table design
   - password-security.md for password hashing
   - security-practices.md for security
   - edge-cases.md for error handling

4. Verify:
   - Matches spec requirements
   - Edge cases handled
   - PostgreSQL best practices followed
```

