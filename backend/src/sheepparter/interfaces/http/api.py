from fastapi import FastAPI

from sheepparter.interfaces.http.routes.auth import router as auth_router
from sheepparter.interfaces.http.routes.health import router as health_router


def register_routes(app: FastAPI) -> None:
    app.include_router(auth_router)
    app.include_router(health_router)
