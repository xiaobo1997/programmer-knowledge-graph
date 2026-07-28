# Changelog

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)。

格式：`feat:` 新功能 | `fix:` 修复 | `docs:` 文档 | `refactor:` 重构 | `chore:` 杂项

---

## [Unreleased]

### Changed

- 治理层从 OpenSpec 迁移到 Conventional Commits + CHANGELOG
- 规范文件移至 `docs/conventions/`，ADR 移至 `docs/adr/`

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
