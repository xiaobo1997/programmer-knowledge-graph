# AGENTS.md

> 🔴 **任何 AI（Cursor / Claude Code / Codex / Qoder / Hermes / 任何编辑器 / 任何大模型）进入本仓库，第一时间必须读这个文件，然后读 `docs/writing-skills/README.md`。没有例外。**

## 五层栈覆盖

本仓库在 AI 五层栈中的覆盖：

| 层 | 覆盖 | 位置 |
|----|:--:|------|
| L5 工具协议 | — | 纯文档仓库，不需要 MCP |
| L4 任务流 | — | 文档仓库不需要 |
| L3 规范驱动 ⭐ | ✅ | `docs/conventions/`（文章格式、图片、分类、UI、验证） |
| L2 决策档案 | ✅ | `docs/adr/`（5 个架构决策记录） |
| L1 项目记忆 ⭐ | ✅ | `AGENTS.md` + `docs/writing-skills/` |
| L0 卫生习惯 | ✅ | Conventional Commits + `CHANGELOG.md` |

**AI 进来不是裸仓库——L0+L1+L2+L3 全有。**

## AI 进入后执行顺序

1. **本文件（AGENTS.md）** — 仓库总览、规范体系、边界
2. **`docs/writing-skills/README.md`** — 🔴 写作方法论入口（必读！）
3. **`docs/conventions/README.md`** — 🔴 规范入口：文章格式、图片、分类、UI、验证
4. **`docs/adr/README.md`** — 架构决策历史
5. **`CHANGELOG.md`** — 最近改了什么、为什么改

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

### Commit 和 CHANGELOG 的分工

| | commit message | CHANGELOG.md |
|---|---|---|
| **放什么** | 做了什么（格式统一） | 为什么做、业务背景、AI 该知道什么 |
| **给谁看** | git log 快速浏览 | AI + 人类理解意图 |
| **粒度** | 单次改动 | 一个 feature / 一次重构的完整意图 |

**🔴 铁律**：CHANGELOG 记录 feature 级变更（新增模块、架构决策、方法论更新）。日常改文章、修 typo 只用 commit message，不写 CHANGELOG。CHANGELOG 不是 commit log。

## 🤖 AI 工作流 trigger（精简版）

任何 AI 切换到本仓库工作（Cursor / Claude Code / Codex / Qoder / Hermes / 其他大模型），按以下 trigger 执行任务：

- ✅ **不自动 commit / push**——必须等用户点头
- ✅ **写文章前必须读对应 SOP**（业务 / 技术）+ 画像锚点
- ✅ **任务完成时输出 6 项自检 + 交付报告**（完美状态 / 分项自检 / 文件清单 / git 状态 / 下一步 / 决策回顾）
- ✅ **不暴露公司名 / 真实数据 / 内部代号**——具体名单见本地 SOP（**不公开**）
- ✅ **不暴露画像标签**（P7 / P8 / 资深 / 全局架构师 / 业务架构师 等）——文章里禁止出现
- ✅ **不编造精确数字**——必须标注「行业认知」或「公开报道」

**详细工作流标准、必读 SOP、画像锚点、写作纪律**——见本地维护的 `.ai/ONBOARDING.md` 和 `docs/conventions/` 下 SOP 文件（**默认不 commit 到远程**）。

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
