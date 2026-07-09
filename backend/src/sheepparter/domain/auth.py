from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True, slots=True)
class User:
    id: int
    email: str
    display_name: str
    password_hash: str
    is_active: bool


@dataclass(frozen=True, slots=True)
class AuthenticatedUser:
    id: int
    email: str
    display_name: str


@dataclass(frozen=True, slots=True)
class UserSession:
    id: int
    user_id: int
    token_hash: str
    expires_at: datetime
