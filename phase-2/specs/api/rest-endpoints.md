# REST API Endpoints

## Base URL

- Development: `http://localhost:8000`
- Production: TBD

## Authentication

All endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

Requests without valid token receive `401 Unauthorized`.

## Endpoints

### GET /api/tasks

List all tasks for authenticated user.

**Query Parameters**:
- `status`: "all" | "pending" | "completed" (optional)
- `priority`: "high" | "medium" | "low" (optional, can be multiple)
- `tags`: comma-separated tag list (optional)
- `search`: keyword string (optional)
- `sort`: "created_at" | "due_date" | "priority" | "title" (optional)
- `order`: "asc" | "desc" (optional, default: "desc")

**Response**: Array of Task objects

**Example**:
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "priority": "high",
    "tags": ["shopping", "home"],
    "due_date": "2024-01-15T10:00:00Z",
    "created_at": "2024-01-10T08:00:00Z",
    "updated_at": "2024-01-10T08:00:00Z"
  }
]
```

### POST /api/tasks

Create a new task.

**Request Body**:
```json
{
  "title": "New task",
  "description": "Optional description",
  "priority": "medium",
  "tags": ["work"],
  "due_date": "2024-01-20T10:00:00Z",
  "reminder_time": "2024-01-20T09:00:00Z",
  "recurring_pattern": "weekly"
}
```

**Response**: Created Task object (201 Created)

### GET /api/tasks/{id}

Get task details.

**Response**: Task object (200 OK) or 404 Not Found

### PUT /api/tasks/{id}

Update a task.

**Request Body**: Same as POST (all fields optional)

**Response**: Updated Task object (200 OK) or 404 Not Found

### DELETE /api/tasks/{id}

Delete a task.

**Response**: 204 No Content or 404 Not Found

### PATCH /api/tasks/{id}/complete

Toggle task completion status.

**Response**: Updated Task object (200 OK) or 404 Not Found

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "detail": "Task not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "Title is required",
      "type": "value_error"
    }
  ]
}
```

## User Isolation

All endpoints automatically filter by authenticated user's ID (from JWT token). Users can only access their own tasks.

