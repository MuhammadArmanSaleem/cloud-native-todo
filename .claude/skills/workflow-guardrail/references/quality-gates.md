# Quality Gates

Final validation criteria before allowing execution.

## Quality Gate Framework

### Gate 1: Workflow Compliance

**Check**:
- [ ] Correct skill activated
- [ ] SpecKit Plus workflow followed (if required)
- [ ] Chunks created (for complex tasks)
- [ ] Dependencies identified
- [ ] Execution order determined

**Pass Criteria**: All workflow requirements met

### Gate 2: Context7 Usage

**Check**:
- [ ] Context7 queried for latest docs
- [ ] Queries are specific and relevant
- [ ] Findings documented
- [ ] Patterns researched
- [ ] Context7 used per skill requirements

**Pass Criteria**: Context7 used appropriately for all skills

### Gate 3: Skill Behavior

**Check**:
- [ ] Skill follows documented workflow
- [ ] Skill references used
- [ ] Edge cases handled
- [ ] Proper delegation (if orchestrator)
- [ ] Patterns applied correctly

**Pass Criteria**: Skill behavior matches documentation

### Gate 4: No Shortcuts

**Check**:
- [ ] No direct implementation without planning
- [ ] No skipping SpecKit Plus phases
- [ ] No missing chunking for complex tasks
- [ ] No bypassing orchestrators

**Pass Criteria**: No shortcuts detected

## Quality Gate Process

### Step 1: Pre-Execution Check

**Before ANY execution**:
```text
1. Classify request
2. Check skill activation
3. Verify workflow
4. Validate Context7
5. Check skill behavior
6. Detect shortcuts
```

### Step 2: Gate Evaluation

**For Each Gate**:
```text
- Evaluate all criteria
- Check pass/fail status
- Document violations
```

### Step 3: Decision

**If All Gates Pass**:
```text
✅ APPROVE: All quality gates passed
→ Allow execution to proceed
```

**If Any Gate Fails**:
```text
❌ BLOCK: Quality gate failed
→ Block execution
→ Show violations
→ Guide correction
```

## Quality Gate Examples

### Example 1: All Gates Pass

```text
Request: "Build frontend UI"
Workflow: ✅ frontend-sdd-orchestrator activated
SpecKit Plus: ✅ All phases complete
Context7: ✅ Next.js docs queried
Skill Behavior: ✅ References used, edge cases handled
Shortcuts: ✅ None detected

Result: ✅ APPROVED - All gates passed
```

### Example 2: Context7 Gate Fails

```text
Request: "Create REST API"
Workflow: ✅ backend-sdd-orchestrator activated
SpecKit Plus: ✅ All phases complete
Context7: ❌ Not queried
Skill Behavior: ✅ References used
Shortcuts: ✅ None detected

Result: ❌ BLOCKED - Context7 gate failed
Action: Require Context7 query before proceeding
```

### Example 3: Workflow Gate Fails

```text
Request: "Build todo app"
Workflow: ❌ No orchestrator, direct implementation
SpecKit Plus: ❌ Phases skipped
Context7: ❌ Not queried
Skill Behavior: ❌ Not following workflow
Shortcuts: ❌ Multiple shortcuts detected

Result: ❌ BLOCKED - Multiple gates failed
Action: Require complete workflow restart
```

## Quality Gate Checklist

### Pre-Execution Checklist

```text
Before allowing execution, verify:

Workflow Gate:
[ ] Correct skill activated
[ ] SpecKit Plus workflow complete
[ ] Chunks created (if complex)
[ ] Dependencies identified

Context7 Gate:
[ ] Context7 queried
[ ] Queries specific
[ ] Findings documented
[ ] Patterns researched

Skill Behavior Gate:
[ ] Workflow followed
[ ] References used
[ ] Edge cases handled
[ ] Proper delegation

Shortcut Gate:
[ ] No direct implementation
[ ] No skipped phases
[ ] No missing chunking
[ ] No bypassed orchestrators
```

## Best Practices

1. **Check All Gates**: Don't skip any gate
2. **Be Strict**: Fail fast on violations
3. **Document Violations**: Show what failed
4. **Guide Correction**: Help fix issues
5. **Maintain Quality**: Don't compromise standards

