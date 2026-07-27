# AGENTS.md — AI 进入本仓库的入口

> 任何 AI（Cursor / Claude Code / Codex / Qoder / Hermes）第一次进入这个仓库，**必须先读这个文件**。然后按顺序读：

1. **本文件（AGENTS.md）** — 总览
2. **写作前必读**：
   - [`conventions/article-format.md`](./conventions/article-format.md)（文章格式：concept/problem/deep-dive + 5W 速记卡）
   - [`conventions/images.md`](./conventions/images.md)（图片规范）
3. **修改规范前必读**：[`conventions/article-prefix.md`](./conventions/article-prefix.md) + [`classification.md`](./conventions/classification.md)
4. **改大结构前必读**：[`decisions/0003-7-categories.md`](./decisions/0003-7-categories.md)（9 大类方案）
5. **AI 读完后**：再读 `decisions/` 其他 ADR + `changes/` 改动记录

**改任何东西前，先看 conventions → decisions → changes。**

## 这是什么

**程序员的长期知识图谱**——按工程师工作场景分 9 大类，长期沉淀「值得保留的认知」。

- **不是**题库、不是面试八股、不是入门教程
- **是**踩坑后的反思、跨领域的方法论、读书后的行动清单
- **是**给「未来的自己」和「同行」看的内容

## 仓库结构

```
openspec/             ← OpenSpec 治理（AGENTS.md / conventions / decisions / changes）
docs/                 ← VitePress 站点源文件（9 大类文章 / 首页 / 知识地图）
scripts/              ← 构建脚本（sync-toc / inject-article-meta / x.mjs）
docs/.vitepress/      ← VitePress 配置 + theme 组件
```

## ⚠️ 文章配图规范（AI 必读！）

**任何 AI 在为本仓库写文章、加图片时，必须先看 [`conventions/images.md`](./conventions/images.md)。**

核心要点速记：

| 来源 | 何时用 | 目录/登记 |
|---|---|---|
| **本地图片**（仓库内） | 核心架构图、自绘流程图、需要长期保留的图 | `docs/public/images/article/{分类}/{分类}-{slug}.{ext}` |
| **外部图床**（远程 URL） | 一次性截图、临时补充、第三方文档原图 | 文章 frontmatter `images:` 字段登记元数据（src/alt/type/source/expires/backup） |

引用语法：

- 本地：`![alt](/images/article/backend/xxx.png)`
- 外部（用 frontmatter 变量）：`![alt]({{ images[0].src }})`

**禁止：** 中文文件名 / 绝对路径 / base64 嵌入 / 不靠谱免费图床（微博、QQ）/ `docs/{category}/` 子目录（不会部署）。

完整规范见 [`openspec/conventions/images.md`](./conventions/images.md)。

## 仓库边界（重要！）

| 仓库 | 放什么 | 不放什么 |
|---|---|---|
| **本文档**（`programmer-knowledge-graph`） | 「为什么、怎么做、踩过什么坑」——认知本身 | 完整可运行的项目代码 |
| **示例代码**（`programmer-code-examples`，**待建**） | 完整可运行的项目，含 README、测试、git history | 零散代码片段、教程代码 |

**规则**：文章里要演示代码时，**链接到示例代码仓库**，**不把大段代码贴到文档**。

文章配图：放 `docs/public/images/article/{分类}/`，命名 `{分类}-{slug}.{ext}`。
架构图优先用 Mermaid（VitePress 原生支持），详见 [`images.md`](./conventions/images.md)。

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

1. **读** `` 知道命名/格式规范
2. **读** `` 知道历史架构决策
3. **读** `` 知道最近改了什么
4. **做** 改动（写文章 / 加分类 / 改配置）
5. **记录** 重大改动到 `YYYY-MM-DD-xxx.md`
6. **写 ADR** 架构变化到 `000N-xxx.md`

## 不允许的事情

- ❌ 在文档里贴大段代码（> 20 行）— 链接到示例代码仓库
- ❌ 改已有正式文章的 frontmatter / 内容（除非用户明确允许）
- ❌ 改 3 个配置文件的分类信息不同时改（KnowledgeRail / utils / sync-toc）
- ❌ 不写 commit message 就 push
- ❌ 跳过 build 验证就推送（必须 `npm run docs:build` 跑通）

## 必跑命令

```bash
# 写完文章只跑一个命令
cd ~/myworkspace/git/programmer-knowledge-graph
npm run x -- deploy "feat: 新增 XXX 文章"  # 内部自动 build + commit + push
```

## 文件指引

| 改什么 | 看什么 |
|---|---|
| 增加新分类 | `classification.md` + 改 3 个文件 |
| 改分类名/图标 | `classification.md` + 改 3 个文件 |
| 写文章 | `article-prefix.md` + `0003-7-categories.md` |
| 加链接规范 | `code-example-link.md` |
| 部署相关 | `2025-07-20-github-pages-cicd.md` + `.github/workflows/docs.yml` |
| 改 UI 主题 | `ui-design.md` + `docs/.vitepress/theme/custom.css` |
| 改 KnowledgeRail 风格 | `0005-shields-badge-rail.md` |
| 改 CategoryIcon | `ui-design.md` 第 3 节 |

## 提问的艺术

- 不确定用户意图 → 问，不要猜
- 多种方案 → 列出来让用户选
- 改动前先讲思路（5 个决策点）→ 等用户确认 → 再写代码
- 完成后跑验证 → 报告实际结果，不说"应该对了"

## 仓库状态（截至 2025-07-25（OpenSpec 集中到 openspec/））

- 9 大类已建好骨架，3 类暂空（frontend / data / practice）
- 19 篇文章（18 篇 `[test]` 占位 + 1 篇 change）
- OpenSpec 结构已建（5 conventions / 5 decisions / 2 changes）
- KnowledgeRail shields.io badge 风格 + 默认折叠
- GitHub Pages 自动部署（commit da541a9）
- 示例代码仓库待建

---

**最后：** 你改这个仓库前先想清楚——你改的是别人的知识沉淀。谨慎、轻量、可追溯。
