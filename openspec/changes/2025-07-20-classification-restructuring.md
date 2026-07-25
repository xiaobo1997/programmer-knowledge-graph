---
title: 分类重构 + OpenSpec 化
date: 2025-07-20
status: shipped
wordCount: 407
readMinutes: 1
---

# 分类重构 + OpenSpec 化

## 目标

把 `programmer-knowledge-graph` 仓库从「随手放文章」改成「可长期维护的知识图谱」。

## 改动

### 1. 分类重构：从 6 类 → 9 大类

旧分类（按文档类型组织）：
- 读书笔记 / 全栈 / DevOps / Agent / 路线图 / 杂项

新分类（按工程师工作场景组织，9 大类）：
- 后端 / 前端 / 数据 & 中间件 / DevOps & 云原生 / AI & 大模型
- 架构 & 性能 / 工程实践 / 读书笔记 / 个人成长

理由：见 ADR-0003。

### 2. OpenSpec 化

新增 4 类文档（仓库治理的源信息）：

| 目录 | 作用 | 文件 |
|------|------|------|
| `AGENTS.md` | AI 入口（指路 + 必读清单） | - |
| `docs/conventions/` | 命名 / 格式规范 | classification / article-prefix / git-commit / code-example-link |
| `docs/decisions/` | 架构决策记录（ADR） | 0001-vitepress / 0002-github-pages / 0003-7-categories / 0004-separate-code-repo |
| `docs/changes/` | 每次重大改动记录 | 本文件 + index |

### 3. 文章迁移 + 占位机制

- 现有 18 篇文章加 `test: true` frontmatter 标记为占位
- 迁移到对应新分类
- 文件名去掉 `[test]` 前缀（从文件名移到 frontmatter，避免方括号被 VitePress 当 dynamic route）

未来作者覆盖占位文章：
- 改 `test: true` → 删掉
- 改 frontmatter 标题、tags、wordCount
- 写正文

## 执行

- 分类目录移动：`docs/fullstack → docs/backend` 等
- frontmatter 批量加 `test: true`
- sync-toc.cjs 检测 `test` 字段决定文章标题前是否加 🧪 测试徽章
- knowledge-rail / sidebar / toc-overview 同步更新 9 大类数据
- 修过一个构建死链（docs/README.md 引用 `../../../README` 错路径）

## 验证

- 6 分类 / 19 篇文章（去掉 [test]README 占位）/ 22 分钟阅读时间
- 9 大类全部可访问
- 总目录胶囊筛选正常
- GitHub Actions 部署通过
