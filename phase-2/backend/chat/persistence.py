"""Chat thread and message persistence (stateless, DB-backed)."""
from typing import List, Optional, Tuple
from uuid import uuid4

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from models import ChatThread, ChatMessage

MAX_HISTORY_MESSAGES = 50


async def get_or_create_thread(
    session: AsyncSession, user_id: str, thread_id: Optional[str] = None
) -> ChatThread:
    """Get existing thread by id (and user_id) or create a new one."""
    if thread_id:
        statement = select(ChatThread).where(
            ChatThread.id == thread_id,
            ChatThread.user_id == user_id,
        )
        result = await session.execute(statement)
        thread = result.scalar_one_or_none()
        if thread:
            return thread
    thread = ChatThread(id=str(uuid4()), user_id=user_id)
    session.add(thread)
    await session.commit()
    await session.refresh(thread)
    return thread


async def get_messages_for_input(
    session: AsyncSession, thread_id: str, limit: int = MAX_HISTORY_MESSAGES
) -> List[dict]:
    """Load last N messages and return as OpenAI-style input list (role + content)."""
    statement = (
        select(ChatMessage)
        .where(ChatMessage.thread_id == thread_id)
        .order_by(ChatMessage.created_at.asc())
    )
    result = await session.execute(statement)
    messages = result.scalars().all()
    # Keep last N
    messages = messages[-limit:] if len(messages) > limit else messages
    return [{"role": m.role, "content": m.content} for m in messages]


async def append_message(
    session: AsyncSession, thread_id: str, role: str, content: str
) -> ChatMessage:
    """Append a message to the thread."""
    msg = ChatMessage(thread_id=thread_id, role=role, content=content)
    session.add(msg)
    await session.commit()
    await session.refresh(msg)
    return msg
