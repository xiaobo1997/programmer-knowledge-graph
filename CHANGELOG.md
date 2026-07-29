# Changelog

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)。

格式：`feat:` 新功能 | `fix:` 修复 | `docs:` 文档 | `refactor:` 重构 | `chore:` 杂项

---

## [Unreleased]

### Added

- **业务知识分类（biz）**：第 10 大分类，覆盖互联网金融信贷、国内支付、跨境支付收单
- **业务文章模板** `docs/conventions/biz-article-template.md`：
  - 15 section 骨架（一句话定义 → 业务价值 → 术语 → 形态 → 流程 → 架构 → 对账 → trade-off → 数据模型 → 用例 → 打法 → 视角 → 技术架构 → 前景 → 总结）
  - AI 写作指令模板（先确认再写、配图规范、质量检查清单）
  - Mermaid 配图规范（flowchart / sequence / ER / graph / state）
- **示范文章**：国内支付 `1_清结算体系.md`（407 行，15 section 全覆盖，4 张 Mermaid 图）
- **Mermaid 点击放大**：点击 SVG 图全屏放大，支持 Esc/点击关闭
- **AGENTS.md 增加业务文章写作指引**

### Changed

- 治理层从 OpenSpec 迁移到 Conventional Commits + CHANGELOG
- 规范文件移至 `docs/conventions/`，ADR 移至 `docs/adr/`
- sync-toc.cjs：walk 跳过所有 index.md（子主题首页不算文章）
- 首页 features 压缩为 1 个卡片（`interview` 仓库）/ 保留 10 个（`programmer-knowledge-graph` 仓库）

### Fixed

- Mermaid 点击放大空白问题：v-html 改用响应式 svgContent + 剥离 width="100%"
- interview 仓库 sync-toc 0 篇问题：titleMap 从 6 个旧分类更新为 33 个数字编号分类
- interview theme/index.ts 重复 import 导致 build 报错

### Technical

- MermaidBlock.vue：新增 `<Teleport>` 全屏 overlay + 暗黑模式跟随

## [0.3.0] — 2026-07-27

### Added

- 文章内容格式规范（concept/problem/deep-dive + 5W 速记卡）
- 图片规范（本地 + 外部图床双模式）

### Changed

- OpenSpec 从 `docs/` 集中到仓库根 `openspec/`

## [0.2.0] — 2026-07-26

### Added

- KnowledgeRail 改用 shields.io badge 风格
- KnowledgeRail 默认折叠 + 展开 9 个方块
- 搜索改用 VitePress local search 替代 pagefind
- RocketMQ 事务消息文章

### Fixed

- KnowledgeRail 首页按钮双斜杠 bug

## [0.1.0] — 2026-07-25

### Added

- VitePress + Vue3 技术栈
- 9 大类分类结构
- KnowledgeRail 侧栏导航
- GitHub Pages 自动部署
