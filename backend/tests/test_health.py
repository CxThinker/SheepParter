from fastapi.testclient import TestClient

from sheepparter.infrastructure.config import Settings
from sheepparter.main import create_app


def test_api_health_returns_ok() -> None:
    app = create_app(Settings())
    client = TestClient(app)

    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "service": "SheepParter API",
        "version": "0.1.0",
        "status": "ok",
    }
