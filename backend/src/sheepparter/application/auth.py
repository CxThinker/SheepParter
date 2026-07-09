from datetime import UTC, datetime, timedelta
from typing import Protocol

from sheepparter.application.security import PasswordHasher, SessionTokenService
from sheepparter.domain.auth import AuthenticatedUser, User, UserSession


class AuthenticationError(Exception):
    pass


class UserRepository(Protocol):
    def get_by_email(self, email: str) -> User | None: ...

    def get_by_id(self, user_id: int) -> User | None: ...


class SessionRepository(Protocol):
    def create(self, user_id: int, token_hash: str, expires_at: datetime) -> UserSession: ...

    def get_by_token_hash(self, token_hash: str) -> UserSession | None: ...

    def delete_by_token_hash(self, token_hash: str) -> None: ...


class LoginUser:
    def __init__(
        self,
        users: UserRepository,
        sessions: SessionRepository,
        password_hasher: PasswordHasher,
        token_service: SessionTokenService,
        session_ttl: timedelta,
    ) -> None:
        self._users = users
        self._sessions = sessions
        self._password_hasher = password_hasher
        self._token_service = token_service
        self._session_ttl = session_ttl

    def execute(self, email: str, password: str) -> tuple[AuthenticatedUser, str]:
        normalized_email = email.strip().lower()
        user = self._users.get_by_email(normalized_email)

        if user is None or not user.is_active:
            raise AuthenticationError("Invalid email or password")

        if not self._password_hasher.verify(password, user.password_hash):
            raise AuthenticationError("Invalid email or password")

        token = self._token_service.generate_token()
        token_hash = self._token_service.hash_token(token)
        self._sessions.create(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.now(UTC) + self._session_ttl,
        )
        return _public_user(user), token


class GetCurrentUser:
    def __init__(
        self,
        users: UserRepository,
        sessions: SessionRepository,
        token_service: SessionTokenService,
    ) -> None:
        self._users = users
        self._sessions = sessions
        self._token_service = token_service

    def execute(self, token: str | None) -> AuthenticatedUser:
        if not token:
            raise AuthenticationError("Authentication required")

        token_hash = self._token_service.hash_token(token)
        session = self._sessions.get_by_token_hash(token_hash)
        if session is None or session.expires_at <= datetime.now(UTC):
            raise AuthenticationError("Authentication required")

        user = self._users.get_by_id(session.user_id)
        if user is None or not user.is_active:
            raise AuthenticationError("Authentication required")

        return _public_user(user)


class LogoutUser:
    def __init__(self, sessions: SessionRepository, token_service: SessionTokenService) -> None:
        self._sessions = sessions
        self._token_service = token_service

    def execute(self, token: str | None) -> None:
        if not token:
            return

        self._sessions.delete_by_token_hash(self._token_service.hash_token(token))


def _public_user(user: User) -> AuthenticatedUser:
    return AuthenticatedUser(id=user.id, email=user.email, display_name=user.display_name)
