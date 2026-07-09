# Coding Rules

本文档整理 SheepParter 的 coding rules（编码规则）。依据来自 `AGENTS.md`、`backend/pyproject.toml`、`frontend/eslint.config.js`、`frontend/package.json` 与 `scripts/check.ps1`。

## Change Triage

- 每条开发指令必须先判断是 Small Change（小变更）还是 Large Change（大型变更）。
- Small Change（小变更）可以直接推进，但要说明未触发或触发了哪些 runtime risks（运行时风险），并优先运行 targeted tests（定向测试）。
- Large Change（大型变更）必须先写 Spec（需求规格）并等待确认，再写 Plan（执行计划）并等待确认，然后才能编码。
- Large Change 包括新功能、refactor（重构）、schema/API（数据结构/接口）变化、跨模块逻辑、database（数据库）、认证/权限、安全边界、并发/异步行为、git merge/rebase/conflict（合并/变基/冲突）处理等。

## Development Style

- 默认严格按 TDD（测试驱动开发）推进可测试功能：先写失败测试或更新测试，再实现，再在测试保护下重构。
- 小改动保持小范围；不要顺手重构无关模块。
- 代码注释只解释不显然的设计意图；不要写重复代码字面含义的注释。
- 优先使用标准库、现有依赖和项目内已有抽象；不要为了试错随意加入 dependency（依赖）。

## File Size

- 单个源代码或文档文件最多 500 行。
- 超过 500 行前应优先拆分为更清晰的 module（模块）、component（组件）、test file（测试文件）或规则文件。
- generated code（生成代码）、dependency lockfile（依赖锁文件）、迁移工具自动生成文件等例外文件可以超过 500 行，但不得手动编辑锁文件；交付时应说明例外原因。
- 如果短期内无法拆分，必须在 Spec/Plan（规格/计划）中说明原因、风险和后续拆分策略。

## Python Rules

- 后端 Python 版本目标为 Python 3.12，见 `backend/pyproject.toml`。
- Ruff（代码检查）配置：`line-length = 100`，`target-version = "py312"`。
- Ruff lint select（检查规则集合）：`E`、`F`、`I`、`B`、`UP`、`N`、`ASYNC`。
- mypy（静态类型检查）启用 `strict = true` 与 `warn_unreachable = true`。
- pytest（测试框架）使用 `pythonpath = ["src"]` 与 `testpaths = ["tests"]`。

## TypeScript And React Rules

- 前端使用 npm workspaces（工作区），根脚本统一调度各 app/package。
- ESLint（代码检查）使用 `@eslint/js` recommended 与 `typescript-eslint` recommended。
- TypeScript（类型脚本）检查通过各 workspace 的 `typecheck` 脚本执行。
- 业务页面不要绕过 `frontend/packages/api-client` 自行散落请求封装。
- 共享 UI（用户界面）组件优先放在 `frontend/packages/ui`，但只有跨应用复用且稳定时才抽取。

## Dependency Rules

- 新增 dependency（依赖）前必须先查 `docs/dependency-whitelist.md`。
- 白名单外依赖必须先确认来源合法、维护者可信，并向用户提供 official docs（官方文档）或 repository（代码仓库）链接，再征询是否下载和是否加入白名单。
- dependency lockfile（依赖锁文件）严禁手动修改；`frontend/package-lock.json` 必须通过 npm 工具生成。

## Git Rules

- 当前只允许本地 Git（版本控制）初始化与本地文件维护；远端 remote（远程仓库）等待用户后续指令。
- 不要使用 `git reset --hard`、`git checkout --` 等会覆盖用户更改的命令，除非用户明确要求。
- 涉及 merge/rebase/conflict resolution（合并/变基/冲突解决）默认按 Large Change（大型变更）处理。

## Verification Commands

提交或交付前优先运行：

- `.\scripts\check.ps1`
- `cd frontend && npm run lint`
- `cd frontend && npm run typecheck`
- `cd frontend && npm run build`
- `cd backend && .\.venv\Scripts\python -m pytest`

如果某条命令因依赖未安装、虚拟环境缺失或当前环境限制无法运行，交付说明必须明确说明原因。
