# SpecKit Plus Workflow for Database

Complete SpecKit Plus workflow orchestration for database development.

## Workflow Phases

### Phase 1: Constitution (`sp.constitution`)

**Purpose**: Establish or update project principles

**Steps**:
1. Check if `.specify/memory/constitution.md` exists
2. If missing/incomplete, create/update constitution
3. Ensure database-specific principles:
   - Schema design principles
   - Security standards (password hashing)
   - Migration strategy
   - Performance standards
   - Data integrity standards

**Output**: Updated constitution.md

### Phase 2: Specification (`sp.specify`)

**Purpose**: Create feature specification from user goal

**Steps**:
1. Parse user goal into feature description
2. Run `.specify/scripts/powershell/create-new-feature.ps1`
3. Generate `specs/<feature-name>/spec.md` with:
   - Data entities
   - Relationships
   - Constraints
   - Security requirements
   - Edge cases section

**Edge Cases to Document**:
- Data integrity violations
- Migration edge cases
- Security edge cases
- Performance edge cases
- Concurrent access

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
   - Phase 1: Schema design, data models
   - Phase 2: Migration strategy

**Context7 Queries**:
- Latest PostgreSQL patterns
- Security best practices
- Schema design patterns
- Performance optimization

**Output**: `specs/<feature-name>/plan.md`, `research.md`, `data-model.md`

### Phase 4: Tasks (`sp.tasks`)

**Purpose**: Break plan into testable tasks

**Steps**:
1. Run `.specify/scripts/powershell/check-prerequisites.ps1`
2. Load plan.md and spec.md
3. Generate `specs/<feature-name>/tasks.md`:
   - Phase 1: Setup (database initialization)
   - Phase 2: Foundational (base tables, constraints)
   - Phase 3+: Schema features in priority
   - Each task: testable, dependency-ordered

**Task Organization**:
- Setup → Foundational → Schema Features → Security → Migrations → Polish

**Output**: `specs/<feature-name>/tasks.md`

### Phase 5: Implementation

**Purpose**: Execute tasks using postgresql-database skill

**Steps**:
1. For each task in tasks.md:
   - Load task context
   - Use `postgresql-database` skill patterns
   - Implement following PostgreSQL best practices
   - Handle edge cases

**Delegation to postgresql-database**:
- Schema creation
- Table design
- Constraints and indexes
- Security functions
- Migrations

**Output**: Implemented SQL/migrations

### Phase 6: Analysis (`sp.analyze`)

**Purpose**: Validate implementation

**Steps**:
1. Check consistency with spec
2. Verify all requirements met
3. Validate edge cases handled
4. Check PostgreSQL best practices

**Output**: Analysis report

