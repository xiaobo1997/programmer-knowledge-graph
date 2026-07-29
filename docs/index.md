---
layout: home

hero:
  name: "程序员的长期知识图谱"
  text: "把每一份阅读、每一次学习、每一段实践，沉淀成一张可生长的图。"
  tagline: 后端 · 前端 · 数据 · DevOps · AI · 架构 · 工程实践 · 读书 · 成长
  image:
    src: /logo.svg
    alt: 程序员的知识图谱
  actions:
    - theme: brand
      text: 进入总目录
      link: /readme
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/xiaobo1997/programmer-knowledge-graph

features:
  - icon: ⌬
    title: 后端开发
    details: Java/Go/Python、数据库、消息队列、分布式、JVM 调优。
    link: /backend
    linkText: 进入后端
  - icon: ⌘
    title: 前端开发
    details: JS/TS、Vue/React、构建工具、Web 性能、跨端。
    link: /frontend
    linkText: 进入前端
  - icon: ▥
    title: 数据 & 中间件
    details: MySQL、Redis、Elasticsearch、消息队列、缓存设计。
    link: /data
    linkText: 进入数据专题
  - icon: ◉
    title: DevOps & 云原生
    details: Linux、Docker、Kubernetes、CICD、监控、应急响应。
    link: /devops
    linkText: 进入 DevOps
  - icon: ✦
    title: AI & 大模型
    details: LLM、Agent、RAG、向量数据库、Prompt 工程。
    link: /ai
    linkText: 进入 AI 专题
  - icon: ⬡
    title: 架构 & 性能
    details: 系统设计、高并发、容量规划、稳定性工程。
    link: /architecture
    linkText: 进入架构
  - icon: ⚙
    title: 工程实践
    details: Git、测试、Code Review、调试、编码规范与工具链。
    link: /practice
    linkText: 进入工程实践
  - icon: ☰
    title: 读书笔记
    details: 整本书学习心得、跨领域阅读，沉淀认知而非题库。
    link: /reading
    linkText: 浏览读书笔记
  - icon: ◐
    title: 个人成长
    details: 软技能、Career、面试、薪资谈判、心理建设。
    link: /career
    linkText: 进入个人成长
  - icon: ◈
    title: 业务知识
    details: 互联网金融、支付体系、跨境收单等业务领域的全维度认知。
    link: /biz
    linkText: 进入业务知识
---

## 知识图谱不是题库

这里记录的是**长期值得保留的认知**：

- 读过的书、记住的核心观点与可执行行动
- 跨领域学习时沉淀的方法论与踩坑记录
- 让下次少走弯路的判断框架

**9 大类按工程师工作场景划分**——不按技术分（避免 DevOps 占 9 篇这种失衡），不按时间排（避免「最新的不一定是最重要的」）。

## 仓库边界

- **本文档仓库**：放「为什么、怎么做、踩过什么坑」—— 这是知识本身
- **示例代码仓库**（待建）：放「完整可运行的项目」—— 文档里贴链接，文本更聚焦

文章里要演示代码时，会链接到示例代码仓库，**不把大段代码贴在文档里**。

## 使用方式

- 顶部胶囊：进入「总目录」按分类筛选文章
- 顶部搜索（`⌘ K`）：全文搜索（Pagefind 索引）
- 文章页右侧「本页目录」：自动生成章节锚点
- 文章底部「相关阅读」：基于标签推荐同类文章
- 「在 GitHub 上编辑此页」：每篇文章 footer 有链接

## 沉淀原则

- 写**值得保留的认知**，不写 1+1=2
- 真实项目案例 > 教程摘抄
- 配图优先用 Mermaid / 截图，不堆文字
- 文章前缀 `[test]` 表示测试占位，正式内容不加

## 仓库治理

- `AGENTS.md`：AI 进入仓库的入口
- `docs/conventions/`：沉淀的命名/格式规范
- `docs/decisions/`：架构决策记录（ADR）
- `docs/changes/`：每次重大改动记录

AI 改仓库时**先看 conventions → decisions → changes，再动手**。

## 贡献方式

仓库公开，欢迎 fork 与讨论。
