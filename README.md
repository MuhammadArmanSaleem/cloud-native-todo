# Cloud Native Todo - Hackathon Project

This repository contains the complete "Evolution of Todo" hackathon project, organized by phases.

## Project Structure

```
cloud-native-todo/
├── phase-1/              # Phase I: In-Memory Python Console Todo App
│   ├── src/              # Source code
│   ├── specs/            # Specifications
│   ├── README.md         # Phase 1 documentation
│   └── ...               # Phase 1 configuration files
│
├── claude-code-skills-lab/  # Claude Code Skills
│   └── .claude/skills/   # All skills (orchestrators, domain skills)
│
├── CLAUDE.md            # Claude Code rules and guidelines
├── .cursor/rules/       # Cursor IDE rules
└── README.md           # This file
```

## Phase 1 Submission

**Location**: `phase-1/`

Phase 1 is a complete, self-contained in-memory Python console Todo application. All Phase 1 files are organized in the `phase-1/` directory for clean hackathon submission.

### Quick Start (Phase 1)

```bash
cd phase-1
python src/todo_app.py
```

See `phase-1/README.md` for complete setup instructions.

## Skills

This project includes custom Claude Code skills for:
- **Task Triage Orchestrator**: Breaks down complex goals into chunks
- **Frontend SDD Orchestrator**: Full frontend development workflow
- **Backend SDD Orchestrator**: Full backend development workflow
- **Database SDD Orchestrator**: Full database development workflow
- **Domain Skills**: Next.js, FastAPI, PostgreSQL implementations

See `CLAUDE.md` for detailed skill documentation.

## Development

This project uses Spec-Driven Development (SDD) with SpecKit Plus and Claude Code.

