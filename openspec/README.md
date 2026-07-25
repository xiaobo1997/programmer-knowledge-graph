---
title: OpenSpec 目录
aside: false
---

# OpenSpec 目录

> 本仓库的「治理」信息——AI 入口、规范、决策、变动记录都集中在这里。

## 目录结构

```
openspec/
├── AGENTS.md          ← AI 入口（必读）
├── conventions/       ← 命名/格式/UI 规范
├── decisions/         ← 架构决策记录（ADR）
└── changes/           ← 每次重大改动记录
```

## 阅读顺序

1. **[AGENTS.md](./AGENTS.md)** — 仓库是什么、必跑命令、文件指引
2. **conventions/** — 命名/格式/UI 规范
3. **decisions/** — 历史架构决策（知道为什么这么设计）
4. **changes/** — 最近改了什么（知道现在是什么状态）

## 何时更新

| 改了什么 | 更新到哪 |
|---------|---------|
| 命名 / 格式 / UI 新规范 | `conventions/` |
| 架构变化（库、工具、结构） | `decisions/000N-xxx.md` |
| 重大功能（重构、新分类、新设计） | `changes/YYYY-MM-DD-xxx.md` |
| 文件位置或读法 | `AGENTS.md` |

## 与 docs/ 的关系

- `docs/` = 给读者看的最终输出（VitePress 站点源文件）
- `openspec/` = 给 AI / 协作者看的治理信息

**原则：**
- 不把 spec 写到 docs/ 里（污染读者内容）
- 不把读者内容写到 openspec/ 里（增加噪音）

## 命名约定

- ADR：`0001-vitepress.md` 4 位编号顺序
- Change：`YYYY-MM-DD-简短描述.md` 日期前缀
- Convention：`小写连字符.md` 描述主题
