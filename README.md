# SheepParter

此项目是一个基于英文学习中文的游戏化的 demo 项目。

SheepParter 是一个后端 Python + 前端 React 的全栈项目脚手架。当前仓库已包含后端、用户 Web 端、管理员 Web 端、项目协作说明与本地 Git（版本控制）基础文件。

## 目录

```text
backend/        Python API, Clean Architecture（整洁架构）
frontend/       React monorepo（单体多包仓库）
  apps/
    user-web/   用户 Web 端
    admin-web/  管理员 Web 端
  packages/
    ui/         共享 UI 组件
    api-client/共享 API client（接口客户端）
docs/           架构文档与 ADR（架构决策记录）
scripts/        本地辅助脚本
skills/         用户提供的 design/output skills（设计与输出规范素材）
```

## 后端启动

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
uvicorn sheepparter.main:app --reload
```

如果当前 Windows 环境没有可用的 `python` 命令，可改用 `py -3.12`。

默认 API：

- `GET /health`
- `GET /api/v1/health`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

初始化本地 SQLite database（数据库）和 demo user（演示用户）：

```powershell
cd backend
.\.venv\Scripts\alembic upgrade head
.\.venv\Scripts\python -m sheepparter.infrastructure.demo_seed
```

Demo 登录凭据：

- Email：`demo@sheepparter.test`
- Password：`LearnChinese123`

## 前端启动

```powershell
cd frontend
npm install
npm run dev:user
npm run dev:admin
```

默认端口：

- 用户端：`http://localhost:5173`
- 管理员端：`http://localhost:5174`

当前登录模块仅接入用户端，管理员端暂不接入。

## 本地检查

```powershell
.\scripts\check.ps1
```

如果尚未安装前端依赖，脚本会跳过 TypeScript（类型脚本）检查并给出提示。

## Git

本仓库可以使用本地 Git，但远端 remote（远程仓库）尚未配置。请等用户明确指令后再添加远端地址。
