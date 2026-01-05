# SpecKit Plus Workflow for Frontend

Complete SpecKit Plus workflow orchestration for frontend development.

## Workflow Phases

### Phase 1: Constitution (`sp.constitution`)

**Purpose**: Establish or update project principles

**Steps**:
1. Check if `.specify/memory/constitution.md` exists
2. If missing/incomplete, create/update constitution
3. Ensure frontend-specific principles:
   - Component architecture principles
   - Styling approach (Tailwind, CSS Modules)
   - TypeScript usage
   - Testing approach
   - Accessibility standards

**Output**: Updated constitution.md

### Phase 2: Specification (`sp.specify`)

**Purpose**: Create feature specification from user goal

**Steps**:
1. Parse user goal into feature description
2. Run `.specify/scripts/powershell/create-new-feature.ps1`
3. Generate `specs/<feature-name>/spec.md` with:
   - User scenarios
   - Functional requirements
   - Success criteria
   - Key entities (if data involved)
   - Edge cases section

**Edge Cases to Document**:
- Empty states
- Loading states
- Error states
- Validation failures
- Network issues
- Browser compatibility

**Output**: `specs/<feature-name>/spec.md`

### Phase 3: Planning (`sp.plan`)

**Purpose**: Create implementation plan

**Steps**:
1. Run `.specify/scripts/powershell/setup-plan.ps1`
2. Load spec.md and constitution.md
3. Generate `specs/<feature-name>/plan.md`:
   - Technical context
   - Constitution check
   - Phase 0: Research (use Context7)
   - Phase 1: Component structure, data models
   - Phase 2: Architecture decisions

**Context7 Queries**:
- Latest Next.js patterns
- Component architecture
- Data fetching strategies
- Performance optimization

**Output**: `specs/<feature-name>/plan.md`, `research.md`, `data-model.md`, `contracts/`

### Phase 4: Tasks (`sp.tasks`)

**Purpose**: Break plan into testable tasks

**Steps**:
1. Run `.specify/scripts/powershell/check-prerequisites.ps1`
2. Load plan.md and spec.md
3. Generate `specs/<feature-name>/tasks.md`:
   - Phase 1: Setup (Next.js initialization)
   - Phase 2: Foundational (base components)
   - Phase 3+: User stories in priority
   - Each task: testable, dependency-ordered

**Task Organization**:
- Setup → Foundational → User Stories → Polish
- Within each story: Tests → Models → Components → Integration

**Output**: `specs/<feature-name>/tasks.md`

### Phase 5: Implementation

**Purpose**: Execute tasks using nextjs-frontend skill

**Steps**:
1. For each task in tasks.md:
   - Load task context
   - Use `nextjs-frontend` skill patterns
   - Implement following Next.js best practices
   - Handle edge cases

**Delegation to nextjs-frontend**:
- Component creation
- Props and maps patterns
- Data handling
- Styling (minimalist techy design)
- TypeScript patterns

**Output**: Implemented code

### Phase 6: Analysis (`sp.analyze`)

**Purpose**: Validate implementation

**Steps**:
1. Check consistency with spec
2. Verify all requirements met
3. Validate edge cases handled
4. Check Next.js best practices

**Output**: Analysis report

## Automation Scripts

### Script Execution Order

```powershell
# 1. Create feature
.specify/scripts/powershell/create-new-feature.ps1 -Json "$featureDescription"

# 2. Setup plan
.specify/scripts/powershell/setup-plan.ps1 -Json

# 3. Check prerequisites
.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks

# 4. Update agent context
.specify/scripts/powershell/update-agent-context.ps1 -AgentType cursor-agent
```

## Workflow Integration

### Orchestration Pattern

```text
User Goal → Parse → Constitution Check → Spec → Plan → Tasks → Implement → Analyze
```

Each phase:
1. Runs appropriate SpecKit Plus command/script
2. Handles edge cases
3. Uses Context7 when needed
4. Delegates to domain skill for implementation

