from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sheepparter.infrastructure.config import Settings, get_settings
from sheepparter.infrastructure.database.session import create_database
from sheepparter.infrastructure.demo_seed import seed_demo_user
from sheepparter.infrastructure.logging import configure_logging
from sheepparter.interfaces.http.api import register_routes


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or get_settings()
    configure_logging(resolved_settings.log_level)

    app = FastAPI(
        title=resolved_settings.app_name,
        version=resolved_settings.app_version,
        docs_url="/docs" if resolved_settings.enable_docs else None,
        redoc_url="/redoc" if resolved_settings.enable_docs else None,
    )
    app.state.settings = resolved_settings
    database = create_database(resolved_settings.database_url)
    if resolved_settings.env == "test":
        database.create_schema()
    if resolved_settings.seed_demo_user:
        with database.session_factory() as session:
            seed_demo_user(session)
    app.state.database = database
    app.add_middleware(
        CORSMiddleware,
        allow_origins=resolved_settings.cors_allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_routes(app)
    return app


app = create_app()
