---
wordCount: 1568
readMinutes: 5
---
# 分类重构 + OpenSpec 化

> 2025-07-20 启动。本次改动把仓库从「按技术分 6 类」改为「按工程师工作场景分 7 类」，并加上 OpenSpec 化结构（changes / decisions / conventions / AGENTS.md）。

## 为什么

### 现状问题

1. **分类粒度不均**
   - DevOps 占 9 篇（cicd 子目录 5 + 直接子级 4）
   - 全栈 2 篇（Spring Boot、RESTful）
   - 路线图 2 篇、技术地图 2 篇，**和「DevOps」「全栈」内容重叠**
   - 「个人成长」只放职业相关，没有放工程实践类（Git / 测试 / Code Review）

2. **现有文章是「测试占位」**
   - 16 篇文章都是 demo，**没有沉淀「真值得保留的认知」**
   - 未来新写的「真文章」会混在测试文章里
   - 缺少前缀机制区分

3. **AI 进仓库不知道上下文**
   - 没有 AGENTS.md / CLAUDE.md
   - 没有 conventions/ 沉淀规范
   - 没有 decisions/ 记录架构选择
   - 没有 changes/ 记录每次重大改动
   - 每次 AI（Cursor / Claude Code / Qoder）都要从零理解仓库

4. **示例代码和文档混在一起**
   - 文档里贴大段代码块
   - 应该有独立的代码仓库

### 目标

- 7 大类，**按工程师工作场景划分**，粒度均衡
- 文章前缀机制：`[test]` 表示测试占位，未来要覆盖；无前缀 = 正式
- OpenSpec 化结构：每次改动可追溯
- AGENTS.md：AI 进仓库的「第一站」

## 7 大类（新版）

| 序号 | 中文名 | 英文目录 | 图标 | 包含什么 |
|---|---|---|---|---|
| 1 | **后端开发** | `backend` | ◈ | 语言（Java/Go/Python）、DB、MQ、分布式、JVM、调优 |
| 2 | **前端开发** | `frontend` | ⌘ | JS/TS、Vue/React、构建工具、跨端（Web） |
| 3 | **DevOps & 云原生** | `devops` | ◐ | Linux、Docker、K8s、CICD、监控、应急 |
| 4 | **AI & 大模型** | `ai` | ✦ | LLM、Agent、RAG、向量数据库、Prompt |
| 5 | **架构 & 性能** | `architecture` | ⬡ | 系统设计、高并发、容量规划、稳定性 |
| 6 | **读书笔记** | `reading` | ▤ | 整本书学习心得、跨领域 |
| 7 | **个人成长** | `career` | ◉ | 软技能、Career、面试、薪资、心理 |

**为什么不是 6/8/10：** 6 类少（缺前端），8 类多（前端和跨端拆开会失衡），10 类太多（导航难用）。

## 文章迁移 mapping

| 旧路径 | 新路径 | 理由 |
|---|---|---|
| `fullstack/spring-boot-hello.md` | `backend/[test]spring-boot-hello.md` | Spring Boot 属后端 |
| `fullstack/restful-design.md` | `backend/[test]restful-design.md` | RESTful 是后端 API 设计 |
| `devops/docker-getting-started.md` | `devops/[test]docker-getting-started.md` | 保留 |
| `devops/kubernetes-basics.md` | `devops/[test]kubernetes-basics.md` | 保留 |
| `devops/github-actions-cicd.md` | `devops/[test]github-actions-cicd.md` | 保留 |
| `devops/cicd/README.md` | `devops/cicd/[test]README.md` | 保留子目录 |
| `devops/cicd/github-actions-basics.md` | `devops/cicd/[test]github-actions-basics.md` | 保留 |
| `devops/cicd/gitlab-vs-github-actions.md` | `devops/cicd/[test]gitlab-vs-github-actions.md` | 保留 |
| `devops/cicd/advanced/README.md` | `devops/cicd/advanced/[test]README.md` | 保留 |
| `devops/cicd/advanced/actions-matrix.md` | `devops/cicd/advanced/[test]actions-matrix.md` | 保留 |
| `devops/cicd/advanced/reusable-workflows.md` | `devops/cicd/advanced/[test]reusable-workflows.md` | 保留 |
| `agent/llm-agent-intro.md` | `ai/[test]llm-agent-intro.md` | agent → ai |
| `agent/rag-explained.md` | `ai/[test]rag-explained.md` | agent → ai |
| `career/tech-lead-transition.md` | `career/[test]tech-lead-transition.md` | 保留 |
| `career/salary-negotiation.md` | `career/[test]salary-negotiation.md` | 保留 |
| `roadmap/backend-roadmap-3-to-5.md` | `architecture/[test]backend-roadmap-3-to-5.md` | roadmap → architecture |
| `roadmap/cloud-native-path.md` | `architecture/[test]cloud-native-path.md` | roadmap → architecture |
| `reading-notes/凤凰架构.md` | `reading/[test]凤凰架构.md` | reading-notes → reading |

## OpenSpec 化结构

### 新增目录

```
.
├── AGENTS.md                         # AI 进入仓库的入口
├── docs/
│   ├── conventions/                  # 沉淀的规范
│   │   ├── git-commit.md            # commit 消息规范
│   │   ├── article-prefix.md        # 文章前缀规范
│   │   ├── classification.md        # 分类命名规范
│   │   └── code-example-link.md     # 示例代码仓库链接规范
│   ├── decisions/                    # Architecture Decision Records
│   │   ├── 0001-vitepress.md
│   │   ├── 0002-github-pages.md
│   │   ├── 0003-7-categories.md
│   │   └── 0004-separate-code-repo.md
│   ├── changes/                      # 每次重大改动记录
│   │   └── 2025-07-20-classification-restructuring.md
│   └── ...（现有文章）
```

### AGENTS.md 必读内容

1. 仓库边界：文档仓库 vs 示例代码仓库
2. 7 大类分类规则
3. 文章前缀规范
4. AI 改动流程：先看 conventions/ → decisions/ → changes/ → 动手
5. commit 规范
6. 不允许的事情（如：不在文档里贴大段代码）

### 关键决策（暂存）

#### ADR-0003: 7 大类分类

- **决定**：从 6 类（读书笔记/全栈/DevOps/Agent/成长/技术地图）改为 7 类
- **理由**：按工程师工作场景划分（后端/前端/DevOps/AI/架构/读书/成长）
- **被否决的方案**：
  - 保持 6 类，全栈保留（否决：粒度太粗，前后端混在一起）
  - 拆成 10+ 类（否决：导航难用）
  - 不分类，全部按时间倒序（否决：找特定领域内容难）

#### ADR-0004: 示例代码独立仓库

- **决定**：示例代码放到独立仓库 `xiaobo1997/programmer-code-examples`
- **理由**：
  - 文档仓库只放「值得保留的认知」，不放完整代码
  - 完整代码需要 git history、独立 README、独立测试
  - 文档里用外链引用代码仓库，文本更聚焦
- **影响**：
  - 未来文章涉及代码时，链接到代码仓库
  - 现有测试文章里的代码块**保留**（不破坏现有内容），未来正式文章不再贴大段代码

## 执行步骤

### Step 1: 重设分类 + 加 [test] 前缀

- 创建新分类目录：`backend/`, `frontend/`, `devops/`, `ai/`, `architecture/`, `reading/`, `career/`
- 用 `git mv` 迁移 18 篇文章到新位置，文件名加 `[test]` 前缀
- 删旧分类目录（fullstack / agent / reading-notes / roadmap）

### Step 2: 同步配置

- `KnowledgeRail.vue`：更新 7 大类
- `utils.ts` 的 `titleMap`：加新分类名
- `scripts/sync-toc.cjs` 的 `titleMap` / `iconMap` / `descMap`：加新分类

### Step 3: OpenSpec 化骨架

- 写 `AGENTS.md`
- 创建 `docs/conventions/` 4 个规范文件
- 创建 `docs/decisions/` 4 个 ADR
- 创建 `docs/changes/2025-07-20-classification-restructuring.md`（即本文）

### Step 4: index.md 调整

- 首页 features 改用新 7 大类卡片
- 介绍区更新

### Step 5: build + verify + commit + push

- `npm run docs:build` 确保不报错
- `npm run docs:verify` 通过
- commit + push → GitHub Actions 自动部署

## 风险

1. **链接断裂**：旧 URL 失效（GitHub Pages 没有 redirect）
   - 缓解：现有用户量小，可接受；未来新写文章时提醒用新 URL

2. **sync-toc 标签解析**：新前缀 `[test]` 在文件名里，前端要正确处理
   - 验证：build 后看 TocOverview 是否正确显示

3. **侧栏 + 总目录同步更新**：3 个文件（KnowledgeRail / utils / sync-toc）必须同步改
   - 缓解：先改一个跑通，再改下一个

## 验收

- [ ] 7 大类目录都建好
- [ ] 18 篇文章都在新位置，文件名加 `[test]` 前缀
- [ ] 首页 features 显示 7 大类
- [ ] 总目录 `/readme` 胶囊显示 7 大类
- [ ] 进入任一分类只显示该分类文章
- [ ] `npm run docs:build` 通过
- [ ] `npm run docs:verify` 通过
- [ ] GitHub Actions 部署成功
- [ ] 浏览器验证：https://xiaobo1997.github.io/programmer-knowledge-graph/
- [ ] 现有文章点击不报错

## 后续

- 建示例代码仓库 `xiaobo1997/programmer-code-examples`（本次不做，下次做）
- 写新文章时全部用新分类 + 无 `[test]` 前缀
- 旧的 `[test]` 文章等正式内容沉淀后逐步覆盖
