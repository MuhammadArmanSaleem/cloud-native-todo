# Delegation to nextjs-frontend Skill

How to delegate implementation tasks to the nextjs-frontend skill.

## Delegation Workflow

### When to Delegate

Delegate to `nextjs-frontend` skill when:
- Creating components
- Implementing UI features
- Handling data fetching
- Styling components
- Setting up Next.js structure

### How to Delegate

1. **Load Task Context**
   - Read task from tasks.md
   - Understand requirements
   - Identify edge cases

2. **Invoke nextjs-frontend Skill**
   - Use skill's patterns from references/
   - Follow component patterns
   - Apply minimalist techy design
   - Use props and maps correctly

3. **Verify Implementation**
   - Check against spec requirements
   - Verify edge cases handled
   - Ensure Next.js best practices

## Task-to-Skill Mapping

### Component Creation Tasks

```text
Task: "Create UserCard component"
    ↓
Delegate to nextjs-frontend:
- Use component-patterns.md
- Define props interface
- Use minimalist techy styling
- Handle edge cases (empty data, loading)
```

### Data Handling Tasks

```text
Task: "Implement user list with data fetching"
    ↓
Delegate to nextjs-frontend:
- Use data-handling.md
- Server Component for fetching
- Client Component for interactivity
- Use maps for rendering
```

### Styling Tasks

```text
Task: "Style components with minimalist techy design"
    ↓
Delegate to nextjs-frontend:
- Use styling.md
- Apply Tailwind patterns
- Follow minimalist techy principles
- Ensure responsive design
```

## Integration Pattern

### Complete Example

```text
Task from tasks.md:
"Phase 3.1: Create UserList component that displays users from API"

1. Load task context
   - Component should display list of users
   - Fetch from /api/users
   - Handle loading/error states

2. Delegate to nextjs-frontend skill:
   - Create Server Component for data fetching
   - Create Client Component for interactivity
   - Use maps for rendering users
   - Apply minimalist techy styling
   - Handle edge cases (empty, loading, error)

3. Implement using skill patterns:
   - data-handling.md for fetching
   - component-patterns.md for structure
   - styling.md for design
   - edge-cases.md for error handling

4. Verify:
   - Matches spec requirements
   - Edge cases handled
   - Next.js best practices followed
```

## Best Practices

1. **Always use skill references** - Follow patterns from nextjs-frontend skill
2. **Handle edge cases** - Use edge-cases.md patterns
3. **Verify against spec** - Ensure requirements met
4. **Follow conventions** - Next.js and project conventions
5. **Test implementation** - Verify functionality works

