# Implementation Plan: Phase III – Todo AI Chatbot (Basic Level)

**Branch**: `feat/phase3-todo-chatbot` | **Date**: 2025-02-08 | **Spec**: [spec.md](./spec.md)

## Summary

Implement an AI-powered chatbot for todo management using natural language. The backend remains stateless: a FastAPI chat endpoint persists conversation to the database and runs an OpenAI Agents SDK agent that calls an MCP server. The MCP server (Official MCP SDK) exposes task CRUD as tools and is stateless, storing all state in Neon PostgreSQL. The frontend uses OpenAI ChatKit and talks to the FastAPI chat API. Authentication stays Better Auth (JWT); all operations are user-scoped.

## Scope and Dependencies

**In scope**

- Conversational UI (OpenAI ChatKit) for list / create / update / complete / delete tasks.
- Stateless FastAPI chat endpoint: receive message, load thread history from DB, run agent with MCP tools, persist new messages, return assistant reply (streaming or non-streaming as needed by ChatKit).
- MCP server (Official MCP SDK): tools for list_tasks, create_task, get_task, update_task, delete_task, toggle_task_complete; stateless, user_id passed per request (e.g. via request context or header).
- OpenAI Agents SDK: one agent with instructions + MCP client pointing at the todo MCP server; agent runs in the FastAPI process or in-process call to MCP tool implementations that use the same DB.
- Persistence: ChatThread and ChatMessage tables (SQLModel); reuse existing User and Task models and Better Auth.

**Out of scope (Phase III Basic)**

- Voice, multi-agent handoffs, advanced guardrails, resource/prompt MCP primitives (only tools).

**External dependencies**

- OpenAI API (Agents SDK / Chat Completions).
- Neon PostgreSQL (existing).
- Better Auth / JWT (existing).

## Technical Context

| Item | Choice |
|------|--------|
| Language | Python 3.11+ (backend), TypeScript (frontend) |
| Backend | FastAPI (phase-2/backend) |
| Frontend | Next.js (phase-2/frontend), OpenAI ChatKit |
| AI | OpenAI Agents SDK (`openai-agents`) |
| MCP | Official MCP SDK (`mcp`), Streamable HTTP or in-process |
| ORM | SQLModel |
| DB | Neon Serverless PostgreSQL |
| Auth | Better Auth (JWT); `get_current_user` for chat and for MCP context |

**Constraints**

- Chat endpoint and MCP tools must be stateless; no in-memory session store.
- All task and chat data scoped by `user_id` from JWT.
- MCP server may run as same process (FastAPI) or separate process; if separate, auth/user_id must be passed (e.g. header or wrapper).

## Architecture

### High-level flow

1. User sends a message in ChatKit → POST to FastAPI `/api/chat` (or ChatKit-compatible route) with thread_id + message, Bearer token.
2. FastAPI validates JWT, loads thread + message history from DB (by user_id + thread_id).
3. FastAPI runs OpenAI Agents SDK agent with conversation history; agent has MCP tools (or in-process equivalents) that accept user_id and perform task CRUD via SQLModel/Neon.
4. Agent returns assistant reply; FastAPI appends user message and assistant message to DB, returns reply to frontend.
5. ChatKit renders the reply and updates thread.

### Option: MCP server topology

- **A – In-process (recommended for Phase III)**: “MCP” tools are plain Python functions registered with the agent (same process). They use the same DB session and `user_id` from the request. No separate MCP server process; minimal ops. Tool schemas can still follow MCP-style naming for consistency.
- **B – Separate MCP server**: Run Official MCP SDK server (e.g. Streamable HTTP). FastAPI chat endpoint uses OpenAI Agents SDK’s MCP client (e.g. `MCPServerStreamableHttp`) to call it. Auth: pass `user_id` (or a short-lived token) in a custom header or in first message; MCP server validates and uses it for DB operations.

Plan assumes **Option A** for simplicity; switch to B when you need a separate MCP process (e.g. multiple consumers).

### Data model (additions)

- **ChatThread**: id (PK), user_id (FK → users), title (optional), created_at, updated_at.
- **ChatMessage**: id (PK), thread_id (FK → ChatThread), role (user | assistant | system), content (text), created_at; optional: tool_calls_json, tool_results_json for debugging/audit.

Existing: **User**, **Task** unchanged; task tools filter by `user_id`.

### API contracts

**Chat**

- `POST /api/chat` (or ChatKit-specific route): body `{ "thread_id": "uuid | null", "message": "user message" }`. If thread_id null, create thread. Returns `{ "thread_id", "message": { "role": "assistant", "content": "..." } }` (or streaming if ChatKit expects it).
- Auth: Bearer JWT required; 401 if missing/invalid.
- Errors: 400 (bad request), 500 (agent/MCP error); return clear message for client.

**MCP tools (conceptual; same contract if separate server)**

- list_tasks(status?, priority?, search?, sort?, order?) → list of tasks
- create_task(title, description?, priority?, tags?, due_date?, …) → task
- get_task(task_id) → task
- update_task(task_id, title?, description?, completed?, …) → task
- delete_task(task_id) → success
- toggle_task_complete(task_id) → task

All take implicit or explicit `user_id` from auth context.

### Agent design

- One agent: “Todo assistant”. Instructions: you help the user manage tasks; use the provided tools to list, create, update, complete, delete; be concise and confirm actions; if ambiguous, ask which task or what title.
- Tools: the above MCP tools (in-process or via MCP client).
- Model: e.g. gpt-4o-mini or gpt-4o; configurable via env.
- No handoffs or multi-agent for Basic Level.

### Frontend (ChatKit)

- Add a chat page (e.g. `/chat`) with ChatKit component.
- `useChatKit` (or equivalent) points `api.url` to backend base URL and chat path (e.g. `http://localhost:8000/api/chat` or ChatKit route).
- Pass session token (Better Auth) in requests; backend uses it for auth and user_id.
- Optional: list threads, create new thread, switch thread (if ChatKit supports; else single thread per user).

## Project structure (additions)

```text
phase-2/
  backend/
    main.py                    # Add chat router, lifespan
    chat/
      __init__.py
      router.py                # POST /api/chat, load/save thread and messages
      agent.py                 # OpenAI Agents SDK agent + tool wiring (or MCP client)
      persistence.py           # ChatThread, ChatMessage load/save
    mcp_tools/                 # Option A: in-process “MCP” tools
      __init__.py
      tools.py                 # list_tasks, create_task, get_task, update_task, delete_task, toggle_task_complete (accept session/user_id)
    models.py                 # Add ChatThread, ChatMessage
  frontend/
    app/
      chat/
        page.tsx               # ChatKit page
    lib/
      chatkit.ts or api.ts    # ChatKit config, chat API base URL
```

If **Option B** (separate MCP server):

```text
phase-2/
  mcp_server/                 # Standalone MCP server (Official MCP SDK)
    server.py                 # FastMCP, tools that call DB with user from header/token
    ...
```

## Non-functional requirements

- **Security**: Chat and tools use only the authenticated user’s data; no cross-user access.
- **Secrets**: `OPENAI_API_KEY`, `BETTER_AUTH_SECRET`, `DATABASE_URL` from env; no hardcoding.
- **Observability**: Log chat requests (thread_id, user_id, no PII in content if sensitive); log tool calls for debugging.
- **Performance**: Chat response time dominated by LLM; keep DB round-trips for thread/messages minimal (e.g. one read, one write per request).

## Risks and mitigations

1. **ChatKit API shape**: ChatKit may expect a specific request/response or streaming format. **Mitigation**: Check ChatKit docs for self-hosted backend; implement adapter in FastAPI if needed.
2. **Token usage**: Long threads increase tokens. **Mitigation**: Cap history length (e.g. last N messages) or summarize older messages in a later phase.
3. **MCP vs in-process**: If you later split MCP to a separate service, auth and user_id passing must be designed in from the start. **Mitigation**: Keep tool interface and user_id context clear so Option B is a small refactor.

## Definition of done

- [ ] ChatThread and ChatMessage in DB; migrations if needed.
- [ ] MCP tools (in-process or server) implemented and scoped by user_id.
- [ ] OpenAI Agents SDK agent configured with tools and instructions.
- [ ] Stateless POST /api/chat (or ChatKit route) that loads/saves thread and messages and returns assistant reply.
- [ ] Frontend chat page with ChatKit wired to backend and Better Auth.
- [ ] All Basic Level operations (list, create, update, complete, delete) achievable via natural language in chat.
- [ ] Conversation persistence: thread and messages survive reload.

## ADR suggestion

Using OpenAI Agents SDK + MCP (in-process or separate) for todo chatbot, and stateless chat with DB-backed threads, is an architectural decision. If you adopt this plan, consider documenting with:  
`/sp.adr Phase III Todo Chatbot – Agents SDK and MCP architecture`.
