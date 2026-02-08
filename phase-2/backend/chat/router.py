"""Stateless chat API: POST /api/chat with thread_id + message; persists to DB."""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from database import get_async_session
from sqlmodel.ext.asyncio.session import AsyncSession
from auth import get_current_user, TokenData

from chat.persistence import get_or_create_thread, get_messages_for_input, append_message
from chat.agent import run_turn

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatRequest(BaseModel):
    thread_id: Optional[str] = None
    message: str


class ChatResponse(BaseModel):
    thread_id: str
    message: dict  # {"role": "assistant", "content": "..."}


@router.post("", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    current_user: TokenData = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    """Stateless chat: load thread history from DB, run agent, persist new messages, return reply."""
    if not body.message or not body.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="message is required and must be non-empty",
        )
    thread = await get_or_create_thread(
        session, current_user.user_id, body.thread_id
    )
    history = await get_messages_for_input(session, thread.id)
    try:
        reply = await run_turn(
            current_user.user_id,
            session,
            body.message.strip(),
            history=history if history else None,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent error: {str(e)}",
        )
    await append_message(session, thread.id, "user", body.message.strip())
    await append_message(session, thread.id, "assistant", reply)
    return ChatResponse(
        thread_id=thread.id,
        message={"role": "assistant", "content": reply},
    )
