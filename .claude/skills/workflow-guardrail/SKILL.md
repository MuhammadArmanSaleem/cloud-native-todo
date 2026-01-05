---
name: workflow-guardrail
description: |
  Validates and enforces proper workflow execution, ensures Context7 usage, and verifies skill compliance. Acts as a quality gate that prevents shortcuts and ensures all skills follow their documented workflows and use Context7 for latest documentation.
  Use this skill to intercept requests, validate proper process, and guide correct workflow execution before allowing implementation.
---

# Workflow Guardrail

Validates workflow execution, enforces proper skill usage, ensures Context7 integration, and prevents shortcuts.

## What This Skill Does

- **Intercepts requests** before execution to validate workflow
- **Enforces proper skill usage** (orchestrators for complex tasks, domain skills for implementation)
- **Validates SpecKit Plus workflow** (constitution → spec → plan → tasks → implement)
- **Ensures Context7 usage** (all skills must query Context7 for latest docs)
- **Validates skill behavior** (skills follow their documented workflows)
- **Blocks shortcuts** (prevents direct implementation without proper planning)
- **Guides correction** (redirects to proper workflow when violations detected)

## What This Skill Does NOT Do

- Implement code directly
- Execute tasks (validates before execution)
- Replace other skills (enforces their proper usage)

---

## Before Implementation

Gather context to ensure successful validation:

| Source | Gather |
|--------|--------|
| **User Request** | Goal description, complexity, scope |
| **Available Skills** | Skill inventory and their purposes |
| **Workflow State** | Current phase, completed steps |
| **Context7 Usage** | Whether Context7 has been queried |

Ensure all required context is gathered before validation.
Only proceed with execution if all guardrail checks pass.

---

## Guardrail Validation Process

### Phase 1: Request Analysis

1. **Parse User Request**
   - Extract goal description
   - Identify complexity (simple vs complex)
   - Determine scope (single component vs multi-part)

2. **Classify Request Type**
   - Complex multi-part goal → Requires `task-triage-orchestrator`
   - Frontend task → Requires `frontend-sdd-orchestrator` + SpecKit Plus
   - Backend task → Requires `backend-sdd-orchestrator` + SpecKit Plus
   - Database task → Requires `database-sdd-orchestrator` + SpecKit Plus
   - Simple task → Can use domain skill directly

### Phase 2: Workflow Validation

1. **Check Skill Activation**
   - Is correct skill being used?
   - Is orchestrator used for complex tasks?
   - Is domain skill used for implementation?

2. **Check SpecKit Plus Workflow**
   - Constitution checked/updated?
   - Specification created?
   - Plan generated?
   - Tasks broken down?
   - Implementation follows tasks?

3. **Check Chunking (for complex tasks)**
   - Is goal broken into chunks?
   - Are dependencies identified?
   - Is execution order determined?

### Phase 3: Context7 Validation

1. **Check Context7 Usage**
   - Has Context7 been queried?
   - Are latest patterns researched?
   - Are findings documented?

2. **Validate Per Skill**
   - Frontend → Context7 for Next.js docs?
   - Backend → Context7 for FastAPI docs?
   - Database → Context7 for PostgreSQL docs?
   - Orchestrators → Context7 for research?

### Phase 4: Skill Behavior Validation

1. **Check Skill Compliance**
   - Is skill following its documented workflow?
   - Are skill references being used?
   - Are edge cases being handled?
   - Is proper delegation happening?

2. **Validate Skill Patterns**
   - Frontend → Using component patterns, props, maps?
   - Backend → Using security, validation, RBAC?
   - Database → Using password security, migrations?

### Phase 5: Quality Gate

1. **Final Validation**
   - All required phases completed?
   - Context7 queries made?
   - Proper skill activation?
   - Workflow compliance verified?

2. **Approval or Block**
   - If all checks pass → Allow execution
   - If violations found → Block and guide correction

---

## Validation Rules

### Rule 1: Complex Goals Must Use Triage Orchestrator

```text
Request: "Build a todo app with voice automation"
Validation:
- Is this complex? → YES
- Is task-triage-orchestrator being used? → MUST BE YES
- If NO → BLOCK and guide to use triage orchestrator
```

### Rule 2: All Tasks Must Follow SpecKit Plus Workflow

```text
Request: "Create a REST API for todos"
Validation:
- Is backend-sdd-orchestrator used? → MUST BE YES
- Is SpecKit Plus workflow followed? → MUST BE YES
  - Constitution checked?
  - Spec created?
  - Plan generated?
  - Tasks broken down?
- If any missing → BLOCK and guide to complete workflow
```

### Rule 3: Context7 Must Be Used

```text
Request: "Build frontend with Next.js"
Validation:
- Is Context7 being queried? → MUST BE YES
- Are latest Next.js patterns researched? → MUST BE YES
- If NO → BLOCK and require Context7 usage
```

### Rule 4: Skills Must Follow Their Workflows

```text
Request: "Design database schema"
Validation:
- Is database-sdd-orchestrator used? → MUST BE YES
- Is SpecKit Plus workflow followed? → MUST BE YES
- Is Context7 queried for PostgreSQL? → MUST BE YES
- Are password security patterns used? → MUST BE YES
- If any missing → BLOCK and guide correction
```

### Rule 5: No Shortcuts Allowed

```text
Request: "Make a todo app"
Validation:
- Is direct implementation attempted? → MUST BE NO
- Is proper workflow followed? → MUST BE YES
- If shortcut detected → BLOCK and enforce proper process
```

---

## Enforcement Actions

### Action 1: Block and Guide

```text
Violation: Direct implementation without planning
Action:
1. BLOCK execution
2. Explain what's missing
3. Guide to proper workflow
4. Show required steps
```

### Action 2: Require Context7

```text
Violation: Context7 not being used
Action:
1. BLOCK execution
2. Require Context7 query
3. Show what to query
4. Wait for Context7 results
```

### Action 3: Enforce Skill Usage

```text
Violation: Wrong skill or missing orchestrator
Action:
1. BLOCK execution
2. Identify correct skill
3. Guide to proper skill activation
4. Show skill workflow
```

### Action 4: Complete Workflow

```text
Violation: Missing SpecKit Plus phases
Action:
1. BLOCK execution
2. List missing phases
3. Guide to complete workflow
4. Show phase requirements
```

---

## Validation Checklist

Before allowing execution, verify:

### Workflow Validation
- [ ] Correct skill activated
- [ ] SpecKit Plus workflow followed (if required)
- [ ] Chunks created (for complex tasks)
- [ ] Dependencies identified
- [ ] Execution order determined

### Context7 Validation
- [ ] Context7 queried for latest docs
- [ ] Patterns researched
- [ ] Findings documented
- [ ] Context7 used per skill requirements

### Skill Behavior Validation
- [ ] Skill follows documented workflow
- [ ] Skill references used
- [ ] Edge cases handled
- [ ] Proper delegation (if orchestrator)

### Quality Gate
- [ ] All required phases completed
- [ ] All validations passed
- [ ] No shortcuts detected
- [ ] Ready for execution

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/workflow-validation.md` | How to validate workflow compliance |
| `references/context7-validation.md` | How to validate Context7 usage |
| `references/skill-behavior-validation.md` | How to validate skill compliance |
| `references/enforcement-patterns.md` | How to block and guide corrections |
| `references/quality-gates.md` | Quality gate criteria and checks |

