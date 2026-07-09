from fastapi.testclient import TestClient

from sheepparter.infrastructure.config import Settings
from sheepparter.main import create_app


def test_login_sets_http_only_cookie_and_returns_user() -> None:
    app = create_app(
        Settings(
            env="test",
            database_url="sqlite+pysqlite:///:memory:",
            seed_demo_user=True,
        )
    )
    client = TestClient(app)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@sheepparter.test", "password": "LearnChinese123"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "user": {
            "id": 1,
            "email": "demo@sheepparter.test",
            "displayName": "Maya Chen",
        }
    }
    set_cookie = response.headers["set-cookie"]
    assert "sheepparter_session=" in set_cookie
    assert "HttpOnly" in set_cookie
    assert "SameSite=lax" in set_cookie


def test_login_rejects_invalid_password() -> None:
    app = create_app(
        Settings(
            env="test",
            database_url="sqlite+pysqlite:///:memory:",
            seed_demo_user=True,
        )
    )
    client = TestClient(app)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@sheepparter.test", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_me_requires_login() -> None:
    app = create_app(
        Settings(
            env="test",
            database_url="sqlite+pysqlite:///:memory:",
            seed_demo_user=True,
        )
    )
    client = TestClient(app)

    response = client.get("/api/v1/auth/me")

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"


def test_me_returns_current_user_after_login() -> None:
    app = create_app(
        Settings(
            env="test",
            database_url="sqlite+pysqlite:///:memory:",
            seed_demo_user=True,
        )
    )
    client = TestClient(app)

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@sheepparter.test", "password": "LearnChinese123"},
    )
    assert login_response.status_code == 200

    response = client.get("/api/v1/auth/me")

    assert response.status_code == 200
    assert response.json() == {
        "user": {
            "id": 1,
            "email": "demo@sheepparter.test",
            "displayName": "Maya Chen",
        }
    }


def test_logout_invalidates_session() -> None:
    app = create_app(
        Settings(
            env="test",
            database_url="sqlite+pysqlite:///:memory:",
            seed_demo_user=True,
        )
    )
    client = TestClient(app)

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@sheepparter.test", "password": "LearnChinese123"},
    )
    assert login_response.status_code == 200

    logout_response = client.post("/api/v1/auth/logout")
    me_response = client.get("/api/v1/auth/me")

    assert logout_response.status_code == 204
    assert me_response.status_code == 401
