"""Todo chat agent using OpenRouter (OpenAI-compatible) and in-process task tools."""
import json
import os
from typing import List, Optional, Any

from openai import AsyncOpenAI

from chat.context import ChatContext
from mcp_tools.tools import (
    list_tasks,
    create_task,
    get_task,
    update_task,
    delete_task,
    toggle_task_complete,
)

OPENROUTER_BASE = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo")

TODO_SYSTEM = """You are a helpful todo assistant. You help the user manage their tasks using the tools provided.
- Use list_tasks to show tasks (status_filter: 'all'|'pending'|'completed', optional priority, search, sort).
- Use create_task to add a task (title required; optional description, priority).
- Use get_task to fetch one task by id.
- Use update_task to change a task's title, description, completed, or priority.
- Use delete_task to remove a task by id.
- Use toggle_task_complete to mark a task done or pending by id.
Be concise. Confirm actions (e.g. "Created task ...", "Marked task 3 as completed."). If the user's intent is unclear or a task is not found, say so briefly."""

# OpenAI-style tool definitions (OpenRouter supports same format)
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List the user's tasks. status_filter: all|pending|completed. priority: high|medium|low. sort: created_at|due_date|priority|title. order: asc|desc.",
            "parameters": {
                "type": "object",
                "properties": {
                    "status_filter": {"type": "string", "description": "Filter by status: all, pending, or completed"},
                    "priority": {"type": "string", "description": "Filter by priority: high, medium, low"},
                    "search": {"type": "string", "description": "Search in title/description"},
                    "sort": {"type": "string", "description": "Sort by: created_at, due_date, priority, title"},
                    "order": {"type": "string", "description": "Order: asc or desc", "enum": ["asc", "desc"]},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "create_task",
            "description": "Create a new task. title is required (1-200 chars). priority: high, medium, or low.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Task title (required, 1-200 chars)"},
                    "description": {"type": "string", "description": "Optional description"},
                    "priority": {"type": "string", "description": "high, medium, or low"},
                    "completed": {"type": "boolean", "description": "Whether task is completed", "default": False},
                },
                "required": ["title"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_task",
            "description": "Get a single task by id.",
            "parameters": {
                "type": "object",
                "properties": {"task_id": {"type": "integer", "description": "Task id"}},
                "required": ["task_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update a task by id. Pass only the fields you want to change.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer", "description": "Task id"},
                    "title": {"type": "string", "description": "New title"},
                    "description": {"type": "string", "description": "New description"},
                    "completed": {"type": "boolean", "description": "Completed flag"},
                    "priority": {"type": "string", "description": "high, medium, or low"},
                },
                "required": ["task_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task by id.",
            "parameters": {
                "type": "object",
                "properties": {"task_id": {"type": "integer", "description": "Task id"}},
                "required": ["task_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "toggle_task_complete",
            "description": "Toggle a task's completed status (mark done or pending) by id.",
            "parameters": {
                "type": "object",
                "properties": {"task_id": {"type": "integer", "description": "Task id"}},
                "required": ["task_id"],
            },
        },
    },
]

TOOL_EXECUTORS = {
    "list_tasks": list_tasks,
    "create_task": create_task,
    "get_task": get_task,
    "update_task": update_task,
    "delete_task": delete_task,
    "toggle_task_complete": toggle_task_complete,
}


def _history_to_messages(history: List[dict], user_message: str) -> List[dict]:
    """Build OpenAI-style messages from history + latest user message."""
    messages = [{"role": "system", "content": TODO_SYSTEM}]
    for m in history:
        messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": user_message})
    return messages


def _coerce_args(name: str, args: dict) -> dict:
    """Coerce API args (often strings) to expected types."""
    out = dict(args)
    if "task_id" in out and out["task_id"] is not None:
        try:
            out["task_id"] = int(out["task_id"])
        except (TypeError, ValueError):
            pass
    if name == "create_task" and "completed" in out:
        if isinstance(out["completed"], str):
            out["completed"] = out["completed"].lower() in ("true", "1", "yes")
    if name == "update_task" and "completed" in out:
        if isinstance(out["completed"], str):
            out["completed"] = out["completed"].lower() in ("true", "1", "yes")
    return out


async def run_turn(
    user_id: str,
    session: Any,
    user_message: str,
    history: Optional[List[dict]] = None,
) -> str:
    """
    Run one chat turn. history is list of {"role": "user"|"assistant", "content": "..."}.
    Returns assistant reply text.
    """
    api_key = (os.getenv("OPENROUTER_API_KEY") or "").strip()
    if not api_key:
        return "Error: OPENROUTER_API_KEY is not set. Please set it in .env.local."

    client = AsyncOpenAI(api_key=api_key, base_url=OPENROUTER_BASE)
    ctx = ChatContext(user_id=user_id, session=session)
    messages = _history_to_messages(history or [], user_message)

    max_rounds = 10
    for _ in range(max_rounds):
        try:
            response = await client.chat.completions.create(
                model=OPENROUTER_MODEL,
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
            )
        except Exception as e:
            err = str(e).lower()
            if "401" in err or "invalid" in err or "api key" in err or "unauthorized" in err:
                return (
                    "OpenRouter API key invalid. Set OPENROUTER_API_KEY in .env.local (get key from https://openrouter.ai/keys)."
                )
            raise
        choice = response.choices[0] if response.choices else None
        if not choice or not choice.message:
            return "I couldn't generate a response."

        msg = choice.message
        tool_calls = getattr(msg, "tool_calls", None) or []
        if not tool_calls:
            return (msg.content or "").strip() or "I couldn't generate a response."

        # Append assistant message in API format (id, type, function.name/arguments)
        assistant_msg = {"role": "assistant", "content": msg.content or ""}
        assistant_msg["tool_calls"] = [
            {
                "id": getattr(tc, "id", ""),
                "type": "function",
                "function": {
                    "name": getattr(tc.function, "name", "") if hasattr(tc, "function") else "",
                    "arguments": getattr(tc.function, "arguments", "{}") if hasattr(tc, "function") else "{}",
                },
            }
            for tc in tool_calls
        ]
        messages.append(assistant_msg)

        for tc in tool_calls:
            fn = getattr(tc, "function", None)
            name = getattr(fn, "name", "") if fn else ""
            try:
                args = json.loads(getattr(fn, "arguments", "{}") or "{}")
            except Exception:
                args = {}
            args = _coerce_args(name, args)
            tid = getattr(tc, "id", "") or ""
            if name not in TOOL_EXECUTORS:
                result = f"Error: unknown tool {name}"
            else:
                try:
                    result = await TOOL_EXECUTORS[name](ctx, **args)
                except Exception as e:
                    result = f"Error: {e!s}"
            messages.append({"role": "tool", "tool_call_id": tid, "content": result})

    return "I hit the turn limit. Please try a shorter request."
