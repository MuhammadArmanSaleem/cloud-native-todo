# Phase III: Todo AI Chatbot – Requirements Checklist

## Requirements

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1 | Conversational interface for all Basic Level features | ✅ Done | Chat page: list, create, update, complete, delete tasks via natural language |
| 2 | Use OpenAI Agents SDK for AI logic | ✅ Done | `openai-agents` in backend; `chat/agent.py` uses Agent, Runner, RunContextWrapper |
| 3 | Build MCP server with **Official MCP SDK** that exposes task operations as tools | ⚠️ Partial | **In-process** MCP-style tools in `mcp_tools/tools.py` (no separate MCP server; no `mcp` package) |
| 4 | Stateless chat endpoint that persists conversation state to database | ✅ Done | `POST /api/chat`; loads/saves `ChatThread` + `ChatMessage` in Neon PostgreSQL |
| 5 | AI agents use MCP tools; MCP tools stateless, state in database | ✅ Done | Agent uses task tools; tools use DB session + user_id; no in-memory state |

## Technology Stack

| Component | Spec | Implemented | Notes |
|-----------|------|-------------|-------|
| Frontend | OpenAI ChatKit | ⚠️ Custom chat UI | Next.js chat page at `/chat`; no `@openai/chatkit-react` |
| Backend | Python FastAPI | ✅ | `phase-2/backend` |
| AI Framework | OpenAI Agents SDK | ✅ | `openai-agents`; `chat/agent.py` |
| MCP Server | Official MCP SDK | ⚠️ In-process tools | Task tools in `mcp_tools/`; no standalone MCP server with `mcp` package |
| ORM | SQLModel | ✅ | `models.py`, chat persistence |
| Database | Neon Serverless PostgreSQL | ✅ | `DATABASE_URL` in `.env.local` |
| Authentication | Better Auth | ✅ | JWT + session; sign-in/sign-up/get-session |

## Summary

- **Fully met:** Requirements 1, 2, 4, 5; stack: FastAPI, OpenAI Agents SDK, SQLModel, Neon, Better Auth.
- **Different from spec:**
  - **Frontend:** Custom conversational UI instead of OpenAI ChatKit (same behaviour; can add ChatKit later).
  - **MCP:** In-process tools (agent calls Python functions) instead of a separate MCP server with Official MCP SDK. Tools are stateless and use the database.

## Optional Next Steps (to match spec 100%)

1. **OpenAI ChatKit:** Install `@openai/chatkit-react`, implement ChatKit backend protocol or adapter, and replace current chat page with ChatKit.
2. **Standalone MCP server:** Add a separate service using the Official MCP SDK (`mcp` package), expose task tools over Streamable HTTP, and point the agent at it via MCP client.
