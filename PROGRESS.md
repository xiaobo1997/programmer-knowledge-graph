# PROGRESS.md · 全局进度追踪

> **公开产物 ②**：PROGRESS.md = 专题全貌 + 方法论 + 当前进度。Commit 到远程。
> **与之对应**：CHANGELOG.md = 进度快照（单次变更的 why）。
> **私有产物**：`_internal/` = 跨大模型一致性 SOP（不 commit）。

---

## 当前进度（2026-08-11）

### RocketMQ（4 层完成 ✅）

```
L1 入门层（11 篇全景）✅ 从零开始认识RocketMQ系列/
L2 特性层（11 篇 deep-dive）✅ 深入理解RocketMQ特性系列/
L3 专题层（14 篇专题）✅
  ├─ Topic隔离深度（7 篇）
  ├─ 事务消息深度（5 篇）
  └─ 生产配置深度（2 篇）
L4 整合层（3 篇全景）✅ 稳定性体系深度/
```

### AI（4 层启动中 🚧）

```
L1 入门层（11 篇全景）🚧 从零开始认识AI系列/
  ├─ ✅ 篇 0 系列导读-全景（本文 + 5 层概念地图）
  └─ 📝 篇 1-11 待续
L2 特性层（11 篇 deep-dive）📝 待启动
L3 专题层（4-7 篇）📝 待启动
  ├─ MCP协议深度/
  ├─ RAG工程化深度/
  ├─ Multi-Agent协同深度/
  └─ Harness深度/
L4 整合层（1-3 篇决策）📝 待启动
  └─ AI工具选型决策/
```

### AI 资料源（4 个指定仓库）

| 仓库 | 用途 |
|---|---|
| datawhalechina/Agent-Learning-Hub | 中文系统学习路线图 |
| shareAI-lab/learn-claude-code | 从 0 写一个 agent |
| Picrew/awesome-agent-harness | 分类齐全的 awesome list |
| awslabs/mcp | AWS 官方 MCP server 集合 |

---

## AI L1 入门层篇目规划（11 篇）

| # | 标题 | 状态 | 备注 |
|---|---|---|---|
| 0 | 系列导读 · AI 是什么到 Agent 工程化全景 | ✅ | 已完成（6203 字） |
| 1 | 什么是 LLM | 📝 | LLM 基础 + 能力边界 |
| 2 | 为什么需要 Agent | 📝 | LLM 缺什么 → 为什么要有 Agent |
| 3 | Agent 生态与版图 | 📝 | 8 大角色 + 5 大框架 |
| 4 | Agent 核心架构 | 📝 | Loop / Tool / Memory 三件套 |
| 5 | Tool 与 Loop 基础 | 📝 | Function Call 实现细节 |
| 6 | Prompt 与 Context | 📝 | 提示工程 + Context Engineering |
| 7 | Harness 是什么 | 📝 | 从模型到生产的所有基础设施 |
| 8 | MCP 协议与生态 | 📝 | USB-C 标准化工具接入 |
| 9 | 多 Agent 与 Subagent | 📝 | 何时用 / 何时不用 |
| 10 | RAG 与 Memory | 📝 | 检索增强 + 长短期记忆 |
| 11 | 收官与能力地图 | 📝 | 5 年演进 + 选型决策 |

---

## 工作流原则

1. **每篇必须有"目录实践"小节**：公开仓库 + 自研小工具 + 公开数据集
2. **持续更新机制**：用户学到新名词 → 同步更新对应文章 → 不另开文件
3. **6 Loop 强校验**：commit 前必跑（新旧文件不区分）
4. **边界纪律**：不暴露公司 / 真实数据 / P7+ 画像标签
5. **方法论沿用 RocketMQ SOP**：4 层目录 + 9 锚点 + 决策树 + 画像锚点

---

## 待续任务

- [ ] L1 篇 1-11 待续（按用户节奏推进）
- [ ] L2 特性层 11 篇 deep-dive 待启动
- [ ] L3 专题层 4-7 篇待启动
- [ ] L4 整合层 1-3 篇待启动

---

> 最后更新：2026-08-11（篇 0 完成）
> 维护者：Hermes (MiniMax-M3)