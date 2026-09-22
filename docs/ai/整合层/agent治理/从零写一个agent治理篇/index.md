---
title: "从零写一个 agent：治理篇——风控 agent + 客服 agent 治理实践"
type: overview
tags: [AI, Agent, 治理, 整合层, L4-Demo]
date: 2026-09
wordCount: 6000
readMinutes: 19
---

# 从零写一个 agent：治理篇

> **系列**：从零写一个 agent · 治理篇（整合层高阶）
> **目标**：把特性层「Agent 安全治理」的 6 层政策栈 + OWASP ASI，用到风控 agent + 客服 agent 的实战中
> **前置**：特性层篇 9《Agent 安全治理》+ 篇 10《权限设计与人机协作决策树》+ 风控 agent 系列 + 客服 agent 系列
> **核心命题**：agent 治理不是「加个 sandbox 就完事」——6 层协同 + 业务场景落地

---

## 📋 写作确认清单

**文章主题**：从零写一个 agent：治理篇
**所属分类**：docs/ai/整合层/agent治理/
**工程名（代码）**：agent-governance-practice
**结果类型**：治理实践文档（不是代码 demo）
**业务场景**：风控 agent + 客服 agent 的治理实践
**目标读者**：做了风控/客服 agent 的工程师，需要治理方案
**参考对象**：
- 业务方向对齐风控系统 + 客服系统
- 理论对齐特性层篇 9 + 篇 10
- 生态全景参考 OWASP ASI + NVIDIA NeMo-Guardrails

**需要哪些图**：
- [ ] Mermaid 6 层政策栈全景图
- [ ] Mermaid 风控 agent 治理架构图
- [ ] Mermaid 客服 agent 治理架构图
- [ ] Mermaid HITL 决策树
- [ ] Mermaid 权限分级图（L0-L3）
- [ ] Mermaid 审计日志流程图
- [ ] Mermaid 威胁地图（OWASP ASI Top 10）
- [ ] Mermaid 反模式对比图

**预计篇幅**：10000-15000 字（治理专题），重点 §3 治理架构 + §5 反模式写深 4000+

---

## 📋 H2 大纲（10 段 + §10）

### §1 为什么写（治理为什么重要）
agent 治理是上线前的硬性门槛——不是「加个 sandbox 就完事」

### §2 6 层政策栈全景（治理理论）
L1 权限 ladder → L2 预工具 hook → L3 OS sandbox → L4 HITL → L5 MCP token → L6 OWASP ASI

### §3 风控 agent 治理架构（治理实践）
6 层政策栈在风控 agent 里的落地——每层怎么配、怎么检查

### §4 客服 agent 治理架构（治理实践）
6 层政策栈在客服 agent 里的落地——每层怎么配、怎么检查

### §5 反模式 + 真实代价（避坑）
4 大反模式 + 真实代价 + 正确做法

### §6 权限分级 + HITL 决策树（风控 + 客服）
L0-L3 映射 + HITL 矩阵 + 降级方法

### §7 审计日志 + 可观测（治理落地）
Trace + 日志 + 安全指标

### §8 评估 + 演练（治理验证）
Eval + 红队演练 + 季度审计

### §9 数据与事实声明 + 参考资料
star 数有来源 + 日期

### §10 Trade-off 与生产演进
5 维（安全 vs 可用性 / 合规 vs 创新 / 审计 vs 效率 / 可解释性 vs 性能 / 实时 vs 准实时）

---

## 📚 学习路线（先理解门道，再写代码）

> 治理不是写代码，是设计机制——先理解机制，再落地实践。

| 阶段 | 搞懂的问题 | 对应章节 |
|---|---|---|
| ① 理论 | 6 层政策栈是什么？怎么协同？ | §2 |
| ② 风控治理 | 风控 agent 每层怎么配？ | §3 |
| ③ 客服治理 | 客服 agent 每层怎么配？ | §4 |
| ④ 避坑 | 4 大反模式 + 真实代价 | §5 |
| ⑤ 权限 | L0-L3 + HITL 决策树 | §6 |
| ⑥ 审计 | Trace + 日志 + 指标 | §7 |
| ⑦ 验证 | Eval + 红队 + 审计 | §8 |
| ⑧ trade-off | 5 维决策 | §10 |

**先理解的核心概念（每个都要能用自己的话讲出来）**：
- [ ] 6 层政策栈（权限 ladder / 预工具 hook / OS sandbox / HITL / MCP token / OWASP ASI）
- [ ] 风控 agent 治理架构（6 层在风控里的落地）
- [ ] 客服 agent 治理架构（6 层在客服里的落地）
- [ ] 4 大反模式 + 真实代价
- [ ] L0-L3 + HITL 决策树
- [ ] 审计日志 + 可观测
- [ ] Eval + 红队演练
- [ ] 5 维 trade-off

---

## 关联文档

- 理论源 → 特性层篇 9《Agent 安全治理》+ 篇 10《权限设计与人机协作决策树》
- 实践源 → 风控 agent 系列 + 客服 agent 系列
- 四件套（需求/specs/实施计划/交付报告）→ code-example/agent/agent-governance-practice/
- 9 段模板 → docs/conventions/project-demo-template.md