# Frontend UI And Design Rules

本文档整理 SheepParter 的 frontend UI（前端用户界面）与 design rules（设计规则）。依据来自 `AGENTS.md`、`docs/architecture.md`、`frontend/eslint.config.js`、现有 `frontend/` 结构，以及用户已提供的 `skills/` 设计规则。

## Scope

- 用户端应用位于 `frontend/apps/user-web`。
- 管理员端应用位于 `frontend/apps/admin-web`。
- 跨应用复用的 UI（用户界面）组件放在 `frontend/packages/ui`。
- 跨应用复用的 API client（接口客户端）放在 `frontend/packages/api-client`。

## Product Shape

- SheepParter 是基于英文学习中文的 game-based demo（游戏化演示）项目，UI 文案天然会同时出现 English（英文）与 Chinese（中文）。
- 用户端应优先呈现可操作的学习体验，不要默认做成 marketing landing page（营销落地页）。
- 管理员端和工作台类页面应保持安静、清晰、可扫描，优先服务高频操作、状态判断和数据管理。
- 当前 user-web（用户端）已采用 dark neon（暗色霓虹）方向：深色背景，cyan（青色）、orange（橙色）、green（绿色）作为高对比强调色。新增同类页面默认保持一致，除非 Spec（需求规格）另行批准。

## Component Boundaries

- 应用层负责页面、路由、状态装配与产品流程。
- `packages/ui` 只沉淀跨端复用且稳定的基础组件；不要把单个页面的临时业务逻辑提前抽成共享组件。
- `packages/api-client` 只处理请求封装、类型定义和错误归一；页面组件不得绕过它散落请求封装。
- 新增组件时优先沿用现有代码风格和组件边界，避免为了局部页面引入全局抽象。

## Visual Design

- 页面第一屏应直接服务核心产品体验：学习、练习、设置、个人状态或后台管理；除非用户明确要求，不做纯宣传页。
- 不使用一眼看起来像占位稿的单色页面。若页面需要情绪或游戏感，优先通过真实 UI 状态、学习内容、进度、反馈、计时、得分或可交互元素表达。
- 避免只有一个色相的 one-note palette（单调色板）。当前暗色霓虹风格应保留青/橙/绿的层次，不要退化成纯紫、纯蓝、纯米色、纯棕橙等单一主题。
- 不使用独立 gradient orb（渐变光球）、bokeh blob（虚化光斑）作为装饰背景。
- 不创建无意义的 SVG illustration（矢量插画）填充页面；需要视觉资产时，应体现真实产品、学习状态、玩法或内容。
- 游戏或强互动体验可以使用 canvas（画布）、SVG（矢量图）或 Three.js（3D 库）等代码原生图形；若引入新依赖，必须先走依赖白名单。

## Interaction And Layout

- 常见控件应使用用户熟悉的形态：按钮用于明确命令，toggle/checkbox（开关/复选框）用于二元设置，tabs（标签页）用于视图切换，menu（菜单）用于选项集合，slider/stepper/input（滑块/步进器/输入框）用于数值。
- 能用熟悉 icon（图标）表达的工具按钮，不要做成冗长文字胶囊；但新增 icon library（图标库）必须先走依赖白名单。
- 不要嵌套 card（卡片）式容器；卡片只用于重复项目、modal（模态框）或确实需要 framed tool（框定工具）的场景。
- 固定格式 UI 元素，如棋盘、工具栏、计数器、卡片列表，应设置稳定尺寸或响应式约束，避免 hover（悬停）或状态变化造成布局跳动。
- 文本必须在移动端和桌面端容器内可读、不断裂、不遮挡相邻内容；按钮和卡片里的最长词也不能溢出。
- 不用 viewport width（视口宽度）直接缩放字体；letter-spacing（字距）默认保持 `0`，除非现有样式明确需要。
- 复杂交互应提供稳定 `data-testid` 或等价测试定位，尤其是导航、提交、切换、关键学习动作和退出登录。

## Copy And i18n

- 当前 React 项目尚未引入 i18n（国际化）框架或统一 message catalog（文案目录）。
- 新增或修改用户可见字符串时，必须先判断它属于学习内容、导航/操作文案、错误提示、状态提示还是管理员文案。
- English term（英文术语）与中文解释必须语义一致；不要把学习内容和临时 placeholder（占位文案）混在一起。
- 大批量用户可见文案、多语言切换、课程内容、题库、错误码文案或可复用 UI 文案属于 Large Change（大型变更），必须先提出 i18n 方案再实现。

## Skills

- 涉及视觉设计或重构时，先查看 `skills/llms.txt`，再按任务选择相关 `skills/*/SKILL.md`。
- `skills/` 是用户提供的 design/output skills（设计与输出规范素材），不是运行时代码；除非用户明确要求，不要修改或删除。
- 若 skill（技能）规则与当前项目技术栈冲突，按项目实际栈调整，并在 Spec/Plan（规格/计划）或交付说明中说明取舍。

## Verification

前端 UI 改动至少考虑以下验证：

- `cd frontend && npm run lint`
- `cd frontend && npm run typecheck`
- `cd frontend && npm run build`
- 视觉或交互改动应在目标 viewport（视口）上人工或浏览器自动化检查布局、文本溢出和核心交互。
