from dataclasses import dataclass
from pathlib import Path

from sqlalchemy import Engine, create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from sheepparter.infrastructure.database.models import Base


@dataclass(frozen=True, slots=True)
class Database:
    engine: Engine
    session_factory: sessionmaker[Session]

    def create_schema(self) -> None:
        Base.metadata.create_all(self.engine)


def create_database(database_url: str) -> Database:
    engine = create_engine_for_url(database_url)
    return Database(
        engine=engine,
        session_factory=sessionmaker(bind=engine, autoflush=False, expire_on_commit=False),
    )


def create_engine_for_url(database_url: str) -> Engine:
    url = make_url(database_url)
    connect_args: dict[str, object] = {}
    engine_kwargs: dict[str, object] = {}

    if url.get_backend_name() == "sqlite":
        connect_args["check_same_thread"] = False
        if url.database in (None, "", ":memory:"):
            engine_kwargs["poolclass"] = StaticPool
        elif url.database:
            Path(url.database).expanduser().parent.mkdir(parents=True, exist_ok=True)

    return create_engine(database_url, connect_args=connect_args, **engine_kwargs)
