# Feature Specification: Phase III – Todo AI Chatbot (Basic Level)

**Feature Branch**: `feat/phase3-todo-chatbot`  
**Created**: 2025-02-08  
**Status**: Draft  
**Input**: Phase III requirements – AI-powered chatbot for managing todos via natural language using MCP and OpenAI Agents SDK.

## User Scenarios & Testing

### User Story 1 – Conversational task list (Priority: P1)

As an authenticated user, I can ask the chatbot in natural language to list my tasks (e.g. “Show my tasks”, “What’s pending?”) and see a clear summary in the chat.

**Why this priority**: Core value of the chatbot is task visibility via conversation.

**Independent Test**: Log in, open chat, send “Show my tasks”; response lists the user’s tasks (or “no tasks”) without errors.

**Acceptance Scenarios**:

1. **Given** I am authenticated and have tasks, **When** I say “Show my tasks”, **Then** the assistant responds with a list of my tasks (or a clear “no tasks” message).
2. **Given** I am authenticated, **When** I ask “What’s pending?” or “List incomplete tasks”, **Then** the assistant returns only non-completed tasks.
3. **Given** I am authenticated, **When** I ask for “completed tasks”, **Then** the assistant returns only completed tasks.

---

### User Story 2 – Create task via chat (Priority: P1)

As an authenticated user, I can create a task by describing it in natural language (e.g. “Add task: Buy milk”, “Create a high-priority task: Fix bug in login”).

**Why this priority**: Creating tasks via chat is a primary Basic Level capability.

**Independent Test**: Send “Add a task: Call mom tomorrow”; confirm a new task appears in the task list and in the chat response.

**Acceptance Scenarios**:

1. **Given** I am authenticated, **When** I say “Add task: Buy groceries”, **Then** a task with that title is created and the assistant confirms it.
2. **Given** I am authenticated, **When** I say “Create a high-priority task: Deploy by Friday”, **Then** a task is created with title and priority set appropriately.
3. **Given** I am authenticated, **When** I send an invalid or empty title, **Then** the assistant responds with a clear error or asks for a valid title.

---

### User Story 3 – Update and complete task via chat (Priority: P1)

As an authenticated user, I can mark a task complete or update it by referring to it in natural language (e.g. “Mark ‘Buy milk’ as done”, “Change the first task’s title to …”).

**Why this priority**: Completing and updating tasks completes Basic Level CRUD in chat.

**Independent Test**: Create a task, then say “Mark [that task] as done”; task is completed and chat confirms.

**Acceptance Scenarios**:

1. **Given** I have a task “Buy milk”, **When** I say “Mark Buy milk as done”, **Then** that task is marked completed and the assistant confirms.
2. **Given** I have a task, **When** I say “Complete task 1” or “Mark the first task complete”, **Then** the corresponding task is marked completed.
3. **Given** I have a task, **When** I ask to update its title or priority, **Then** the task is updated and the assistant confirms.

---

### User Story 4 – Delete task via chat (Priority: P2)

As an authenticated user, I can delete a task by describing it (e.g. “Delete the task Buy milk”, “Remove task 3”).

**Why this priority**: Full CRUD in chat; slightly lower than list/create/update.

**Independent Test**: Create a task, ask “Delete the task [title]”; task is removed and chat confirms.

**Acceptance Scenarios**:

1. **Given** I have a task “Old task”, **When** I say “Delete Old task”, **Then** that task is deleted and the assistant confirms.
2. **Given** I have tasks, **When** I say “Remove task with id 5”, **Then** that task is deleted if it exists and I get confirmation or a clear “not found” message.

---

### User Story 5 – Conversation persistence (Priority: P1)

As an authenticated user, my chat history for the todo assistant is stored so I can resume or review it later.

**Why this priority**: Stateless chat with persisted state is an explicit requirement.

**Independent Test**: Send a few messages, refresh or reopen chat; previous messages (and thread) are still visible.

**Acceptance Scenarios**:

1. **Given** I have sent messages in a thread, **When** I reload the page or reopen the chat, **Then** I see the same thread and message history.
2. **Given** I start a new thread, **When** I send messages, **Then** they are stored and associated with my user and thread.

---

### Edge Cases

- Unauthenticated user: chat endpoint returns 401; frontend redirects to login.
- Invalid or missing task id in natural language: assistant responds with a clear error or “task not found”.
- MCP server unavailable: backend returns a clear error; chat shows a user-friendly message.
- Empty or ambiguous user message: assistant asks for clarification (e.g. which task, or task title).
- Rate limits / timeouts: backend and UI handle timeouts and surface a retry or error message.

## Requirements

### Functional Requirements

- **FR-001**: System MUST expose a conversational interface for all Basic Level todo operations (list, create, get, update, delete, toggle complete).
- **FR-002**: System MUST use the OpenAI Agents SDK for AI logic (agent with tools).
- **FR-003**: System MUST provide an MCP server built with the Official MCP SDK that exposes task operations as tools (stateless; state in database).
- **FR-004**: System MUST provide a stateless chat endpoint that persists conversation state (threads, messages) to the database.
- **FR-005**: AI agents MUST use MCP tools to perform task operations; MCP tools MUST be stateless and read/write state via the database.
- **FR-006**: Chat and MCP MUST operate in the context of the authenticated user (Better Auth); all task operations MUST be scoped to that user.
- **FR-007**: Frontend MUST use OpenAI ChatKit for the conversational UI, wired to the backend chat endpoint.

### Key Entities

- **ChatThread**: Represents a conversation (user_id, optional title, created_at, updated_at).
- **ChatMessage**: A single message in a thread (thread_id, role: user | assistant | system, content, created_at; optional tool_calls / tool_results for persistence if needed).
- **Task**: Existing Phase II entity; MCP tools perform CRUD on tasks filtered by user_id.

## Technology Stack (Mandated)

| Component     | Technology            |
|-------------|------------------------|
| Frontend    | OpenAI ChatKit         |
| Backend     | Python FastAPI         |
| AI logic    | OpenAI Agents SDK      |
| MCP server  | Official MCP SDK       |
| ORM         | SQLModel               |
| Database    | Neon Serverless PostgreSQL |
| Authentication | Better Auth         |

## Success Criteria

- **SC-001**: User can list, create, update, complete, and delete tasks using only natural language in the chat.
- **SC-002**: Conversation history is persisted and restored per thread per user.
- **SC-003**: MCP server exposes task tools and is callable by the agent; tools are stateless and use the same database as the FastAPI app.
- **SC-004**: Chat endpoint is stateless (no in-memory session); each request is authenticated and loads/saves state via the database.
