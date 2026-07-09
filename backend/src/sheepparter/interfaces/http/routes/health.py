from fastapi import APIRouter, Request

from sheepparter.application.health import CheckHealth
from sheepparter.infrastructure.config import Settings
from sheepparter.interfaces.http.schemas import HealthResponse

router = APIRouter(tags=["health"])


def _health_use_case(request: Request) -> CheckHealth:
    settings: Settings = request.app.state.settings
    return CheckHealth(
        service_name=settings.app_name,
        service_version=settings.app_version,
    )


@router.get("/health", response_model=HealthResponse)
async def root_health(request: Request) -> HealthResponse:
    status = _health_use_case(request).execute()
    return HealthResponse.model_validate(status)


@router.get("/api/v1/health", response_model=HealthResponse)
async def api_health(request: Request) -> HealthResponse:
    status = _health_use_case(request).execute()
    return HealthResponse.model_validate(status)
