---
id: 1
title: Phase III Todo AI Chatbot spec plan tasks
stage: plan
date: 2025-02-08
surface: agent
model: default
feature: phase3-todo-chatbot
branch: feat/phase2
user: user
command: (none)
labels: ["phase3", "chatbot", "mcp", "openai-agents", "spec", "plan", "tasks"]
links:
  spec: specs/phase3-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/phase3-todo-chatbot/spec.md
  - specs/phase3-todo-chatbot/plan.md
  - specs/phase3-todo-chatbot/tasks.md
tests:
  - (none run; tasks.md defines acceptance and test tasks)
---

## Prompt

Phase III: Todo AI Chatbot
Basic Level Functionality
Objective: Create an AI-powered chatbot interface for managing todos through natural
language using MCP (Model Context Protocol) server architecture and using Claude Code
and Spec-Kit Plus.
Requirements
1. Implement conversational interface for all Basic Level features
2. Use OpenAI Agents SDK for AI logic
3. Build MCP server with Official MCP SDK that exposes task operations as tools
4. Stateless chat endpoint that persists conversation state to database
5. AI agents use MCP tools to manage tasks. The MCP tools will also be stateless and
will store state in the database.
Technology Stack
Component Technology
Frontend OpenAI ChatKit
Backend Python FastAPI
AI Framework OpenAI Agents SDK
MCP Server Official MCP SDK
ORM SQLModel
Database Neon Serverless PostgreSQL
Authentication Better Auth

## Response snapshot

- Created Phase III feature spec at specs/phase3-todo-chatbot/spec.md with user stories (conversational list/create/update/complete/delete, conversation persistence), FRs, and success criteria aligned to the required stack.
- Created architecture plan at specs/phase3-todo-chatbot/plan.md: stateless FastAPI chat endpoint, DB-backed ChatThread/ChatMessage, OpenAI Agents SDK agent with in-process MCP-style task tools (Option A), or separate MCP server (Option B); API and data model outlined.
- Created testable tasks at specs/phase3-todo-chatbot/tasks.md: phases for data model, MCP tools, agent, chat endpoint, US1–US5 implementation, ChatKit frontend, and error handling; MVP checkpoint and optional separate-MCP tasks.

## Outcome

- ✅ Impact: Full SpecKit Plus artifact set for Phase III (spec, plan, tasks) ready for implementation.
- 🧪 Tests: Tasks T011, T013, T015, T017, T019, T023 define acceptance and E2E checks.
- 📁 Files: spec.md, plan.md, tasks.md under specs/phase3-todo-chatbot/.
- 🔁 Next prompts: Run implementation per tasks (backend chat + MCP tools first, then frontend ChatKit); optionally document ADR via /sp.adr.
- 🧠 Reflection: Plan recommends in-process tools (Option A) for simplicity; ADR suggested for Agents SDK + MCP architecture.

## Evaluation notes (flywheel)

- Failure modes observed: (none)
- Graders run and results (PASS/FAIL): (none)
- Prompt variant (if applicable): (none)
- Next experiment (smallest change to try): Implement T001–T009 then T020–T023 for MVP.
