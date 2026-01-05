# PostgreSQL Migrations

Database migration patterns and best practices for PostgreSQL.

## Migration Structure

### Basic Migration File

```sql
-- migrations/001_initial_schema.sql
-- Description: Create initial database schema
-- Created: 2024-01-15

BEGIN;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;
```

### Migration with Rollback

```sql
-- migrations/002_add_posts_table.sql
-- Description: Add posts table with foreign key to users
-- Rollback: DROP TABLE IF EXISTS posts CASCADE;

BEGIN;

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published) WHERE published = TRUE;

-- Add trigger for updated_at
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

## Schema Changes

### Adding Columns

```sql
-- migrations/003_add_user_profile_fields.sql
-- Description: Add profile fields to users table

BEGIN;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- Add check constraint
ALTER TABLE users
    ADD CONSTRAINT bio_length CHECK (length(bio) <= 1000);

COMMIT;
```

### Modifying Columns

```sql
-- migrations/004_modify_email_column.sql
-- Description: Change email column to allow longer emails

BEGIN;

-- Change column type
ALTER TABLE users
    ALTER COLUMN email TYPE VARCHAR(320);  -- Max email length

-- Add constraint
ALTER TABLE users
    ADD CONSTRAINT email_format CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    );

COMMIT;
```

### Dropping Columns

```sql
-- migrations/005_remove_old_fields.sql
-- Description: Remove deprecated columns

BEGIN;

-- Drop column (with CASCADE if needed)
ALTER TABLE users
    DROP COLUMN IF EXISTS old_field CASCADE;

COMMIT;
```

## Index Management

### Adding Indexes

```sql
-- migrations/006_add_performance_indexes.sql
-- Description: Add indexes for query optimization

BEGIN;

-- Single column index
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Composite index
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON posts(user_id, created_at DESC);

-- Partial index
CREATE INDEX IF NOT EXISTS idx_users_active_email ON users(email) WHERE is_active = TRUE;

COMMIT;
```

### Removing Indexes

```sql
-- migrations/007_remove_unused_indexes.sql
-- Description: Remove indexes that are no longer needed

BEGIN;

DROP INDEX IF EXISTS idx_posts_old_index;

COMMIT;
```

## Data Migrations

### Migrating Data

```sql
-- migrations/008_migrate_user_passwords.sql
-- Description: Migrate passwords from bcrypt to Argon2

BEGIN;

-- Create temporary column
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash_new TEXT;

-- Migrate passwords (requires user to re-authenticate)
-- This is a placeholder - actual migration requires user input
UPDATE users
SET password_hash_new = password_hash  -- Placeholder
WHERE password_hash_new IS NULL;

-- After verification, swap columns
-- ALTER TABLE users DROP COLUMN password_hash;
-- ALTER TABLE users RENAME COLUMN password_hash_new TO password_hash;

COMMIT;
```

### Seeding Data

```sql
-- migrations/009_seed_initial_data.sql
-- Description: Seed initial data

BEGIN;

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with full access'),
    ('moderator', 'Moderator with limited admin access'),
    ('user', 'Regular user'),
    ('guest', 'Guest user with read-only access')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user (password should be changed)
INSERT INTO users (email, username, password_hash, role)
VALUES (
    'admin@example.com',
    'admin',
    crypt('changeme', gen_salt('argon2')),  -- Change this!
    'admin'
)
ON CONFLICT (email) DO NOTHING;

COMMIT;
```

## Version Control

### Migration Tracking Table

```sql
-- Create migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Function to record migration
CREATE OR REPLACE FUNCTION record_migration(
    p_version VARCHAR(255),
    p_name VARCHAR(255)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO schema_migrations (version, name)
    VALUES (p_version, p_name)
    ON CONFLICT (version) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
```

## Best Practices

1. **Version All Migrations** - Use sequential version numbers
2. **Make Migrations Reversible** - Document rollback procedures
3. **Test Migrations** - Test on staging before production
4. **Use Transactions** - Wrap migrations in transactions
5. **Idempotent Migrations** - Use IF NOT EXISTS, IF EXISTS
6. **Document Changes** - Include descriptions in migration files
7. **Backup Before Migration** - Always backup before major changes
8. **Review Migrations** - Code review all migrations
9. **Track Applied Migrations** - Use migration tracking table
10. **Separate Schema and Data** - Keep schema and data migrations separate

