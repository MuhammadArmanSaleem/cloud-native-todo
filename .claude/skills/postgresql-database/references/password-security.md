# PostgreSQL Password Security

Comprehensive password security patterns using modern hashing algorithms with unique salts and password stretching.

## Modern Password Hashing Principles

### Key Requirements

1. **Strong, Modern Algorithms**: Argon2 (preferred), bcrypt, or scrypt
2. **Unique Salt per Password**: Every password gets a unique, random salt
3. **Password Stretching**: Multiple iterations for key strengthening
4. **Secure Salt Storage**: Salts stored with hashes (not secret, but properly managed)
5. **Algorithm Migration**: Path to upgrade to newer algorithms

## Argon2 Implementation (Recommended)

### Argon2 Overview

Argon2 is the winner of the Password Hashing Competition (2015) and is the current recommended standard. It's resistant to GPU cracking attacks and side-channel attacks.

### Basic Argon2 Setup

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table with Argon2 password storage
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Argon2 hash (includes salt)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Function to hash password with Argon2
CREATE OR REPLACE FUNCTION hash_password_argon2(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- gen_salt('argon2') generates unique salt automatically
    -- Argon2 parameters: memory cost, time cost, parallelism
    RETURN crypt(password, gen_salt('argon2'));
END;
$$ LANGUAGE plpgsql;

-- Function to verify password
CREATE OR REPLACE FUNCTION verify_password_argon2(
    entered_password TEXT,
    stored_hash TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    -- crypt() automatically extracts salt from stored_hash
    RETURN stored_hash = crypt(entered_password, stored_hash);
END;
$$ LANGUAGE plpgsql;
```

### Argon2 with Custom Parameters

```sql
-- Argon2 with custom parameters (memory, time, parallelism)
CREATE OR REPLACE FUNCTION hash_password_argon2_strong(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- gen_salt('argon2', cost) where cost is memory cost (2^cost KB)
    -- Higher cost = more secure but slower
    RETURN crypt(password, gen_salt('argon2', 19));  -- 2^19 KB = 512 MB
END;
$$ LANGUAGE plpgsql;
```

### Usage Example

```sql
-- Create user with hashed password
INSERT INTO users (email, password_hash)
VALUES (
    'user@example.com',
    hash_password_argon2('secure_password_123')
);

-- Verify password on login
SELECT 
    id,
    email,
    verify_password_argon2('entered_password', password_hash) AS password_valid
FROM users
WHERE email = 'user@example.com';
```

## bcrypt Implementation

### bcrypt Overview

bcrypt is a well-established password hashing function designed by Niels Provos and David Mazières. It's widely supported and battle-tested.

### bcrypt Setup

```sql
-- Function to hash password with bcrypt
CREATE OR REPLACE FUNCTION hash_password_bcrypt(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- gen_salt('bf') generates bcrypt salt
    -- Second parameter is cost factor (4-31, default 10)
    -- Cost 10 = 2^10 = 1024 iterations
    RETURN crypt(password, gen_salt('bf', 12));  -- Cost factor 12
END;
$$ LANGUAGE plpgsql;

-- Function to verify bcrypt password
CREATE OR REPLACE FUNCTION verify_password_bcrypt(
    entered_password TEXT,
    stored_hash TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN stored_hash = crypt(entered_password, stored_hash);
END;
$$ LANGUAGE plpgsql;
```

### bcrypt with Adjustable Cost

```sql
-- Function with configurable cost factor
CREATE OR REPLACE FUNCTION hash_password_bcrypt_cost(
    password TEXT,
    cost_factor INTEGER DEFAULT 12
) RETURNS TEXT AS $$
BEGIN
    -- Validate cost factor (4-31)
    IF cost_factor < 4 OR cost_factor > 31 THEN
        RAISE EXCEPTION 'Cost factor must be between 4 and 31';
    END IF;
    
    RETURN crypt(password, gen_salt('bf', cost_factor));
END;
$$ LANGUAGE plpgsql;
```

## scrypt Implementation

### scrypt Overview

scrypt is a password-based key derivation function designed to be memory-hard, making it resistant to hardware attacks.

### scrypt Setup

```sql
-- Function to hash password with scrypt
CREATE OR REPLACE FUNCTION hash_password_scrypt(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- gen_salt('scrypt') generates scrypt salt
    RETURN crypt(password, gen_salt('scrypt'));
END;
$$ LANGUAGE plpgsql;

-- Function to verify scrypt password
CREATE OR REPLACE FUNCTION verify_password_scrypt(
    entered_password TEXT,
    stored_hash TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN stored_hash = crypt(entered_password, stored_hash);
END;
$$ LANGUAGE plpgsql;
```

## Complete User Management with Password Security

### Secure User Table

```sql
-- Users table with comprehensive security
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Argon2/bcrypt hash (includes salt)
    password_algorithm VARCHAR(20) DEFAULT 'argon2',  -- Track algorithm used
    password_changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$')
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
```

### User Registration Function

```sql
-- Function to create user with secure password
CREATE OR REPLACE FUNCTION create_user(
    p_email VARCHAR(255),
    p_username VARCHAR(100),
    p_password TEXT
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_password_hash TEXT;
BEGIN
    -- Validate password strength (minimum 8 characters, etc.)
    IF length(p_password) < 8 THEN
        RAISE EXCEPTION 'Password must be at least 8 characters';
    END IF;
    
    -- Hash password with Argon2
    v_password_hash := hash_password_argon2(p_password);
    
    -- Insert user
    INSERT INTO users (email, username, password_hash, password_algorithm)
    VALUES (p_email, p_username, v_password_hash, 'argon2')
    RETURNING id INTO v_user_id;
    
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;
```

### User Authentication Function

```sql
-- Function to authenticate user
CREATE OR REPLACE FUNCTION authenticate_user(
    p_email VARCHAR(255),
    p_password TEXT
) RETURNS TABLE(
    user_id UUID,
    email VARCHAR(255),
    username VARCHAR(100),
    authenticated BOOLEAN
) AS $$
DECLARE
    v_user RECORD;
    v_password_valid BOOLEAN;
BEGIN
    -- Get user
    SELECT * INTO v_user
    FROM users
    WHERE email = p_email AND is_active = TRUE;
    
    -- Check if user exists
    IF v_user IS NULL THEN
        RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, FALSE::BOOLEAN;
        RETURN;
    END IF;
    
    -- Check if account is locked
    IF v_user.locked_until IS NOT NULL AND v_user.locked_until > CURRENT_TIMESTAMP THEN
        RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, FALSE::BOOLEAN;
        RETURN;
    END IF;
    
    -- Verify password based on algorithm
    CASE v_user.password_algorithm
        WHEN 'argon2' THEN
            v_password_valid := verify_password_argon2(p_password, v_user.password_hash);
        WHEN 'bcrypt' THEN
            v_password_valid := verify_password_bcrypt(p_password, v_user.password_hash);
        WHEN 'scrypt' THEN
            v_password_valid := verify_password_scrypt(p_password, v_user.password_hash);
        ELSE
            RAISE EXCEPTION 'Unknown password algorithm: %', v_user.password_algorithm;
    END CASE;
    
    -- Update login attempts
    IF v_password_valid THEN
        -- Successful login
        UPDATE users
        SET 
            failed_login_attempts = 0,
            locked_until = NULL,
            last_login = CURRENT_TIMESTAMP
        WHERE id = v_user.id;
        
        RETURN QUERY SELECT v_user.id, v_user.email, v_user.username, TRUE::BOOLEAN;
    ELSE
        -- Failed login
        UPDATE users
        SET failed_login_attempts = failed_login_attempts + 1
        WHERE id = v_user.id;
        
        -- Lock account after 5 failed attempts (15 minutes)
        UPDATE users
        SET locked_until = CURRENT_TIMESTAMP + INTERVAL '15 minutes'
        WHERE id = v_user.id AND failed_login_attempts >= 5;
        
        RETURN QUERY SELECT NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, FALSE::BOOLEAN;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

## Password Update with Algorithm Migration

### Password Change Function

```sql
-- Function to update password (with algorithm migration support)
CREATE OR REPLACE FUNCTION update_password(
    p_user_id UUID,
    p_old_password TEXT,
    p_new_password TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_user RECORD;
    v_old_password_valid BOOLEAN;
    v_new_password_hash TEXT;
BEGIN
    -- Get user
    SELECT * INTO v_user
    FROM users
    WHERE id = p_user_id AND is_active = TRUE;
    
    IF v_user IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Verify old password
    CASE v_user.password_algorithm
        WHEN 'argon2' THEN
            v_old_password_valid := verify_password_argon2(p_old_password, v_user.password_hash);
        WHEN 'bcrypt' THEN
            v_old_password_valid := verify_password_bcrypt(p_old_password, v_user.password_hash);
        WHEN 'scrypt' THEN
            v_old_password_valid := verify_password_scrypt(p_old_password, v_user.password_hash);
        ELSE
            RETURN FALSE;
    END CASE;
    
    IF NOT v_old_password_valid THEN
        RETURN FALSE;
    END IF;
    
    -- Validate new password strength
    IF length(p_new_password) < 8 THEN
        RAISE EXCEPTION 'New password must be at least 8 characters';
    END IF;
    
    -- Hash new password with latest algorithm (Argon2)
    v_new_password_hash := hash_password_argon2(p_new_password);
    
    -- Update password (migrate to Argon2 if using older algorithm)
    UPDATE users
    SET 
        password_hash = v_new_password_hash,
        password_algorithm = 'argon2',  -- Migrate to latest algorithm
        password_changed_at = CURRENT_TIMESTAMP,
        failed_login_attempts = 0,
        locked_until = NULL
    WHERE id = p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

## Password Strength Validation

### Password Requirements Function

```sql
-- Function to validate password strength
CREATE OR REPLACE FUNCTION validate_password_strength(password TEXT)
RETURNS TABLE(
    is_valid BOOLEAN,
    error_message TEXT
) AS $$
BEGIN
    -- Minimum length
    IF length(password) < 8 THEN
        RETURN QUERY SELECT FALSE, 'Password must be at least 8 characters';
        RETURN;
    END IF;
    
    -- Maximum length (prevent DoS)
    IF length(password) > 128 THEN
        RETURN QUERY SELECT FALSE, 'Password must be less than 128 characters';
        RETURN;
    END IF;
    
    -- Check for uppercase
    IF password !~ '[A-Z]' THEN
        RETURN QUERY SELECT FALSE, 'Password must contain at least one uppercase letter';
        RETURN;
    END IF;
    
    -- Check for lowercase
    IF password !~ '[a-z]' THEN
        RETURN QUERY SELECT FALSE, 'Password must contain at least one lowercase letter';
        RETURN;
    END IF;
    
    -- Check for digit
    IF password !~ '[0-9]' THEN
        RETURN QUERY SELECT FALSE, 'Password must contain at least one digit';
        RETURN;
    END IF;
    
    -- Check for special character
    IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
        RETURN QUERY SELECT FALSE, 'Password must contain at least one special character';
        RETURN;
    END IF;
    
    -- Password is valid
    RETURN QUERY SELECT TRUE, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;
```

## Algorithm Comparison

### When to Use Each Algorithm

| Algorithm | When to Use | Security Level | Performance |
|-----------|-------------|----------------|-------------|
| **Argon2** | **Recommended** - New implementations | Highest | Good (configurable) |
| **bcrypt** | Well-established, widely supported | High | Good |
| **scrypt** | Memory-constrained environments | High | Good (memory-hard) |

### Migration Strategy

```sql
-- Function to migrate passwords to newer algorithm
CREATE OR REPLACE FUNCTION migrate_password_algorithm(
    p_user_id UUID,
    p_password TEXT,
    p_new_algorithm VARCHAR(20) DEFAULT 'argon2'
) RETURNS BOOLEAN AS $$
DECLARE
    v_user RECORD;
    v_new_hash TEXT;
BEGIN
    -- Get user
    SELECT * INTO v_user
    FROM users
    WHERE id = p_user_id;
    
    IF v_user IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Hash with new algorithm
    CASE p_new_algorithm
        WHEN 'argon2' THEN
            v_new_hash := hash_password_argon2(p_password);
        WHEN 'bcrypt' THEN
            v_new_hash := hash_password_bcrypt(p_password);
        WHEN 'scrypt' THEN
            v_new_hash := hash_password_scrypt(p_password);
        ELSE
            RAISE EXCEPTION 'Unknown algorithm: %', p_new_algorithm;
    END CASE;
    
    -- Update user
    UPDATE users
    SET 
        password_hash = v_new_hash,
        password_algorithm = p_new_algorithm,
        password_changed_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

## Best Practices Summary

1. **Use Argon2** - Preferred modern algorithm
2. **Unique Salts** - Automatically handled by gen_salt()
3. **Appropriate Cost Factors** - Balance security and performance
4. **Algorithm Tracking** - Store which algorithm was used
5. **Password Strength** - Enforce strong password requirements
6. **Account Locking** - Prevent brute force attacks
7. **Migration Path** - Support upgrading algorithms
8. **Never Store Plain Text** - Always hash passwords
9. **Regular Updates** - Review and update security practices
10. **Audit Logging** - Log password changes and failed attempts

