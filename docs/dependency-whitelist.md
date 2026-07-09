# Dependency Whitelist

本文件记录当前项目允许使用的 direct dependencies（直接依赖）。新增依赖前必须先查阅本文件；白名单外依赖必须先向用户说明来源、用途、官方链接和风险，并征询是否下载、是否加入白名单。

## 规则

- 只列 direct dependencies（直接依赖）；transitive dependencies（传递依赖）由锁文件和包管理器解析。
- 依赖锁文件不得手动修改。前端 `package-lock.json` 必须通过 npm 工具重新生成。
- 版本范围以实际 manifest（清单文件）为准：Python 查看 `backend/pyproject.toml`，前端查看各 `package.json`。
- 内部 workspace package（工作区包）如 `@sheepparter/ui`、`@sheepparter/api-client` 属于仓库内部代码，不按第三方依赖审批。

## Python

| Package | Scope | Allowed Range | Source |
| --- | --- | --- | --- |
| `hatchling` | build | `>=1.24,<2` | [Hatch build system](https://hatch.pypa.io/latest/build/) |
| `fastapi` | runtime | `>=0.111,<1` | [FastAPI](https://fastapi.tiangolo.com/) |
| `pydantic-settings` | runtime | `>=2.4,<3` | [pydantic-settings](https://github.com/pydantic/pydantic-settings) |
| `SQLAlchemy` | runtime | `>=2.0,<3` | [SQLAlchemy](https://www.sqlalchemy.org/) |
| `uvicorn[standard]` | runtime | `>=0.30,<1` | [Uvicorn](https://www.uvicorn.org/) |
| `alembic` | dev/migration | `>=1.18,<2` | [Alembic](https://alembic.sqlalchemy.org/) |
| `httpx2` | dev/test | `>=2.0,<3` | [httpx2](https://github.com/pydantic/httpx2) |
| `mypy` | dev | `>=1.10,<2` | [mypy](https://www.mypy-lang.org/) |
| `pytest` | dev/test | `>=8,<9` | [pytest](https://docs.pytest.org/) |
| `pytest-asyncio` | dev/test | `>=0.23,<1` | [pytest-asyncio](https://github.com/pytest-dev/pytest-asyncio) |
| `ruff` | dev | `>=0.5,<1` | [Ruff](https://docs.astral.sh/ruff/) |

## JavaScript / TypeScript

| Package | Scope | Allowed Range | Source |
| --- | --- | --- | --- |
| `react` | runtime | `^19.2.7` | [React](https://react.dev/) |
| `react-dom` | runtime | `^19.2.7` | [React DOM](https://react.dev/) |
| `@eslint/js` | dev | `^10.0.1` | [ESLint](https://eslint.org/) |
| `@types/react` | dev | `^19.2.17` | [DefinitelyTyped React types](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) |
| `@types/react-dom` | dev | `^19.2.3` | [DefinitelyTyped React DOM types](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom) |
| `@vitejs/plugin-react` | dev | `^6.0.3` | [Vite React plugin](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) |
| `eslint` | dev | `^10.6.0` | [ESLint](https://eslint.org/) |
| `globals` | dev | `^17.7.0` | [globals](https://github.com/sindresorhus/globals) |
| `typescript` | dev | `^5.9.3` | [TypeScript](https://www.typescriptlang.org/) |
| `typescript-eslint` | dev | `^8.63.0` | [typescript-eslint](https://typescript-eslint.io/) |
| `vite` | dev | `^8.1.4` | [Vite](https://vite.dev/) |
