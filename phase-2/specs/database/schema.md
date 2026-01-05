# Database Schema

## Overview

Neon Serverless PostgreSQL database with SQLModel ORM.

## Tables

### users (Better Auth managed)

Better Auth creates and manages this table. We reference it but don't create it.

**Fields**:
- `id`: string (primary key, UUID)
- `email`: string (unique, not null)
- `name`: string (nullable)
- `created_at`: timestamp

### tasks

Main tasks table for user todos.

**Fields**:
- `id`: integer (primary key, auto-increment)
- `user_id`: string (foreign key → users.id, not null)
- `title`: string (not null, max 200 chars)
- `description`: text (nullable, max 1000 chars)
- `completed`: boolean (default false, not null)
- `priority`: string (nullable, enum: "high", "medium", "low")
- `tags`: array of strings (nullable, PostgreSQL array)
- `due_date`: timestamp (nullable)
- `reminder_time`: timestamp (nullable)
- `recurring_pattern`: string (nullable, enum: "daily", "weekly", "monthly")
- `next_occurrence`: timestamp (nullable)
- `original_task_id`: integer (nullable, foreign key → tasks.id, for recurring tasks)
- `created_at`: timestamp (default now, not null)
- `updated_at`: timestamp (default now, not null)

## Indexes

For performance optimization:

- `tasks.user_id` - For filtering by user (most common query)
- `tasks.completed` - For status filtering
- `tasks.priority` - For priority sorting/filtering
- `tasks.due_date` - For date sorting and overdue queries
- `tasks.created_at` - For creation date sorting

## Relationships

- `tasks.user_id` → `users.id` (many-to-one)
- `tasks.original_task_id` → `tasks.id` (self-referential, for recurring tasks)

## Constraints

- `title` length: 1-200 characters
- `description` length: max 1000 characters
- `priority` must be one of: "high", "medium", "low"
- `recurring_pattern` must be one of: "daily", "weekly", "monthly"
- `user_id` must reference existing user

## Migration Strategy

- Use SQLModel migrations
- Version control all schema changes
- Test migrations on development database first

## Sample Data

```sql
-- Example task
INSERT INTO tasks (user_id, title, description, completed, priority, tags, due_date)
VALUES (
  'user-uuid-123',
  'Buy groceries',
  'Milk, eggs, bread',
  false,
  'high',
  ARRAY['shopping', 'home'],
  '2024-01-15 10:00:00'
);
```

