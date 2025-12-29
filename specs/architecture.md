# Architecture Specification - Phase I

## System Architecture

The application follows a clean architecture pattern with clear separation of concerns:

### Layer 1: Domain Model (Task)
- Represents the core business entity
- Contains validation rules and business logic
- Immutable structure with ID, title, description, completion status, and timestamps
- Enforces validation rules for title (1-200 chars) and description (0-1000 chars)

### Layer 2: In-Memory Repository
- Provides data storage and retrieval operations
- Maintains in-memory storage using Python dictionaries
- Handles ID generation and uniqueness
- No persistence to files or databases
- Thread-safe operations (for future extension)

### Layer 3: Service Layer
- Contains business logic and orchestration
- Validates inputs before passing to repository
- Handles error conditions and returns appropriate responses
- Maintains separation between business logic and presentation

### Layer 4: CLI Layer
- Provides command-line interface
- Parses user input and commands
- Formats output for console display
- Handles argument validation and help text

## Error Handling Strategy

### Common Error Conditions
- Invalid task ID
- Empty or invalid title
- Task not found
- Validation failures

### Error Response Pattern
- All operations return a dictionary with `success` boolean
- On success: `{"success": True, "data": ...}`
- On failure: `{"success": False, "error": "error message"}`
- CLI displays human-readable error messages
- Appropriate exit codes (0 for success, 1 for error)

## Deterministic ID Policy

### ID Generation Rules
- Sequential integer IDs starting from 1
- IDs are never reused within a session
- ID uniqueness maintained within in-memory store
- IDs increment with each new task
- IDs remain stable throughout the session lifetime

## Data Flow

### Add Task Flow
1. CLI receives command and arguments
2. Service validates input (title length, etc.)
3. Repository creates new Task object with next available ID
4. Task stored in memory
5. Success response returned to CLI
6. CLI formats and displays result

### Other Operations Flow
1. CLI receives command and arguments
2. Service validates existence of target task
3. Repository performs operation (update/delete/toggle/list)
4. Success/error response returned to CLI
5. CLI formats and displays result

## Technology Constraints

### In-Memory Only
- No file I/O operations
- No database connections
- Data exists only within process lifetime
- Clean state on application restart

### Python Standard Library
- Use only built-in Python libraries
- No external dependencies for core functionality
- Leverage datetime, argparse, json, sys, typing modules

## Quality Requirements

### Performance
- Response time under 100ms for all operations
- Memory efficient storage
- No memory leaks

### Reliability
- Predictable behavior for given inputs
- Proper error handling for all edge cases
- Consistent state management

### Usability
- Clear, human-readable output formatting
- Consistent command structure
- Helpful error messages
- Command-line help functionality