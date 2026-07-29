# AGENTS.md

> 🔴 **任何 AI（Cursor / Claude Code / Codex / Qoder / Hermes / 任何编辑器 / 任何大模型）进入本仓库，第一时间必须读这个文件，然后读 `docs/writing-skills/README.md`。没有例外。**

## AI 进入后执行顺序

1. **本文件（AGENTS.md）** — 仓库总览、规范体系、边界
2. **`docs/writing-skills/README.md`** — 🔴 写作方法论入口（必读！所有写文章任务必须先加载）
3. **`docs/conventions/article-verification.md`** — 写完必跑的 6 Loop 验证
4. **`CHANGELOG.md`** — 最近改了什么

## 这是什么

**程序员的长期知识图谱**——10 大分类，长期沉淀「值得保留的认知」。

## 规范体系（无 openspec/）

本仓库**不再使用 openspec/ 目录**。所有规范在 `docs/` 下：

| 目录 | 用途 |
|---|---|
| `docs/writing-skills/` | 🔴 写作方法论入口（AI 先看这个） |
| `docs/conventions/` | 写作规范（文章格式、业务模板、图片、分类、UI、验证） |
| `docs/adr/` | 架构决策记录 |
| `scripts/` | 构建脚本 |

**历史 commit 中可能残留 `docs(openspec):` 标签——不要被误导。**

## 仓库结构

```
docs/
├── writing-skills/     ← 🔴 AI 入口：怎么写、写在哪、用什么模板
├── conventions/        ← 规范（article-format / biz-article-template / images / classification）
├── adr/                ← 决策记录
├── backend/            ← 后端开发（Java、REST、Spring Boot）
├── frontend/           ← 前端开发
├── data/               ← 数据 & 中间件（RocketMQ、Redis）
├── devops/             ← DevOps & 云原生（Docker、K8s、CICD）
├── ai/                 ← AI & 大模型（LLM Agent、RAG）
├── architecture/       ← 架构 & 性能（后端路线、云原生）
├── practice/           ← 工程实践
├── reading/            ← 读书笔记
├── career/             ← 个人成长
└── biz/                ← 业务知识（支付、信贷、跨境收单）
```

## Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat: 新增 xxx 文章
fix: 修复 xxx 问题
docs: 补充 xxx 文档
refactor: 重构 xxx
chore: 构建/工具链
```

## 不允许的事情

- ❌ 不读 `docs/writing-skills/README.md` 就开始写文章
- ❌ 改已有正式文章的内容（除非用户明确允许）
- ❌ 改 3 个配置文件不同时改（utils / KnowledgeRail / sync-toc）
- ❌ 不跑 6 Loop 验证就 commit
- ❌ 不跑 `npm run docs:build` 就 push

## 必跑命令

```bash
npm run x -- dev      # http://127.0.0.1:5175/programmer-knowledge-graph/
npm run x -- build    # 构建 + 验证
npm run x -- deploy "feat: xxx"  # build + commit + push
```

## 提问的艺术

- 不确定用户意图 → 问，不要猜
- 多种方案 → 列出来让用户选
- 改动前先讲思路 → 等用户确认 → 再写代码
- 写完跑 6 Loop → 报告实际结果，不说"应该对了"
