# SpecKit Plus Workflow for Backend

Complete SpecKit Plus workflow orchestration for backend development.

## Workflow Phases

### Phase 1: Constitution (`sp.constitution`)

**Purpose**: Establish or update project principles

**Steps**:
1. Check if `.specify/memory/constitution.md` exists
2. If missing/incomplete, create/update constitution
3. Ensure backend-specific principles:
   - API design principles
   - Security standards
   - Database integration approach
   - Error handling standards
   - Testing approach

**Output**: Updated constitution.md

### Phase 2: Specification (`sp.specify`)

**Purpose**: Create feature specification from user goal

**Steps**:
1. Parse user goal into feature description
2. Run `.specify/scripts/powershell/create-new-feature.ps1`
3. Generate `specs/<feature-name>/spec.md` with:
   - API endpoints
   - Request/response models
   - Authentication requirements
   - Error handling
   - Edge cases section

**Edge Cases to Document**:
- Invalid input
- Authentication failures
- Authorization failures
- Database errors
- Rate limiting
- Validation failures

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
   - Phase 1: Data models, API contracts
   - Phase 2: Architecture decisions

**Context7 Queries**:
- Latest FastAPI patterns
- Security best practices
- Database integration patterns
- Performance optimization

**Output**: `specs/<feature-name>/plan.md`, `research.md`, `data-model.md`, `contracts/`

### Phase 4: Tasks (`sp.tasks`)

**Purpose**: Break plan into testable tasks

**Steps**:
1. Run `.specify/scripts/powershell/check-prerequisites.ps1`
2. Load plan.md and spec.md
3. Generate `specs/<feature-name>/tasks.md`:
   - Phase 1: Setup (FastAPI initialization)
   - Phase 2: Foundational (base models, dependencies)
   - Phase 3+: Endpoints in priority
   - Each task: testable, dependency-ordered

**Task Organization**:
- Setup → Foundational → Endpoints → Security → Polish

**Output**: `specs/<feature-name>/tasks.md`

### Phase 5: Implementation

**Purpose**: Execute tasks using fastapi-backend skill

**Steps**:
1. For each task in tasks.md:
   - Load task context
   - Use `fastapi-backend` skill patterns
   - Implement following FastAPI best practices
   - Handle edge cases

**Delegation to fastapi-backend**:
- Endpoint creation
- Request/response models
- Dependency injection
- Security implementation
- Error handling

**Output**: Implemented code

### Phase 6: Analysis (`sp.analyze`)

**Purpose**: Validate implementation

**Steps**:
1. Check consistency with spec
2. Verify all requirements met
3. Validate edge cases handled
4. Check FastAPI best practices

**Output**: Analysis report

