---
wordCount: 845
readMinutes: 3
---
# 写作方法论入口

> 🔴 **任何 AI 进入本仓库，被要求写文章时，必须先读这个文件。没有例外。**

---

## 第一步：判断文章类型

| 文章属于... | 用这个模板 | 在哪 |
|---|---|---|
| **技术工具/框架/语言**（如 Java 17、Redis、Docker） | 技术文章模板 | `docs/conventions/article-format.md` |
| **业务领域认知**（如清结算、信贷、跨境收单） | 业务知识文章模板 | `docs/conventions/biz-article-template.md` |

---

## 第二步：确定放哪

看 `docs/conventions/classification.md`，确定文章归哪个分类。

| 分类 | 目录 | 示例 |
|---|---|---|
| 后端开发 | `docs/backend/` | `docs/backend/java/java17特性/1_xxx.md` |
| 数据 & 中间件 | `docs/data/` | `docs/data/rocketmq/事务消息/1_xxx.md` |
| DevOps & 云原生 | `docs/devops/` | `docs/devops/docker/1_xxx.md` |
| AI & 大模型 | `docs/ai/` | `docs/ai/llm-agent/1_xxx.md` |
| 架构 & 性能 | `docs/architecture/` | `docs/architecture/cloud-native/1_xxx.md` |
| 工程实践 | `docs/practice/` | `docs/practice/xxx/1_xxx.md` |
| 读书笔记 | `docs/reading/` | `docs/reading/凤凰架构/1_xxx.md` |
| 个人成长 | `docs/career/` | `docs/career/薪资谈判/1_xxx.md` |
| **业务知识** | `docs/biz/` | `docs/biz/国内支付/1_清结算体系.md` |

**目录命名规则：** `docs/<分类>/<子主题>/<序号>_<主题>-<深度标识>.md`

**深度标识：**

| 标识 | 含义 | 示例 |
|---|---|---|
| `入门` / `10分钟入门` | 浅讲、快速建立认知 | `1_概述-10分钟入门.md` |
| `全景` / `拆解` | 系统性覆盖、逐个拆开 | `2_参与方全景-9类角色拆解.md` |
| `链路` / `从X到Y` | 全流程覆盖、端到端 | `3_外卡支付链路-从授权到结算.md` |
| `深度` / `专题` | 单点深挖 | `6_3DS认证-深度.md` |
| `实战` / `踩坑` | 实操经验 | `7_端到端实战-中国卡在东南亚.md` |

**命名自检 3 问（每次起名必问自己）：**
1. **为什么写这篇？** → 名字要说清楚解决什么问题
2. **我是什么角色在写？** → 老师（入门）、架构师（全景）、实战者（踩坑）
3. **这名字合适吗？** → 一年后回来看，还能一眼知道里面讲什么

---

## 第三步：写之前先确认

**不管技术文章还是业务文章，AI 必须先输出确认清单，等用户点头再写全文。**

### 技术文章确认清单

```markdown
📋 写作确认清单
- 文章主题：[XXX]
- 文章类型：concept / problem / deep-dive
- 字数预估：[2k-5k]
- 需要哪些图：[流程图/架构图/时序图]
- 关联文章：[已有/计划中的]
```

### 业务文章确认清单

```markdown
📋 写作确认清单
- 文章主题：[XXX]
- 所属业务域：[国内支付/互联网金融信贷/跨境支付收单]
- 覆盖哪些维度：[术语/流程/架构/trade-off/数据模型...]
- 需要哪些图：[业务流程图/架构图/时序图/ER图]
- 预计篇幅：[3k-5k]
```

---

## 第四步：写文章

按对应模板的 section 骨架写：
- **技术文章**：6 步方法论（Why → 生态定位 → What → How → Why this way → What pitfall）
- **业务文章**：15 section（一句话定义 → 背景 → 术语 → 形态 → 流程 → 架构 → 对账 → trade-off → 数据模型 → 用例 → 打法 → 视角 → 技术架构 → 前景 → 总结）

**配图规范：** 见 `docs/conventions/images.md`

**Mermaid 图类型速查：**

| 场景 | Mermaid 类型 |
|---|---|
| 业务流程 | `flowchart TD/LR` |
| 交互时序 | `sequenceDiagram` |
| 系统架构 | `graph TD` |
| 数据模型 | `erDiagram` |
| 状态流转 | `stateDiagram-v2` |

---

## 第五步：验证

写完必须跑 **6 Loop 验证循环**（见 `docs/conventions/article-verification.md`）：

| Loop | 检查什么 |
|---|---|
| 1 | 完整性 — 章节齐全？图能看？ |
| 2 | 准确性 — 事实正确？代码能跑？ |
| 3 | **隐私** — 无公司名？无真实数据？ |
| 4 | 时效性 — 信息不过时？ |
| 5 | 结构 — 表达清晰？ |
| 6 | 价值 — 值得沉淀？ |

**Loop 3（隐私）必须 100% 通过才能 commit。**

---

## 第六步：记录

- 更新 `CHANGELOG.md`（写清楚新增/修改了什么）
- `git commit`（遵循 Conventional Commits）
- `npm run docs:build` 跑通 → push

---

## AI 速查卡

| 我要... | 看这个 |
|---|---|
| 写技术文章 | `docs/conventions/article-format.md` |
| 写业务文章 | `docs/conventions/biz-article-template.md` |
| 验证文章 | `docs/conventions/article-verification.md` |
| 配图 | `docs/conventions/images.md` |
| 定分类 | `docs/conventions/classification.md` |
| 看历史 | `CHANGELOG.md` |
| 跑命令 | 看下面 ↓ |

```bash
npm run x -- dev      # 本地预览 http://127.0.0.1:5175/programmer-knowledge-graph/
npm run x -- build    # 构建 + 验证
npm run x -- deploy "msg"  # build + commit + push
```
