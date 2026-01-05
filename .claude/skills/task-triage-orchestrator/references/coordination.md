# Task Coordination

How to coordinate execution across multiple chunks and skills.

## Coordination Strategy

### Execution Order

1. **Foundation First**: Database schema before backend
2. **Build Upward**: Backend before frontend
3. **Integrate Last**: Add integrations after core
4. **Parallel When Possible**: Independent chunks in parallel

### Dependency Management

```text
Sequential Execution:
Chunk 1 → Chunk 2 → Chunk 3

Parallel Execution:
Chunk 1 ──┐
          ├──→ Chunk 4
Chunk 2 ──┤
          │
Chunk 3 ──┘
```

## Coordination Workflow

### Phase 1: Foundation

Execute foundational chunks first:

```text
1. Database Schema (database-sdd-orchestrator)
   - Wait for completion
   - Validate schema
   - Document structure
```

### Phase 2: Core Components

Execute core components:

```text
2. Backend API (backend-sdd-orchestrator)
   - Depends on: Database Schema
   - Wait for completion
   - Validate API
   - Test endpoints
```

### Phase 3: User Interface

Execute UI components:

```text
3. Frontend UI (frontend-sdd-orchestrator)
   - Depends on: Backend API
   - Wait for completion
   - Validate UI
   - Test integration
```

### Phase 4: Integrations

Execute integrations:

```text
4. Voice Integration (direct implementation)
   - Depends on: Frontend + Backend
   - Implement integration
   - Test end-to-end
```

## Progress Tracking

### Track Per Chunk

```text
Chunk Status:
- Pending: Not started
- In Progress: Currently executing
- Completed: Finished and validated
- Blocked: Waiting on dependency
- Failed: Error occurred
```

### Overall Progress

```text
Overall Status:
- Chunks Total: 4
- Chunks Completed: 2
- Chunks In Progress: 1
- Chunks Pending: 1
- Progress: 50%
```

## Integration Points

### Identify Integration Points

1. **API Contracts**: Backend → Frontend
2. **Data Flow**: Database → Backend → Frontend
3. **Event Flow**: Frontend → Backend → Database
4. **External Services**: Integration → All layers

### Validate Integration

```text
For each integration point:
1. Verify contract matches
2. Test data flow
3. Validate error handling
4. Check edge cases
```

## Error Handling

### Chunk Failures

```text
If chunk fails:
1. Identify failure cause
2. Determine impact on other chunks
3. Fix or retry chunk
4. Update dependent chunks if needed
```

### Dependency Failures

```text
If dependency fails:
1. Block dependent chunks
2. Fix dependency first
3. Resume dependent chunks
4. Validate integration
```

## Validation

### Per Chunk Validation

```text
For each completed chunk:
1. Verify deliverables
2. Check requirements met
3. Validate edge cases handled
4. Test integration points
```

### Overall Validation

```text
After all chunks complete:
1. End-to-end testing
2. Integration validation
3. Edge case testing
4. Performance validation
5. Security validation
```

## Best Practices

1. **Execute in Order**: Follow dependency chain
2. **Track Progress**: Monitor chunk status
3. **Validate Integration**: Check integration points
4. **Handle Errors**: Graceful error handling
5. **Test Thoroughly**: Validate each chunk
6. **Document Changes**: Track modifications

