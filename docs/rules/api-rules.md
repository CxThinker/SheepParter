# API Rules

本文档整理 SheepParter 的 API（应用程序接口）与 API design（接口设计）规则。依据来自 `AGENTS.md`、`docs/architecture.md`、`backend/pyproject.toml`、`backend/README.md`、现有 FastAPI（快速 API 框架）路由与 `frontend/packages/api-client`。

## Architecture Boundary

后端遵守 Clean Architecture（整洁架构），依赖方向必须保持单向：

- `domain`：业务实体、值对象、业务规则；不依赖 FastAPI、database（数据库）或第三方 SDK。
- `application`：use case（用例）编排、输入输出边界、事务边界抽象；可以依赖 `domain`。
- `infrastructure`：配置、日志、database（数据库）、cache（缓存）、外部服务等技术实现。
- `interfaces`：HTTP/API、CLI、message consumer（消息消费者）等入口适配。

## Endpoint Placement

- HTTP route（路由）放在 `backend/src/sheepparter/interfaces/http/routes/`。
- request/response schema（请求/响应模式）可以放在同一 route 文件，或在跨路由复用时放到 `backend/src/sheepparter/interfaces/http/schemas.py` 或同层清晰位置。
- route 只做协议适配、校验、认证上下文提取和响应转换；业务判断应下沉到 `application` 或 `domain`。
- 新增业务能力时优先按 `domain` -> `application` -> `infrastructure` -> `interfaces/http` -> `tests` 的路径落地。

## API Design

- 对外业务接口默认使用 `/api/v1/...` 前缀；根健康检查等兼容入口可以保留，但新增业务接口不得绕过版本前缀。
- endpoint（接口端点）命名应表达资源或明确动作；资源型接口优先使用 noun（名词），认证类 `login/logout/me` 等动作型接口可以保留清晰动词。
- HTTP method（请求方法）语义必须明确：`GET` 只读，`POST` 创建或执行动作，`PUT/PATCH` 更新，`DELETE` 删除或撤销。
- 所有请求和响应必须使用显式 Pydantic schema（模式）或等价类型，不直接返回 ORM（对象关系映射）对象、数据库 row（行）或内部 domain object（领域对象）。
- JSON 字段命名对前端保持稳定。当前 auth API 已使用 `displayName` 作为前端字段；新增字段应避免无计划地在 `snake_case` 与 `camelCase` 间来回切换。
- 响应结构应保持稳定、可测试；不要为了单个页面临时塞入未命名的任意对象。
- `204 No Content` 响应不得返回 JSON body（响应体）；前端 API client 必须能正确处理空响应。
- 错误响应至少应提供可读 `detail`；若未来引入统一 error code（错误码），必须同步更新后端测试和前端 API client。
- 认证态优先使用 HttpOnly cookie（仅 HTTP Cookie）等不暴露给前端脚本的方案；前端不得依赖本地存储保存敏感 token（令牌）。
- 涉及分页、排序、过滤、幂等或批量操作的新接口必须在 Spec（需求规格）中先写清参数、默认值、边界和测试策略。

## Contract Rules

- API path（接口路径）、request field（请求字段）、response field（响应字段）变化都属于 API contract（接口契约）变化，默认按 Large Change（大型变更）处理。
- 后端 OpenAPI endpoint/schema（接口路径/模式）变化时，必须同步更新 `frontend/packages/api-client`。
- 当前尚未配置 API client 自动生成器；如果要引入生成器，必须先走 dependency whitelist（依赖白名单）和用户确认。
- 响应结构应稳定、可测试；不要让页面直接依赖后端内部模型或 ORM 对象。

## Database And Migration

- 当前仓库已有 SQLite + SQLAlchemy + Alembic 相关实现，见 `docs/architecture.md`、`backend/alembic/` 与 `backend/src/sheepparter/infrastructure/database/`。
- 业务用例应依赖 repository protocol（仓储协议）或应用层边界，不直接依赖数据库连接和 ORM 细节。
- SQLAlchemy model（模型）变化必须通过 Alembic 生成 migration（迁移）文件；生成后可以审阅和必要修正，但必须说明原因与风险。
- database（数据库）内容不允许手动修改；必须通过应用代码、migration（迁移）或受控脚本变更。

## Security Boundary

- 触及 authentication（认证）、authorization（授权）、secret（密钥）、production config（生产配置）、外部 callback（回调）或 sensitive data（敏感数据）时，必须满足 Triple Gate（三重门）：compile-time removal（编译期剔除）、production isolation（生产隔离）、runtime control（运行时控制）。
- 认证和权限逻辑不能只停留在前端显示层；后端必须在 API 边界或 use case（用例）边界执行必要校验。

## Tests And Verification

API 改动至少考虑以下验证：

- `cd backend && .\.venv\Scripts\python -m pytest`
- `cd backend && .\.venv\Scripts\python -m compileall src tests`
- 涉及前端调用时：`cd frontend && npm run typecheck`
- 涉及 contract（接口契约）变化时，补充或更新后端 tests（测试）与 `frontend/packages/api-client` 类型/调用验证。
