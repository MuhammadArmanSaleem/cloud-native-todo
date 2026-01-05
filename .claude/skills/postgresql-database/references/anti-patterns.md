# PostgreSQL Anti-Patterns

Common mistakes and anti-patterns to avoid in PostgreSQL development.

## Security Anti-Patterns

### ❌ Weak Password Hashing

```sql
-- BAD: Using MD5 (insecure)
CREATE TABLE users (
    password_hash TEXT
);
-- Storing MD5 hash
INSERT INTO users VALUES (md5('password'));

-- BAD: Using SHA-1 (insecure)
INSERT INTO users VALUES (encode(digest('password', 'sha1'), 'hex'));

-- ✅ GOOD: Use Argon2, bcrypt, or scrypt
INSERT INTO users VALUES (crypt('password', gen_salt('argon2')));
```

### ❌ No Salt or Shared Salt

```sql
-- BAD: No salt
INSERT INTO users VALUES (md5('password'));

-- BAD: Shared salt
INSERT INTO users VALUES (crypt('password', 'shared_salt'));

-- ✅ GOOD: Unique salt per password
INSERT INTO users VALUES (crypt('password', gen_salt('argon2')));
```

### ❌ Plain Text Passwords

```sql
-- BAD: Storing plain text
CREATE TABLE users (
    password TEXT  -- Never do this!
);

-- ✅ GOOD: Always hash passwords
CREATE TABLE users (
    password_hash TEXT NOT NULL
);
```

### ❌ SQL Injection Vulnerabilities

```sql
-- BAD: String concatenation (vulnerable)
-- SELECT * FROM users WHERE email = 'user@example.com';

-- ✅ GOOD: Parameterized queries
-- SELECT * FROM users WHERE email = $1;
```

## Design Anti-Patterns

### ❌ Missing Constraints

```sql
-- BAD: No constraints
CREATE TABLE users (
    id SERIAL,
    email TEXT,
    age INTEGER
);

-- ✅ GOOD: Proper constraints
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER CHECK (age >= 0 AND age <= 150)
);
```

### ❌ Wrong Data Types

```sql
-- BAD: Using TEXT for everything
CREATE TABLE users (
    id TEXT,
    email TEXT,
    created_at TEXT
);

-- ✅ GOOD: Appropriate data types
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### ❌ Missing Indexes

```sql
-- BAD: No indexes on foreign keys
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id)  -- No index!
);

-- ✅ GOOD: Index foreign keys
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id)
);
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

### ❌ Over-Normalization

```sql
-- BAD: Over-normalized (too many joins)
-- Users -> UserProfiles -> UserSettings -> UserPreferences

-- ✅ GOOD: Balance normalization with performance
-- Users with commonly accessed fields
```

## Performance Anti-Patterns

### ❌ SELECT * Everywhere

```sql
-- BAD: Selecting all columns
SELECT * FROM users WHERE id = $1;

-- ✅ GOOD: Select only needed columns
SELECT id, email, username FROM users WHERE id = $1;
```

### ❌ Missing WHERE Clauses

```sql
-- BAD: No WHERE clause
SELECT * FROM posts ORDER BY created_at DESC;

-- ✅ GOOD: Use WHERE and LIMIT
SELECT * FROM posts 
WHERE published = TRUE 
ORDER BY created_at DESC 
LIMIT 10;
```

### ❌ Too Many Indexes

```sql
-- BAD: Indexing every column
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_updated_at ON users(updated_at);
-- ... too many indexes slow down writes

-- ✅ GOOD: Index only what's needed
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

## Migration Anti-Patterns

### ❌ No Rollback Plan

```sql
-- BAD: Migration without rollback
ALTER TABLE users DROP COLUMN old_field;

-- ✅ GOOD: Documented rollback
-- Migration: Remove old_field
-- Rollback: ALTER TABLE users ADD COLUMN old_field TEXT;
ALTER TABLE users DROP COLUMN old_field;
```

### ❌ Breaking Changes Without Migration

```sql
-- BAD: Changing column type without migration
ALTER TABLE users ALTER COLUMN email TYPE INTEGER;

-- ✅ GOOD: Proper migration path
-- 1. Add new column
ALTER TABLE users ADD COLUMN email_new INTEGER;
-- 2. Migrate data
UPDATE users SET email_new = email::INTEGER;
-- 3. Drop old, rename new
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN email_new TO email;
```

## Common Mistakes Summary

1. **Weak Hashing** - Never use MD5, SHA-1 for passwords
2. **No Salts** - Always use unique salts
3. **Plain Text** - Never store passwords in plain text
4. **SQL Injection** - Always use parameterized queries
5. **Missing Constraints** - Always add constraints
6. **Wrong Types** - Use appropriate data types
7. **No Indexes** - Index foreign keys and frequently queried columns
8. **Over-Indexing** - Don't index everything
9. **SELECT *** - Select only needed columns
10. **No Backups** - Always have backup strategy

