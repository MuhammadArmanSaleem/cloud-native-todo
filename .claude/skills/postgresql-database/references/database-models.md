# PostgreSQL Database Models

Comprehensive database schema design patterns for PostgreSQL.

## Table Creation Patterns

### Basic Table with Constraints

```sql
-- Users table with comprehensive constraints
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Check constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT username_length CHECK (length(username) >= 3 AND length(username) <= 30)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
```

### Table with Foreign Keys

```sql
-- Posts table with foreign key relationship
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT title_length CHECK (length(title) >= 1 AND length(title) <= 255),
    CONSTRAINT content_length CHECK (length(content) >= 1),
    CONSTRAINT published_date CHECK (
        (published = FALSE AND published_at IS NULL) OR
        (published = TRUE AND published_at IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published) WHERE published = TRUE;
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### Table with Composite Keys

```sql
-- User roles table with composite primary key
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    
    PRIMARY KEY (user_id, role),
    CONSTRAINT valid_role CHECK (role IN ('admin', 'moderator', 'user', 'guest'))
);

-- Index for role lookups
CREATE INDEX idx_user_roles_role ON user_roles(role);
```

## Data Types Best Practices

### UUID vs Serial

```sql
-- Use UUID for distributed systems or when IDs should be unguessable
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL
);

-- Use SERIAL/BIGSERIAL for simple auto-incrementing IDs
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL
);
```

### Timestamps

```sql
-- Always use TIMESTAMPTZ (timestamp with time zone)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    occurred_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### JSON and JSONB

```sql
-- Use JSONB for structured data (indexed, faster queries)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    metadata JSONB,  -- Flexible schema
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index JSONB fields
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);
CREATE INDEX idx_products_tags ON products USING GIN (tags);

-- Query JSONB
SELECT * FROM products 
WHERE metadata->>'category' = 'electronics';
```

## Relationships

### One-to-Many

```sql
-- User has many posts
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL
);
```

### Many-to-Many

```sql
-- Posts and Tags many-to-many relationship
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- Indexes
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

### Self-Referential

```sql
-- Comments with parent comments (threading)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for parent lookups
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
```

## Constraints

### Check Constraints

```sql
-- Table with multiple check constraints
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_percent INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    CONSTRAINT positive_amount CHECK (total_amount >= 0),
    CONSTRAINT valid_discount CHECK (discount_percent >= 0 AND discount_percent <= 100)
);
```

### Unique Constraints

```sql
-- Multiple unique constraints
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    
    -- Composite unique constraint
    CONSTRAINT unique_user_email UNIQUE (user_id, email)
);
```

## Indexes

### Basic Indexes

```sql
-- Single column index
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Composite index
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Partial index (only for active records)
CREATE INDEX idx_users_active_email ON users(email) WHERE is_active = TRUE;

-- Unique index
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
```

### Advanced Indexes

```sql
-- GIN index for JSONB
CREATE INDEX idx_products_metadata_gin ON products USING GIN (metadata);

-- GIN index for arrays
CREATE INDEX idx_products_tags_gin ON products USING GIN (tags);

-- Full-text search index
CREATE INDEX idx_posts_content_fts ON posts USING GIN (to_tsvector('english', content));

-- Expression index
CREATE INDEX idx_users_email_lower ON users(lower(email));
```

## Best Practices

1. **Use UUID for Primary Keys** - Better for distributed systems
2. **Always Use TIMESTAMPTZ** - Never use TIMESTAMP without timezone
3. **Add Constraints** - NOT NULL, CHECK, UNIQUE, FOREIGN KEY
4. **Index Foreign Keys** - Always index foreign key columns
5. **Use JSONB for Flexible Data** - Better than JSON
6. **Normalize Properly** - Follow 3NF but denormalize when needed for performance
7. **Name Consistently** - Use consistent naming conventions
8. **Document Constraints** - Add comments explaining complex constraints

