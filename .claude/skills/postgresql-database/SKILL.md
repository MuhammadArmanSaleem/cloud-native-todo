---
name: postgresql-database
description: |
  Design and implement secure PostgreSQL databases with modern security practices, proper password hashing (Argon2, bcrypt, scrypt), robust database models, migrations, and performance optimization.
  Use when users ask to create database schemas, design tables, implement password security, set up database migrations, optimize queries, or build production-ready PostgreSQL databases.
---

# PostgreSQL Database Builder

Create production-ready PostgreSQL databases with modern security practices and robust design patterns.

## What This Skill Does

- Designs secure database schemas with proper constraints and relationships
- Implements modern password hashing (Argon2, bcrypt, scrypt) with unique salts
- Creates database models with proper data types and constraints
- Sets up database migrations and version control
- Implements security best practices (encryption, access control)
- Optimizes database performance (indexing, query optimization)
- Configures connection pooling and resource management
- Creates backup and recovery strategies

## What This Skill Does NOT Do

- Deploy databases to production servers
- Manage database infrastructure or cloud resources
- Handle application-level code (but provides database patterns)
- Create frontend or backend code (database layer only)

---

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Existing database structure, ORM usage, migration tools, security patterns, project conventions |
| **Conversation** | User's specific requirements, data models needed, security requirements, performance needs, constraints |
| **Skill References** | PostgreSQL patterns from `references/` (models, security, migrations, optimization, best practices) |
| **User Guidelines** | Project-specific conventions, team standards, database naming conventions, security policies |

Ensure all required context is gathered before implementing.
Only ask user for THEIR specific requirements (domain expertise is in this skill).

---

## Required Clarifications

Ask about USER'S context (not domain knowledge):

1. **Project scope**: "New database or extending existing schema?"
2. **Data models**: "What entities/tables do you need? (users, posts, orders, etc.)"
3. **Security requirements**: "What security level needed? (password hashing, encryption, access control)"
4. **ORM/ORM-less**: "Using an ORM (SQLAlchemy, Prisma) or raw SQL?"
5. **Constraints**: "Any specific requirements? (PostgreSQL version, migration tool, performance targets)"

---

## Output Specification

### Database Structure

```
database/
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_add_users_table.sql
│   └── 003_add_indexes.sql
├── schemas/
│   ├── users.sql
│   ├── posts.sql
│   └── security.sql
├── seeds/
│   └── initial_data.sql
└── security/
    ├── password_hashing.sql
    └── encryption.sql
```

### Security Standards

- **Password Hashing**: Argon2 (preferred), bcrypt, or scrypt
- **Unique Salts**: Each password gets unique salt
- **Password Stretching**: Multiple iterations for key strengthening
- **Secure Storage**: Proper salt storage and management
- **Algorithm Updates**: Migration path for algorithm upgrades

---

## Domain Standards

### Must Follow

- **Modern Password Hashing**: Use Argon2, bcrypt, or scrypt (never MD5, SHA-1)
- **Unique Salts**: Every password must have unique salt
- **Password Stretching**: Use appropriate iteration counts
- **Proper Data Types**: Use appropriate PostgreSQL types (UUID, TIMESTAMPTZ, etc.)
- **Constraints**: Use NOT NULL, CHECK, UNIQUE, FOREIGN KEY constraints
- **Indexes**: Create indexes on frequently queried columns
- **Normalization**: Follow database normalization principles
- **Transactions**: Use transactions for data integrity
- **Backup Strategy**: Implement regular backup procedures
- **Connection Pooling**: Configure appropriate connection pooling

### Must Avoid

- **Weak Hashing**: Never use MD5, SHA-1, or unsalted hashes
- **Shared Salts**: Never reuse salts across users
- **Plain Text Passwords**: Never store passwords in plain text
- **Missing Constraints**: Don't skip data validation constraints
- **Over-indexing**: Don't create unnecessary indexes
- **SQL Injection**: Always use parameterized queries
- **Hardcoded Credentials**: Never hardcode database credentials
- **Missing Backups**: Always have backup strategy

---

## Implementation Workflow

1. **Schema Design**
   - Design entity relationships
   - Define tables with proper data types
   - Add constraints and indexes

2. **Security Setup**
   - Implement password hashing functions
   - Set up encryption for sensitive data
   - Configure access control

3. **Migrations**
   - Create migration files
   - Version control schema changes
   - Test migrations

4. **Performance Optimization**
   - Add appropriate indexes
   - Optimize queries
   - Configure connection pooling

5. **Testing & Validation**
   - Test security implementations
   - Verify constraints work
   - Performance testing

---

## Common Patterns

### Secure User Table

```sql
-- Create users table with secure password storage
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Argon2/bcrypt hash
    salt VARCHAR(255) NOT NULL,            -- Unique salt per user
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Password Hashing Function

```sql
-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to hash password with Argon2 (PostgreSQL 13+)
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Use Argon2 with unique salt
    RETURN crypt(password, gen_salt('argon2'));
END;
$$ LANGUAGE plpgsql;

-- Function to verify password
CREATE OR REPLACE FUNCTION verify_password(
    password TEXT,
    stored_hash TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN stored_hash = crypt(password, stored_hash);
END;
$$ LANGUAGE plpgsql;
```

See `references/` for detailed patterns and examples.

---

## Output Checklist

Before delivering, verify:

- [ ] Database schema follows normalization principles
- [ ] All tables have proper constraints (NOT NULL, CHECK, UNIQUE, FOREIGN KEY)
- [ ] Password hashing uses modern algorithms (Argon2, bcrypt, scrypt)
- [ ] Unique salts implemented for each password
- [ ] Appropriate indexes created for query performance
- [ ] Security functions properly implemented
- [ ] Migrations are versioned and tested
- [ ] Connection pooling configured
- [ ] Backup strategy documented
- [ ] No hardcoded credentials
- [ ] SQL injection prevention (parameterized queries)
- [ ] Data types appropriate for use case

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/database-models.md` | Database schema design, table creation, relationships, constraints |
| `references/password-security.md` | **Modern password hashing (Argon2, bcrypt, scrypt), unique salts, password stretching** |
| `references/security-practices.md` | Database security, encryption, access control, audit logging |
| `references/migrations.md` | Database migrations, version control, schema evolution |
| `references/performance.md` | Query optimization, indexing, connection pooling, monitoring |
| `references/best-practices.md` | Production patterns, backup strategies, maintenance |
| `references/anti-patterns.md` | Common mistakes to avoid |

