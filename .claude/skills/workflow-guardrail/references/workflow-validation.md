# Workflow Validation

How to validate that proper workflows are being followed.

## Validation Framework

### Step 1: Request Classification

**Analyze Request**:
- Extract goal description
- Identify complexity
- Determine scope

**Classify**:
- **Complex Multi-Part** → Requires `task-triage-orchestrator`
- **Frontend Task** → Requires `frontend-sdd-orchestrator` + SpecKit Plus
- **Backend Task** → Requires `backend-sdd-orchestrator` + SpecKit Plus
- **Database Task** → Requires `database-sdd-orchestrator` + SpecKit Plus
- **Simple Task** → Can use domain skill directly

### Step 2: Skill Activation Check

**For Complex Goals**:
```text
Request: "Build a todo app with voice automation"
Check:
- Is task-triage-orchestrator being used? → MUST BE YES
- If NO → BLOCK: "Complex goals must use task-triage-orchestrator"
```

**For Component Tasks**:
```text
Request: "Create REST API for todos"
Check:
- Is backend-sdd-orchestrator being used? → MUST BE YES
- If NO → BLOCK: "Backend tasks must use backend-sdd-orchestrator"
```

### Step 3: SpecKit Plus Workflow Check

**Required Phases**:
1. Constitution (check/update)
2. Specification (create)
3. Plan (generate)
4. Tasks (break down)
5. Implementation (execute)

**Validation**:
```text
For each phase:
- Is phase completed? → Check for artifacts
- Are artifacts present? → Verify files exist
- Is phase in correct order? → Check sequence
```

**Example**:
```text
Request: "Build frontend UI"
Check:
- Constitution checked? → .specify/memory/constitution.md exists?
- Spec created? → specs/<feature>/spec.md exists?
- Plan generated? → specs/<feature>/plan.md exists?
- Tasks created? → specs/<feature>/tasks.md exists?
- If any missing → BLOCK: "Complete SpecKit Plus workflow first"
```

### Step 4: Chunking Validation (Complex Tasks)

**For Complex Goals**:
```text
Request: "Build todo app with voice automation"
Check:
- Is goal broken into chunks? → Must have chunks
- Are chunks logical? → Each chunk is delegatable
- Are dependencies identified? → Execution order clear
- If missing → BLOCK: "Break goal into chunks first"
```

**Chunk Requirements**:
- Each chunk is independently delegatable
- Dependencies are clear
- Execution order is determined
- Integration points identified

### Step 5: Shortcut Detection

**Detect Shortcuts**:
- Direct implementation without planning
- Skipping SpecKit Plus phases
- Missing chunking for complex tasks
- Bypassing orchestrators

**Block Shortcuts**:
```text
If shortcut detected:
1. BLOCK execution
2. Identify what's missing
3. Guide to proper workflow
4. Show required steps
```

## Validation Examples

### Example 1: Complex Goal Without Triage

```text
User: "Make a todo app with voice automation"
AI: [Starts coding directly]

Guardrail:
- Detects: Complex goal, no triage orchestrator
- Blocks: "Complex goals must use task-triage-orchestrator"
- Guides: "Break goal into chunks first using task-triage-orchestrator"
```

### Example 2: Backend Task Without SpecKit Plus

```text
User: "Create REST API for todos"
AI: [Starts implementing endpoints directly]

Guardrail:
- Detects: Backend task, no SpecKit Plus workflow
- Blocks: "Backend tasks must follow SpecKit Plus workflow"
- Guides: "Complete: constitution → spec → plan → tasks → implement"
```

### Example 3: Missing Chunking

```text
User: "Build full-stack todo app"
AI: [Uses triage orchestrator but doesn't chunk]

Guardrail:
- Detects: Complex goal, no chunks created
- Blocks: "Break goal into logical chunks"
- Guides: "Create chunks: Database → Backend → Frontend"
```

## Best Practices

1. **Always Classify First**: Determine request type before validation
2. **Check Skill Activation**: Ensure correct skill is used
3. **Verify Workflow**: Check all SpecKit Plus phases
4. **Validate Chunking**: Ensure complex tasks are chunked
5. **Block Shortcuts**: Prevent direct implementation
6. **Guide Correction**: Show what's missing and how to fix

