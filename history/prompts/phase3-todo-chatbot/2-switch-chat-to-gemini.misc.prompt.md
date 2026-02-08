---
id: 2
title: Switch chat agent to Gemini API
stage: misc
date: 2025-02-08
surface: agent
model: default
feature: phase3-todo-chatbot
branch: feat/phase2
user: user
command: (none)
labels: ["gemini", "chat", "backend", "env"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - phase-2/backend/chat/agent.py
  - phase-2/backend/mcp_tools/tools.py
  - phase-2/backend/pyproject.toml
  - phase-2/backend/requirements.txt
  - phase-2/backend/env.local.example
  - phase-2/backend/.env.local
tests:
  - (none)
---

## Prompt

AIzaSyCryxShsTXRMQxOxhr06YZMtSlAXqH0lLs

me open ai use nh kr rha gemini key use kr rha hon to code ka syntex gemini wala rakho or is key ko use krna jo di hai

## Response snapshot

- Replaced OpenAI / openai-agents with Google Gemini (google-genai). Backend chat agent now uses Gemini API with function calling: tool declarations for list_tasks, create_task, get_task, update_task, delete_task, toggle_task_complete; manual loop to run model, execute tool calls, and send results back until final text reply.
- Refactored mcp_tools/tools.py to take ChatContext as first argument (removed RunContextWrapper and @function_tool).
- Env: GEMINI_API_KEY in env.local.example and .env.local; user's key set in .env.local for local use. User should not commit .env.local.

## Outcome

- Impact: Chat now uses Gemini; OpenAI dependencies removed.
- Tests: (none run)
- Files: agent.py, tools.py, pyproject.toml, requirements.txt, env.local.example, .env.local
- Next: Run `uv sync` (or pip install -r requirements.txt) in backend, then start backend and test /api/chat.
- Reflection: Keep API keys only in .env.local and out of repo.

## Evaluation notes (flywheel)

- Failure modes observed: (none)
- Graders run and results: (none)
- Prompt variant: (none)
- Next experiment: (none)
