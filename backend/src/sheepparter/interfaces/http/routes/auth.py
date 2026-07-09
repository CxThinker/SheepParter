from collections.abc import Iterator
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from sheepparter.application.auth import AuthenticationError, GetCurrentUser, LoginUser, LogoutUser
from sheepparter.application.security import PasswordHasher, SessionTokenService
from sheepparter.domain.auth import AuthenticatedUser
from sheepparter.infrastructure.auth_repository import SqlAlchemyAuthRepository
from sheepparter.infrastructure.config import Settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=1)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    email: str
    display_name: str = Field(serialization_alias="displayName")


class AuthResponse(BaseModel):
    user: UserResponse


def get_db_session(request: Request) -> Iterator[Session]:
    session_factory = request.app.state.database.session_factory
    with session_factory() as session:
        yield session


DbSession = Annotated[Session, Depends(get_db_session)]


@router.post("/login", response_model=AuthResponse)
async def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: DbSession,
) -> AuthResponse:
    settings: Settings = request.app.state.settings
    repository = SqlAlchemyAuthRepository(db)
    use_case = LoginUser(
        users=repository,
        sessions=repository,
        password_hasher=PasswordHasher(),
        token_service=SessionTokenService(),
        session_ttl=timedelta(minutes=settings.auth_session_ttl_minutes),
    )

    try:
        user, token = use_case.execute(email=payload.email, password=payload.password)
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        httponly=True,
        secure=settings.auth_cookie_secure or settings.env == "production",
        samesite="lax",
        max_age=settings.auth_session_ttl_minutes * 60,
        path="/",
    )
    return _auth_response(user)


@router.get("/me", response_model=AuthResponse)
async def me(request: Request, db: DbSession) -> AuthResponse:
    settings: Settings = request.app.state.settings
    repository = SqlAlchemyAuthRepository(db)
    use_case = GetCurrentUser(
        users=repository,
        sessions=repository,
        token_service=SessionTokenService(),
    )

    try:
        user = use_case.execute(request.cookies.get(settings.auth_cookie_name))
    except AuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    return _auth_response(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(request: Request, response: Response, db: DbSession) -> Response:
    settings: Settings = request.app.state.settings
    repository = SqlAlchemyAuthRepository(db)
    LogoutUser(sessions=repository, token_service=SessionTokenService()).execute(
        request.cookies.get(settings.auth_cookie_name)
    )
    response.delete_cookie(key=settings.auth_cookie_name, path="/", samesite="lax")
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


def _auth_response(user: AuthenticatedUser) -> AuthResponse:
    return AuthResponse(user=UserResponse.model_validate(user))
