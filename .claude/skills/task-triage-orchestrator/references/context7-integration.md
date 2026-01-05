# Context7 Integration for Triage

How to use Context7 to research chunks before delegation.

## Research Strategy

### For Each Chunk

1. **Identify Key Technologies**
   - What technologies are involved?
   - What patterns are needed?
   - What integrations required?

2. **Query Context7**
   - Latest patterns and best practices
   - Security considerations
   - Performance optimization
   - Integration approaches

3. **Consolidate Findings**
   - Document patterns found
   - Note best practices
   - Identify code examples
   - Highlight security considerations

## Research by Chunk Type

### Database Chunks

**Query For**:
- Schema design patterns
- Security best practices (password hashing)
- Performance optimization
- Migration strategies

**Example**:
```text
Query: "PostgreSQL database security, password hashing Argon2, schema design best practices"
Library: /websites/postgresql
```

### Backend Chunks

**Query For**:
- API design patterns
- Authentication/authorization
- Security best practices
- Error handling

**Example**:
```text
Query: "FastAPI authentication OAuth2, security best practices, error handling patterns"
Library: /websites/fastapi_tiangolo
```

### Frontend Chunks

**Query For**:
- Component patterns
- State management
- Performance optimization
- Accessibility

**Example**:
```text
Query: "Next.js App Router patterns, component architecture, data fetching, performance optimization"
Library: /vercel/next.js
```

### Integration Chunks

**Query For**:
- API integration patterns
- Authentication methods
- Error handling
- Rate limiting

**Example**:
```text
Query: "Web Speech API integration, speech recognition patterns, voice command processing"
Library: /websites/mdn
```

## Context Package Structure

### For Each Chunk

```text
Context Package:
1. Latest Patterns
   - Code examples
   - Best practices
   - Recommended approaches

2. Security Considerations
   - Security patterns
   - Vulnerabilities to avoid
   - Best practices

3. Performance Optimization
   - Optimization techniques
   - Performance patterns
   - Monitoring approaches

4. Integration Guidance
   - How to integrate
   - Common pitfalls
   - Testing strategies

5. Edge Cases
   - Known edge cases
   - How to handle them
   - Error scenarios
```

## Research Workflow

### Step-by-Step

```text
1. Identify Chunk
   ↓
2. Identify Key Technologies
   ↓
3. Query Context7 for Each Technology
   ↓
4. Consolidate Findings
   ↓
5. Build Context Package
   ↓
6. Include in Delegation
```

## Example Research

### Example: Voice Integration Chunk

```text
Chunk: Voice Integration for Todo App

Technologies:
- Web Speech API
- Speech recognition
- Command parsing

Context7 Queries:
1. "Web Speech API integration, speech recognition patterns"
2. "Voice command parsing, natural language processing"
3. "Browser speech API best practices"

Findings:
- Web Speech API provides speech recognition
- Need to handle browser compatibility
- Command parsing requires pattern matching
- Error handling for recognition failures

Context Package:
- Latest Web Speech API patterns
- Browser compatibility considerations
- Command parsing strategies
- Error handling approaches
```

## Best Practices

1. **Research Early**: Query Context7 before delegation
2. **Be Specific**: Targeted queries get better results
3. **Consolidate**: Organize findings clearly
4. **Include Examples**: Code examples are valuable
5. **Note Edge Cases**: Document known issues
6. **Update Knowledge**: Keep findings current

