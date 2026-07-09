from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_prefix="SHEEPPARTER_",
        extra="ignore",
    )

    env: Literal["local", "test", "staging", "production"] = "local"
    app_name: str = "SheepParter API"
    app_version: str = "0.1.0"
    log_level: str = Field(default="INFO", pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$")
    enable_docs: bool = True
    database_url: str = "sqlite+pysqlite:///./data/sheepparter.sqlite3"
    seed_demo_user: bool = False
    auth_cookie_name: str = "sheepparter_session"
    auth_cookie_secure: bool = False
    auth_session_ttl_minutes: int = 60 * 24 * 7
    cors_allowed_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
