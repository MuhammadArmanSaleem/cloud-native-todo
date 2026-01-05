# Enforcement Patterns

How to block violations and guide corrections.

## Enforcement Strategy

### Pattern 1: Block and Explain

**When to Use**: Violation detected that prevents proper execution

**Pattern**:
```text
1. BLOCK execution immediately
2. EXPLAIN what's wrong
3. SHOW what's required
4. GUIDE to correction
```

**Example**:
```text
Violation: Direct implementation without planning

Response:
"❌ BLOCKED: Direct implementation detected

This violates workflow requirements:
- Complex goals must use task-triage-orchestrator
- All tasks must follow SpecKit Plus workflow
- Planning must precede implementation

Required Steps:
1. Use task-triage-orchestrator to break goal into chunks
2. Follow SpecKit Plus workflow: constitution → spec → plan → tasks
3. Complete planning before implementation

Please restart with proper workflow."
```

### Pattern 2: Require Missing Component

**When to Use**: Missing required component (Context7, skill, phase)

**Pattern**:
```text
1. BLOCK execution
2. IDENTIFY missing component
3. REQUIRE its completion
4. WAIT for completion before proceeding
```

**Example**:
```text
Violation: Context7 not queried

Response:
"❌ BLOCKED: Context7 usage required

Missing: Context7 query for latest Next.js documentation

Required Action:
1. Query Context7 for: 'Next.js App Router patterns, component architecture'
2. Document findings in research.md
3. Apply patterns in implementation

Please query Context7 before proceeding."
```

### Pattern 3: Redirect to Correct Skill

**When to Use**: Wrong skill being used

**Pattern**:
```text
1. BLOCK execution
2. IDENTIFY correct skill
3. EXPLAIN why
4. GUIDE to proper skill
```

**Example**:
```text
Violation: Complex goal without triage orchestrator

Response:
"❌ BLOCKED: Incorrect skill usage

Detected: Complex multi-part goal
Current: Direct implementation
Required: task-triage-orchestrator

Why: Complex goals must be broken into chunks first

Action Required:
1. Activate task-triage-orchestrator
2. Break goal into logical chunks
3. Delegate chunks to appropriate skills

Please use task-triage-orchestrator for this goal."
```

### Pattern 4: Complete Workflow First

**When to Use**: Missing SpecKit Plus phases

**Pattern**:
```text
1. BLOCK execution
2. LIST missing phases
3. SHOW required order
4. REQUIRE completion
```

**Example**:
```text
Violation: Missing SpecKit Plus phases

Response:
"❌ BLOCKED: Incomplete SpecKit Plus workflow

Missing Phases:
- [ ] Constitution check/update
- [ ] Specification creation
- [ ] Plan generation
- [x] Task breakdown (completed)
- [ ] Implementation

Required Order:
1. Constitution → .specify/memory/constitution.md
2. Specification → specs/<feature>/spec.md
3. Plan → specs/<feature>/plan.md
4. Tasks → specs/<feature>/tasks.md
5. Implementation → Execute tasks

Please complete missing phases before implementation."
```

## Enforcement Examples

### Example 1: Shortcut Detection

```text
User: "Make a todo app"
AI: [Starts coding directly]

Guardrail Response:
"❌ BLOCKED: Shortcut detected

Violation: Direct implementation without proper workflow

Required Process:
1. Use task-triage-orchestrator to analyze goal
2. Break into chunks: Database → Backend → Frontend
3. For each chunk, follow SpecKit Plus workflow
4. Complete planning before implementation

Please restart with proper workflow."
```

### Example 2: Missing Context7

```text
User: "Build FastAPI backend"
AI: [Implements without Context7]

Guardrail Response:
"❌ BLOCKED: Context7 usage required

Missing: Context7 query for FastAPI documentation

Required:
1. Query Context7: 'FastAPI authentication OAuth2, security best practices'
2. Document findings in research.md
3. Apply patterns in implementation

Context7 is mandatory for all skill executions."
```

### Example 3: Wrong Skill

```text
User: "Build full-stack todo app"
AI: [Uses frontend-sdd-orchestrator directly]

Guardrail Response:
"❌ BLOCKED: Incorrect skill usage

Detected: Complex multi-part goal
Current: frontend-sdd-orchestrator (single component)
Required: task-triage-orchestrator (multi-component)

Action:
1. Use task-triage-orchestrator first
2. Break into chunks
3. Delegate frontend chunk to frontend-sdd-orchestrator

Complex goals require triage orchestrator."
```

### Example 4: Missing Workflow Phase

```text
User: "Create REST API"
AI: [Skips spec and plan, goes to tasks]

Guardrail Response:
"❌ BLOCKED: Missing SpecKit Plus phases

Completed: Tasks
Missing: Specification, Plan

Required:
1. Create spec.md with requirements
2. Generate plan.md with architecture
3. Then create tasks.md
4. Finally implement

SpecKit Plus workflow must be complete."
```

## Best Practices

1. **Block Immediately**: Don't allow partial execution
2. **Explain Clearly**: Show what's wrong and why
3. **Guide Specifically**: Provide exact steps to fix
4. **Require Completion**: Don't proceed until fixed
5. **Show Examples**: Provide examples of correct usage
6. **Be Helpful**: Guide to solution, don't just block

