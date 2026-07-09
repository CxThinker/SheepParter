from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from sheepparter.domain.auth import User, UserSession
from sheepparter.infrastructure.database.models import SessionRecord, UserRecord


class SqlAlchemyAuthRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_email(self, email: str) -> User | None:
        record = self._session.scalar(select(UserRecord).where(UserRecord.email == email))
        return _user_from_record(record)

    def get_by_id(self, user_id: int) -> User | None:
        record = self._session.get(UserRecord, user_id)
        return _user_from_record(record)

    def create(self, user_id: int, token_hash: str, expires_at: datetime) -> UserSession:
        record = SessionRecord(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
        self._session.add(record)
        self._session.commit()
        self._session.refresh(record)
        return UserSession(
            id=record.id,
            user_id=record.user_id,
            token_hash=record.token_hash,
            expires_at=record.expires_at,
        )

    def get_by_token_hash(self, token_hash: str) -> UserSession | None:
        record = self._session.scalar(
            select(SessionRecord).where(SessionRecord.token_hash == token_hash)
        )
        return _session_from_record(record)

    def delete_by_token_hash(self, token_hash: str) -> None:
        record = self._session.scalar(
            select(SessionRecord).where(SessionRecord.token_hash == token_hash)
        )
        if record is None:
            return

        self._session.delete(record)
        self._session.commit()


def _user_from_record(record: UserRecord | None) -> User | None:
    if record is None:
        return None

    return User(
        id=record.id,
        email=record.email,
        display_name=record.display_name,
        password_hash=record.password_hash,
        is_active=record.is_active,
    )


def _session_from_record(record: SessionRecord | None) -> UserSession | None:
    if record is None:
        return None

    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)

    return UserSession(
        id=record.id,
        user_id=record.user_id,
        token_hash=record.token_hash,
        expires_at=expires_at,
    )
