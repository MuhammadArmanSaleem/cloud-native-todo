# PostgreSQL Performance Optimization

Performance optimization patterns for PostgreSQL databases.

## Query Optimization

### EXPLAIN and EXPLAIN ANALYZE

```sql
-- Basic EXPLAIN
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';

-- EXPLAIN with actual execution statistics
EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = '123e4567-e89b-12d3-a456-426614174000';

-- Verbose EXPLAIN
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT u.email, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.email;
```

### Query Optimization Tips

```sql
-- Use LIMIT when possible
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;

-- Use specific columns instead of SELECT *
SELECT id, title, created_at FROM posts WHERE user_id = $1;

-- Use EXISTS instead of COUNT for existence checks
-- Good
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id);

-- Less efficient
SELECT * FROM users u
WHERE (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id) > 0;
```

## Indexing Strategies

### When to Create Indexes

```sql
-- Index foreign keys
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Index frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Composite indexes for multi-column queries
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Partial indexes for filtered queries
CREATE INDEX idx_posts_published ON posts(published) WHERE published = TRUE;
```

### Index Types

```sql
-- B-tree index (default, most common)
CREATE INDEX idx_users_email ON users(email);

-- Hash index (for equality only)
CREATE INDEX idx_users_email_hash ON users USING HASH (email);

-- GIN index (for arrays, JSONB, full-text search)
CREATE INDEX idx_products_tags_gin ON products USING GIN (tags);
CREATE INDEX idx_products_metadata_gin ON products USING GIN (metadata);

-- GiST index (for geometric data, full-text search)
CREATE INDEX idx_locations_coordinates ON locations USING GIST (coordinates);
```

## Connection Pooling

### pgBouncer Configuration

```ini
# pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
max_db_connections = 100
```

### Application-Level Pooling

```python
# Python example with psycopg2 pool
from psycopg2 import pool

connection_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=20,
    host="localhost",
    database="mydb",
    user="user",
    password="password"
)
```

## Vacuum and Maintenance

### VACUUM Operations

```sql
-- Regular VACUUM (reclaims space, updates statistics)
VACUUM;

-- VACUUM ANALYZE (also updates query planner statistics)
VACUUM ANALYZE;

-- VACUUM FULL (reclaims more space, locks table)
VACUUM FULL users;

-- VACUUM VERBOSE (shows detailed information)
VACUUM VERBOSE posts;
```

### Auto-Vacuum Configuration

```sql
-- Check auto-vacuum settings
SHOW autovacuum;
SHOW autovacuum_vacuum_threshold;
SHOW autovacuum_analyze_threshold;

-- Configure auto-vacuum (in postgresql.conf)
autovacuum = on
autovacuum_vacuum_threshold = 50
autovacuum_analyze_threshold = 50
autovacuum_vacuum_scale_factor = 0.2
autovacuum_analyze_scale_factor = 0.1
```

## Monitoring

### Query Performance Monitoring

```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1 second
ALTER SYSTEM SET log_statement = 'all';  -- Log all statements

-- Check active queries
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query,
    query_start,
    now() - query_start AS duration
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY query_start;
```

### Table Statistics

```sql
-- Update table statistics
ANALYZE users;
ANALYZE posts;

-- Check table statistics
SELECT 
    schemaname,
    tablename,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

## Best Practices

1. **Index Foreign Keys** - Always index foreign key columns
2. **Use EXPLAIN ANALYZE** - Analyze query plans regularly
3. **Monitor Slow Queries** - Log and optimize slow queries
4. **Regular VACUUM** - Keep tables optimized
5. **Connection Pooling** - Use connection pooling
6. **Appropriate Indexes** - Don't over-index
7. **Query Optimization** - Write efficient queries
8. **Monitor Performance** - Track database performance metrics

