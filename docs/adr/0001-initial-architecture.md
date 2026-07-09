# ADR 0001: Initial Full-Stack Scaffold

## Status

Accepted

## Context

项目需要同时支持后端 API、用户 Web 端、管理员 Web 端，并为后续多人/多 agent 协作留下清晰边界。

## Decision

- 后端使用 Python + FastAPI，并按 Clean Architecture（整洁架构）拆分 `domain`、`application`、`infrastructure`、`interfaces`。
- 前端使用 React + Vite + TypeScript，并通过 npm workspaces（工作区）拆分两个 app 与共享 packages。
- Git 只做本地初始化和基础文件维护；remote（远程仓库）等待用户后续指令。
- 保留 `skills/` 目录作为 agent 可选参考资料，不纳入运行时依赖。

## Consequences

- 新功能需要按层级放置代码，初期文件数量略多，但长期可维护性更好。
- 两个前端应用可以共享 UI 与 API client，同时保留独立发布空间。
- 当前脚手架不假设数据库、认证或部署平台，后续可以按真实需求补充。
