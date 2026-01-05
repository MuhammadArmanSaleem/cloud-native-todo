# PostgreSQL Security Practices

Comprehensive security patterns for PostgreSQL databases.

## Access Control

### Role-Based Access

```sql
-- Create application roles
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';
CREATE ROLE app_readonly WITH LOGIN PASSWORD 'readonly_password';

-- Grant permissions
GRANT CONNECT ON DATABASE mydb TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Read-only access
GRANT CONNECT ON DATABASE mydb TO app_readonly;
GRANT USAGE ON SCHEMA public TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
```

### Row-Level Security (RLS)

```sql
-- Enable RLS on table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own posts
CREATE POLICY user_posts_policy ON posts
    FOR ALL
    USING (user_id = current_setting('app.user_id')::UUID);

-- Policy: Users can see published posts
CREATE POLICY published_posts_policy ON posts
    FOR SELECT
    USING (published = TRUE OR user_id = current_setting('app.user_id')::UUID);
```

## Encryption

### Encrypted Columns

```sql
-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table with encrypted sensitive data
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    ssn_encrypted BYTEA,  -- Encrypted SSN
    credit_card_encrypted BYTEA,  -- Encrypted credit card
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Function to encrypt data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(
    data TEXT,
    encryption_key TEXT
) RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, encryption_key);
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(
    encrypted_data BYTEA,
    encryption_key TEXT
) RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data, encryption_key);
END;
$$ LANGUAGE plpgsql;
```

### Connection Encryption

```sql
-- Require SSL connections (in postgresql.conf)
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'

-- In pg_hba.conf, require SSL
hostssl    all    all    0.0.0.0/0    md5
```

## Audit Logging

### Audit Table

```sql
-- Audit log table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,  -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Index for queries
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at DESC);
CREATE INDEX idx_audit_log_changed_by ON audit_log(changed_by);
```

### Audit Trigger Function

```sql
-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_old_data := to_jsonb(OLD);
        INSERT INTO audit_log (table_name, record_id, action, old_data)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', v_old_data);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        INSERT INTO audit_log (table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', v_old_data, v_new_data);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        v_new_data := to_jsonb(NEW);
        INSERT INTO audit_log (table_name, record_id, action, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', v_new_data);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to users table
CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();
```

## SQL Injection Prevention

### Parameterized Queries Pattern

```sql
-- Always use parameterized queries (application level)
-- Good: Parameterized
SELECT * FROM users WHERE email = $1;

-- Bad: String concatenation (vulnerable to SQL injection)
-- SELECT * FROM users WHERE email = 'user@example.com'; -- DON'T DO THIS
```

### Input Validation Functions

```sql
-- Function to sanitize input
CREATE OR REPLACE FUNCTION sanitize_input(input TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Remove SQL comment markers
    input := replace(input, '--', '');
    input := replace(input, '/*', '');
    input := replace(input, '*/', '');
    
    -- Remove semicolons
    input := replace(input, ';', '');
    
    -- Trim whitespace
    RETURN trim(input);
END;
$$ LANGUAGE plpgsql;
```

## Secure Configuration

### PostgreSQL Configuration

```sql
-- Security settings (postgresql.conf)
password_encryption = scram-sha-256  -- Use SCRAM-SHA-256 for passwords
ssl = on  -- Enable SSL
log_connections = on  -- Log all connections
log_disconnections = on  -- Log disconnections
log_duration = on  -- Log query duration
log_statement = 'ddl'  -- Log DDL statements
```

### Connection Security

```sql
-- pg_hba.conf - Host-based authentication
# TYPE  DATABASE  USER  ADDRESS  METHOD

# Local connections
local   all       all           scram-sha-256

# IPv4 connections with SSL
hostssl all       all   0.0.0.0/0  scram-sha-256

# IPv6 connections with SSL
hostssl all       all   ::/0       scram-sha-256
```

## Data Masking

### Sensitive Data Masking

```sql
-- Function to mask email
CREATE OR REPLACE FUNCTION mask_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
    IF email IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN regexp_replace(
        email,
        '^(.{1,3})(.*)(@.*)$',
        '\1***\3',
        'g'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to mask credit card
CREATE OR REPLACE FUNCTION mask_credit_card(card_number TEXT)
RETURNS TEXT AS $$
BEGIN
    IF card_number IS NULL OR length(card_number) < 4 THEN
        RETURN '****';
    END IF;
    
    RETURN '****-****-****-' || right(card_number, 4);
END;
$$ LANGUAGE plpgsql;
```

## Backup Security

### Secure Backup

```sql
-- Backup with encryption
-- pg_dump with custom format and encryption
-- pg_dump -Fc -f backup.dump mydb

-- Restore from encrypted backup
-- pg_restore -d mydb backup.dump
```

## Best Practices

1. **Use Strong Passwords** - Enforce password policies
2. **Enable SSL** - Always use encrypted connections
3. **Row-Level Security** - Implement RLS for multi-tenant data
4. **Audit Everything** - Log all sensitive operations
5. **Least Privilege** - Grant minimum necessary permissions
6. **Regular Updates** - Keep PostgreSQL updated
7. **Backup Encryption** - Encrypt database backups
8. **Monitor Access** - Log and monitor database access
9. **Parameterized Queries** - Always use parameterized queries
10. **Input Validation** - Validate and sanitize all input

