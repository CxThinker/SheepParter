# SheepParter Backend

Python API using FastAPI with Clean Architecture（整洁架构） boundaries.

## Development

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
alembic upgrade head
python -m sheepparter.infrastructure.demo_seed
uvicorn sheepparter.main:app --reload
```

If `python` is not available on Windows, use `py -3.12` for the Python commands.

## Layout

```text
src/sheepparter/
  domain/          Business rules
  application/     Use cases
  infrastructure/  Settings, logging, persistence adapters
  interfaces/      HTTP/API adapters
tests/             Backend tests
```

## Database

The default database is SQLite at `data/sheepparter.sqlite3`.

The connection is configured through `SHEEPPARTER_DATABASE_URL`, so a later move to PostgreSQL or another SQL database should primarily replace the database URL and engine configuration in the infrastructure layer.

## Health check

```powershell
Invoke-RestMethod http://localhost:8000/api/v1/health
```

## Demo login

```powershell
Invoke-RestMethod http://localhost:8000/api/v1/auth/login `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"demo@sheepparter.test","password":"LearnChinese123"}'
```
