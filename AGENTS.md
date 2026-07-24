# AGENTS.md — AI 进入本仓库的入口

> 任何 AI（Cursor / Claude Code / Codex / Qoder / Hermes）第一次进入这个仓库，**必须先读这个文件**。然后按顺序读 conventions → decisions → changes。

## 这是什么

**程序员的长期知识图谱**——按工程师工作场景分 9 大类，长期沉淀「值得保留的认知」。

- **不是**题库、不是面试八股、不是入门教程
- **是**踩坑后的反思、跨领域的方法论、读书后的行动清单
- **是**给「未来的自己」和「同行」看的内容

## 仓库边界（重要！）

| 仓库 | 放什么 | 不放什么 |
|---|---|---|
| **本文档**（`programmer-knowledge-graph`） | 「为什么、怎么做、踩过什么坑」——认知本身 | 完整可运行的项目代码 |
| **示例代码**（`programmer-code-examples`，**待建**） | 完整可运行的项目，含 README、测试、git history | 零散代码片段、教程代码 |

**规则**：文章里要演示代码时，**链接到示例代码仓库**，**不把大段代码贴到文档**。

## 9 大类

| 目录 | 中文名 | 内容 |
|---|---|---|
| `backend/` | 后端开发 | Java/Go/Python、DB、MQ、分布式、JVM |
| `frontend/` | 前端开发 | JS/TS、Vue/React、构建、Web 性能 |
| `data/` | 数据 & 中间件 | MySQL、Redis、ES、MQ、缓存 |
| `devops/` | DevOps & 云原生 | Linux、Docker、K8s、CICD、监控 |
| `ai/` | AI & 大模型 | LLM、Agent、RAG、向量数据库 |
| `architecture/` | 架构 & 性能 | 系统设计、高并发、容量、稳定性 |
| `practice/` | 工程实践 | Git、测试、Code Review、调试、编码规范 |
| `reading/` | 读书笔记 | 整本书学习心得 |
| `career/` | 个人成长 | 软技能、Career、面试、薪资 |

## 文章前缀规范

| 前缀 | 含义 | 何时用 |
|---|---|---|
| `[test]` | 测试占位 | 临时占位、未来会被替换为正式内容 |
| 无前缀 | 正式内容 | 长期保留的文章 |

**示例：**
- `backend/[test]spring-boot-hello.md` — 测试占位
- `backend/spring-ioc-deep-dive.md` — 正式文章

## 改动流程（AI 必读）

1. **读** `docs/conventions/` 知道命名/格式规范
2. **读** `docs/decisions/` 知道历史架构决策
3. **读** `docs/changes/` 知道最近改了什么
4. **做** 改动（写文章 / 加分类 / 改配置）
5. **记录** 重大改动到 `docs/changes/YYYY-MM-DD-xxx.md`
6. **写 ADR** 架构变化到 `docs/decisions/000N-xxx.md`

## 不允许的事情

- ❌ 在文档里贴大段代码（> 20 行）— 链接到示例代码仓库
- ❌ 改已有正式文章的 frontmatter / 内容（除非用户明确允许）
- ❌ 改 3 个配置文件的分类信息不同时改（KnowledgeRail / utils / sync-toc）
- ❌ 不写 commit message 就 push
- ❌ 跳过 build 验证就推送（必须 `npm run docs:build` 跑通）

## 必跑命令

```bash
# 写完文章必须跑这 4 个命令
cd ~/myworkspace/git/programmer-knowledge-graph
rm -rf docs/.vitepress/dist docs/.vitepress/cache
npm run docs:build        # 自动跑 sync-toc + meta-inject
npm run docs:verify       # 检查 7 关键产物
git add -A
git commit -m "feat: ..."  # 中文 commit
git push origin master
```

## 文件指引

| 改什么 | 看什么 |
|---|---|
| 增加新分类 | `docs/conventions/classification.md` + 改 3 个文件 |
| 改分类名/图标 | `docs/conventions/classification.md` + 改 3 个文件 |
| 写文章 | `docs/conventions/article-prefix.md` + `docs/decisions/0003-7-categories.md` |
| 加链接规范 | `docs/conventions/code-example-link.md` |
| 部署相关 | `docs/changes/2025-07-20-github-pages-cicd.md` + `.github/workflows/docs.yml` |
| 改 UI 主题 | `docs/decisions/0001-vitepress.md` + `docs/.vitepress/theme/custom.css` |

## 提问的艺术

- 不确定用户意图 → 问，不要猜
- 多种方案 → 列出来让用户选
- 改动前先讲思路（5 个决策点）→ 等用户确认 → 再写代码
- 完成后跑验证 → 报告实际结果，不说"应该对了"

## 仓库状态（截至 2025-07-20）

- 9 大类已建好骨架，3 类暂空（frontend / data / practice）
- 18 篇 `[test]` 占位文章 + 1 篇 change 记录
- OpenSpec 结构（changes / decisions / conventions）已建
- GitHub Pages 自动部署
- 示例代码仓库待建

---

**最后：** 你改这个仓库前先想清楚——你改的是别人的知识沉淀。谨慎、轻量、可追溯。
