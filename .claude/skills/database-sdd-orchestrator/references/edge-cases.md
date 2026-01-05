# Database Edge Cases

Comprehensive edge case handling for database development.

## Data Integrity Edge Cases

### Foreign Key Violations

```sql
-- Handle foreign key violations
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Check before deletion
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM posts WHERE user_id = $1) THEN
        RAISE EXCEPTION 'Cannot delete user with existing posts';
    END IF;
END $$;
```

### Unique Constraint Conflicts

```sql
-- Handle unique constraint violations
CREATE TABLE users (
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Check before insert
INSERT INTO users (email)
VALUES ($1)
ON CONFLICT (email) DO NOTHING
RETURNING id;
```

### Check Constraint Failures

```sql
-- Handle check constraint violations
CREATE TABLE orders (
    total_amount DECIMAL(10, 2) CHECK (total_amount >= 0)
);

-- Validate before insert
DO $$
BEGIN
    IF $1 < 0 THEN
        RAISE EXCEPTION 'Total amount cannot be negative';
    END IF;
END $$;
```

## Migration Edge Cases

### Schema Changes with Data

```sql
-- Handle column type changes with existing data
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN email_new VARCHAR(320);

-- Step 2: Migrate data
UPDATE users SET email_new = email::VARCHAR(320);

-- Step 3: Drop old, rename new
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN email_new TO email;
```

### Data Migration Edge Cases

```sql
-- Handle data migration with validation
DO $$
DECLARE
    invalid_count INTEGER;
BEGIN
    -- Count invalid records
    SELECT COUNT(*) INTO invalid_count
    FROM users
    WHERE email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
    
    IF invalid_count > 0 THEN
        RAISE EXCEPTION 'Found % invalid email addresses', invalid_count;
    END IF;
END $$;
```

## Security Edge Cases

### Password Hashing Edge Cases

```sql
-- Handle password hashing edge cases
CREATE OR REPLACE FUNCTION create_user(
    p_email VARCHAR(255),
    p_password TEXT
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_password_hash TEXT;
BEGIN
    -- Validate password strength
    IF length(p_password) < 8 THEN
        RAISE EXCEPTION 'Password must be at least 8 characters';
    END IF;
    
    -- Hash with Argon2 (includes unique salt)
    v_password_hash := crypt(p_password, gen_salt('argon2'));
    
    -- Insert user
    INSERT INTO users (email, password_hash)
    VALUES (p_email, v_password_hash)
    RETURNING id INTO v_user_id;
    
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;
```

### SQL Injection Prevention

```sql
-- Always use parameterized queries (application level)
-- Good: Parameterized
SELECT * FROM users WHERE email = $1;

-- Bad: Never do this
-- SELECT * FROM users WHERE email = 'user@example.com';
```

## Performance Edge Cases

### Large Dataset Operations

```sql
-- Handle large dataset operations
-- Use batch processing
DO $$
DECLARE
    batch_size INTEGER := 1000;
    offset_val INTEGER := 0;
BEGIN
    LOOP
        UPDATE users
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id IN (
            SELECT id FROM users
            ORDER BY id
            LIMIT batch_size OFFSET offset_val
        );
        
        EXIT WHEN NOT FOUND;
        offset_val := offset_val + batch_size;
    END LOOP;
END $$;
```

### Lock Contention

```sql
-- Handle lock contention
-- Use appropriate lock modes
BEGIN;
SELECT * FROM users WHERE id = $1 FOR UPDATE NOWAIT;
-- Process...
COMMIT;
```

## Best Practices

1. **Validate data integrity** - Use constraints
2. **Handle migration edge cases** - Test migrations
3. **Security first** - Password hashing, input validation
4. **Performance optimization** - Indexes, query optimization
5. **Transaction management** - Proper transaction handling
6. **Error handling** - Graceful error messages
7. **Backup strategy** - Regular backups
8. **Monitor performance** - Track query performance

