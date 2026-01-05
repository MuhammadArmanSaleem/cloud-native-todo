# PostgreSQL Best Practices

Production-ready patterns and best practices for PostgreSQL databases.

## Database Design

### Naming Conventions

```sql
-- Tables: plural, snake_case
CREATE TABLE users (...);
CREATE TABLE user_profiles (...);

-- Columns: snake_case
CREATE TABLE users (
    user_id UUID,
    email_address VARCHAR(255),
    created_at TIMESTAMPTZ
);

-- Indexes: descriptive names
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);

-- Constraints: descriptive names
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
ALTER TABLE posts ADD CONSTRAINT posts_user_fk FOREIGN KEY (user_id) REFERENCES users(id);
```

### Schema Organization

```sql
-- Use schemas to organize tables
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path
SET search_path TO app, public;

-- Create tables in specific schema
CREATE TABLE app.users (...);
CREATE TABLE audit.audit_log (...);
```

## Data Integrity

### Constraints

```sql
-- Always use constraints
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Transactions

```sql
-- Use transactions for data integrity
BEGIN;

INSERT INTO orders (user_id, total_amount, status)
VALUES ($1, $2, 'pending');

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES ($3, $4, $5, $6);

COMMIT;
```

## Backup and Recovery

### Backup Strategy

```sql
-- Full backup
-- pg_dump -Fc -f backup.dump mydb

-- Backup specific schema
-- pg_dump -n app -Fc -f app_backup.dump mydb

-- Backup with compression
-- pg_dump -Fc -Z 9 -f backup.dump mydb
```

### Point-in-Time Recovery

```sql
-- Enable WAL archiving (postgresql.conf)
wal_level = replica
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'

-- Create base backup
-- pg_basebackup -D /path/to/backup -Ft -z -P
```

## Security

### User Management

```sql
-- Create application user
CREATE USER app_user WITH PASSWORD 'secure_password';

-- Grant minimal permissions
GRANT CONNECT ON DATABASE mydb TO app_user;
GRANT USAGE ON SCHEMA app TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_user;

-- Revoke public schema access
REVOKE ALL ON SCHEMA public FROM PUBLIC;
```

### Password Policies

```sql
-- Use SCRAM-SHA-256 for passwords
ALTER SYSTEM SET password_encryption = 'scram-sha-256';

-- Require strong passwords (application level)
-- Enforce in application code
```

## Performance

### Connection Management

```sql
-- Configure connection limits (postgresql.conf)
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 4MB
```

### Query Optimization

```sql
-- Use prepared statements
PREPARE get_user AS SELECT * FROM users WHERE id = $1;
EXECUTE get_user('123e4567-e89b-12d3-a456-426614174000');

-- Use appropriate data types
-- Use UUID for distributed systems
-- Use INTEGER/BIGINT for sequential IDs
-- Use TIMESTAMPTZ for timestamps
```

## Monitoring

### Health Checks

```sql
-- Check database health
SELECT 
    datname,
    numbackends,
    xact_commit,
    xact_rollback,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted
FROM pg_stat_database
WHERE datname = current_database();
```

### Table Monitoring

```sql
-- Monitor table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'app'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Best Practices Summary

1. **Use UUIDs** - For distributed systems
2. **Always Use Constraints** - Data integrity first
3. **Index Foreign Keys** - Performance optimization
4. **Use Transactions** - For data consistency
5. **Regular Backups** - Backup strategy essential
6. **Monitor Performance** - Track and optimize
7. **Security First** - Least privilege principle
8. **Document Everything** - Comments and documentation
9. **Test Migrations** - Always test before production
10. **Version Control** - Track all schema changes

