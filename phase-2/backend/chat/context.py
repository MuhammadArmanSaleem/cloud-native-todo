"""Request context for chat agent and tools (user_id + DB session)."""
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from sqlmodel.ext.asyncio.session import AsyncSession


@dataclass
class ChatContext:
    """Context passed to Runner.run(); tools read user_id and session from this."""
    user_id: str
    session: "AsyncSession"
