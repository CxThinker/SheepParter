from sqlalchemy import select
from sqlalchemy.orm import Session

from sheepparter.application.security import PasswordHasher
from sheepparter.infrastructure.config import get_settings
from sheepparter.infrastructure.database.models import UserRecord
from sheepparter.infrastructure.database.session import create_database

DEMO_EMAIL = "demo@sheepparter.test"
DEMO_PASSWORD = "LearnChinese123"
DEMO_DISPLAY_NAME = "Maya Chen"


def seed_demo_user(session: Session) -> None:
    existing = session.scalar(select(UserRecord).where(UserRecord.email == DEMO_EMAIL))
    if existing is not None:
        return

    session.add(
        UserRecord(
            email=DEMO_EMAIL,
            display_name=DEMO_DISPLAY_NAME,
            password_hash=PasswordHasher().hash_password(DEMO_PASSWORD),
            is_active=True,
        )
    )
    session.commit()


def main() -> None:
    database = create_database(get_settings().database_url)
    with database.session_factory() as session:
        seed_demo_user(session)
    print(f"Seeded demo user: {DEMO_EMAIL}")


if __name__ == "__main__":
    main()
