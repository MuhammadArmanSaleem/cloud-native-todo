# Tasks: Phase III – Todo AI Chatbot (Basic Level)

**Input**: [spec.md](./spec.md), [plan.md](./plan.md)  
**Paths**: Backend and frontend under `phase-2/` as in plan.

**Organization**: Tasks grouped by phase and user story (US1–US5).

## Phase 1: Setup and data model

- [ ] **T001** Add SQLModel models `ChatThread` and `ChatMessage` in `phase-2/backend/models.py` (id, user_id, thread_id, role, content, created_at; FKs as in plan).
- [ ] **T002** Ensure DB migrations or `create_all` include new tables; verify in Neon.
- [ ] **T003** [P] Add backend deps: `openai-agents`, `mcp` (and `openai` if not already). Add to `phase-2/backend/pyproject.toml` or `requirements.txt`.

## Phase 2: MCP tools (in-process) and agent

- [ ] **T004** Implement in-process task tools in `phase-2/backend/mcp_tools/tools.py`: list_tasks, create_task, get_task, update_task, delete_task, toggle_task_complete; each accepts or receives `user_id` and uses existing Task model and DB session.
- [ ] **T005** Expose tools to OpenAI Agents SDK: register tool functions with the agent (or wrap for MCP-style names). Ensure agent receives `user_id` in context for every tool call.
- [ ] **T006** Implement `phase-2/backend/chat/agent.py`: create agent with instructions for todo assistant, attach task tools, use Runner (or equivalent) to run with message history; return final assistant reply (and optionally tool call details for logging).

## Phase 3: Chat endpoint and persistence

- [ ] **T007** Implement `phase-2/backend/chat/persistence.py`: create/get ChatThread by user_id and thread_id; append ChatMessage; load last N messages for a thread.
- [ ] **T008** Implement `phase-2/backend/chat/router.py`: POST handler that validates JWT (`get_current_user`), parses thread_id + message, creates thread if needed, loads messages, calls agent, appends user + assistant messages, returns assistant reply (and thread_id). Path: e.g. `POST /api/chat`.
- [ ] **T009** Mount chat router in `phase-2/backend/main.py`; ensure CORS and auth apply.

## Phase 4: User Story 1 – Conversational task list (P1)

- [ ] **T010** [US1] In agent instructions, emphasize listing tasks (all / pending / completed). Verify “Show my tasks” and “What’s pending?” use list_tasks and return readable summary.
- [ ] **T011** [US1] Add or extend test/script: authenticated request to chat with “Show my tasks”; response contains task list or “no tasks”.

## Phase 5: User Story 2 – Create task via chat (P1)

- [ ] **T012** [US2] Verify create_task tool is invoked for phrases like “Add task: …” and “Create a high-priority task: …”; agent confirms creation.
- [ ] **T013** [US2] Add or extend test: send “Add a task: Call mom tomorrow”; assert task exists in DB and chat response confirms.

## Phase 6: User Story 3 – Update and complete via chat (P1)

- [ ] **T014** [US3] Verify toggle_task_complete and update_task are used for “Mark … as done” and “Change task …”; agent confirms.
- [ ] **T015** [US3] Add or extend test: create task, send “Mark [title] as done”; assert task.completed and chat confirms.

## Phase 7: User Story 4 – Delete via chat (P2)

- [ ] **T016** [US4] Verify delete_task is used for “Delete …” / “Remove task …”; agent confirms or returns not found.
- [ ] **T017** [US4] Add or extend test: create task, send “Delete the task [title]”; assert task removed and chat confirms.

## Phase 8: User Story 5 – Conversation persistence (P1)

- [ ] **T018** [US5] Ensure chat endpoint loads messages by thread_id + user_id and appends new user and assistant messages; no in-memory state.
- [ ] **T019** [US5] Add or extend test: send 2 messages, then request with same thread_id; response context includes previous messages (or verify in DB).

## Phase 9: Frontend – ChatKit

- [ ] **T020** Install `@openai/chatkit-react` (or current ChatKit package) in `phase-2/frontend`.
- [ ] **T021** Add chat page at `phase-2/frontend/app/chat/page.tsx`: render ChatKit component; configure `api.url` to backend chat URL (e.g. `NEXT_PUBLIC_API_URL` + `/api/chat`); pass session token (Better Auth) in requests.
- [ ] **T022** Add navigation entry to chat page (e.g. in layout or nav bar).
- [ ] **T023** Verify end-to-end: login, open chat, send “Show my tasks”, see response; send “Add task: Test”, see confirmation; reload and see history.

## Phase 10: Error handling and polish

- [ ] **T024** Chat endpoint returns 401 when token missing/invalid; frontend redirects unauthenticated users to login.
- [ ] **T025** On agent or MCP error, return 500 with clear message; ChatKit shows user-friendly error (or retry).
- [ ] **T026** Document env vars: `OPENAI_API_KEY`, existing `DATABASE_URL`, `BETTER_AUTH_SECRET`; update `phase-2/backend/README.md` or ENV_SETUP.md.

---

**Checkpoint (MVP)**: After T011, T013, T015, T019, T023 – user can list, create, complete tasks via chat and conversation persists.

**Optional**: If using a separate MCP server (Option B), add tasks for MCP server process, auth header passing, and OpenAI Agents SDK MCP client configuration.
