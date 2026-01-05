# How to Use Claude Code Skills

## ✅ Skills Are Now Available

All skills have been copied to `.claude/skills/` in the project root. Claude Code should now be able to find and use them.

## 🔄 If Skills Still Not Found

If you still get "Unknown skill" error:

1. **Restart Claude Code** - Close and reopen Cursor/Claude Code
2. **Refresh the workspace** - Reload the window
3. **Verify location** - Skills should be in `.claude/skills/` at project root

## 📝 Correct Prompt Format

**DO NOT use `/skill-name` syntax** - That's for commands, not skills.

**DO use natural language with skill name**:

```
✅ CORRECT:
"Use the frontend-sdd-orchestrator skill to build the task list UI"

✅ CORRECT:
"Use the backend-sdd-orchestrator skill to implement the REST API"

✅ CORRECT:
"Use the task-triage-orchestrator skill to break down building Phase 2"
```

```
❌ WRONG:
/frontend-sdd-orchestrator

❌ WRONG:
@frontend-sdd-orchestrator
```

## 🎯 Example Prompts That Work

### For Frontend:
```
Use the frontend-sdd-orchestrator skill to implement the task management 
UI for Phase 2. Reference @specs/features/task-crud.md and follow SpecKit 
Plus workflow. Use Context7 for latest Next.js patterns.
```

### For Backend:
```
Use the backend-sdd-orchestrator skill to implement the FastAPI backend 
for Phase 2. Reference @specs/api/rest-endpoints.md and follow SpecKit 
Plus workflow. Use Context7 for latest FastAPI patterns.
```

### For Complete Phase 2:
```
Use the task-triage-orchestrator skill to build Phase 2 of the todo app:
- Full-stack web application
- Next.js frontend with Better Auth
- FastAPI backend with JWT
- Neon PostgreSQL database
- All Basic, Intermediate, and Advanced features

Break into chunks, research with Context7, and delegate to appropriate 
orchestrators following SpecKit Plus workflow.
```

## 🔍 Verify Skills Are Available

Check if skills are in the right place:

```bash
# Windows PowerShell
Get-ChildItem .claude\skills\ -Directory | Select-Object Name

# Should show:
# - frontend-sdd-orchestrator
# - backend-sdd-orchestrator
# - database-sdd-orchestrator
# - task-triage-orchestrator
# - workflow-guardrail
# - etc.
```

## 💡 How Skills Work

1. **You mention the skill** in your prompt
2. **Claude Code reads** the skill's `SKILL.md` file
3. **Skill activates** and follows its workflow
4. **Workflow guardrail** validates compliance
5. **Context7** is used automatically for latest docs

## 🚨 Troubleshooting

**Problem**: "Unknown skill: frontend-sdd-orchestrator"

**Solutions**:
1. Verify skills exist: Check `.claude/skills/frontend-sdd-orchestrator/SKILL.md` exists
2. Restart Claude Code
3. Use natural language, not `/skill-name` syntax
4. Explicitly say "Use the [skill-name] skill..."

**Problem**: Skill not activating automatically

**Solution**: Always explicitly mention the skill name in your prompt:
- "Use the frontend-sdd-orchestrator skill..."
- "Activate the backend-sdd-orchestrator skill..."
- "Follow the task-triage-orchestrator skill workflow..."

## 📚 More Help

- See `SKILL-ACTIVATION-PROMPTS.md` for detailed templates
- See `QUICK-START-PROMPTS.md` for copy-paste prompts
- See `CLAUDE.md` for skill documentation


