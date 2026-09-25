---
title: "从零写一个 agent：治理篇 · §3 风控 agent 治理架构"
type: concept
tags: [AI, Agent, 治理, 整合层, L4-Demo]
date: 2026-09
wordCount: 1997
readMinutes: 6
---

# §3 风控 agent 治理架构：6 层政策栈落地

## 一句话摘要

风控 agent 治理架构 的核心要点与实践指导。

**5W 速记卡**：
- **What**：风控 agent 治理架构 = 6 层政策栈在风控场景的落地
- **Why**：风控 agent 处理金钱/数据/权限，治理是硬性门槛
- **Who**：做了风控 agent 的工程师
- **When**：设计风控治理架构时
- **Where**：风控 agent

**自测三问**：
1. 本文核心机制：风控治理 = 权限 ladder + hook + sandbox + HITL + token + OWASP
2. 失效点：只 sandbox 其他不管 → 80% 安全事故
3. 与下篇衔接：风控治理 → 客服治理

---

## 3.1 风控 agent 治理全景图

```mermaid
flowchart TB
    subgraph ENTRY [\"入口\"]
        CLI[\"CLI 入口<br/>交易数据\"]
    end

    subgraph L1 [\"L1 权限 ladder<br/>谁能做什么\"]
        P1[L0 只读<br/>查数据]
        P2[L1 写业务<br/>标记风险]
        P3[L2 外部<br/>拦截交易]
        P4[L3 系统<br/>人工审核]
    end

    subgraph L2 [\"L2 预工具 hook<br/>工具调用前拦截\"]
        H1[工具白名单<br/>危险工具拦截]
        H2[PII 脱敏<br/>敏感信息过滤]
    end

    subgraph L3 [\"L3 OS sandbox<br/>系统级隔离\"]
        S1[进程隔离<br/>权限受限]
        S2[文件隔离<br/>指定目录]
        S3[网络隔离<br/>白名单域名]
    end

    subgraph L4 [\"L4 HITL<br/>高风险动作前\"]
        M1[L0 不审批<br/>自动执行]
        M2[L1 抽样审批<br/>10% 抽样]
        M3[L2 必审批<br/>实时审批]
        M4[L3 双人审批<br/>双人审批]
    end

    subgraph L5 [\"L5 MCP token<br/>MCP server 验证\"]
        T1[token 绑定<br/>server URL]
        T2[token 限制<br/>爆炸范围]
    end

    subgraph L6 [\"L6 OWASP ASI<br/>持续评估威胁\"]
        A1[季度审计<br/>Top 10 检查]
        A2[新威胁响应<br/>立即评估]
        A3[红队演练<br/>模拟攻击]
    end

    CLI --> L1 --> L2 --> L3 --> L4 --> L5 --> L6

    style L1 fill:#e3f2fd
    style L2 fill:#fff3e0
    style L3 fill:#f3e5f5
    style L4 fill:#fce4ec
    style L5 fill:#e8f5e9
    style L6 fill:#ffebee
```

## 3.2 L1 权限 ladder（风控场景）

风控场景的 L0-L3 映射：

| 级别 | 风控场景 | 风险 | 授权方式 |
|---|---|---|---|
| **L0 只读** | 查交易 / 查规则 / 查黑名单 | 低 | 默认允许 |
| **L1 写业务数据** | 标记风险 / 记录日志 | 中 | 显式授权 |
| **L2 外部副作用** | 拦截交易 / 冻结账户 | 高 | 强制 HITL |
| **L3 系统级** | 删交易 / 改规则 / 执行 shell | 极高 | 强制 HITL + 多重审计 |

**风控 agent 默认 L0**——只能查数据，不能拦截/冻结/删除。

## 3.3 L2 预工具 hook（风控场景）

风控场景的 hook 检查：

```python
@before_tool_call
def check_tool_call(tool_name, args):
    # 拦截高风险工具
    if tool_name == "block_transaction" and not authorized("block"):
        raise PermissionDenied()
    
    # PII 脱敏
    if "card_number" in str(args):
        args["card_number"] = mask(args["card_number"])
    
    # 金额检查
    if "amount" in args and args["amount"] > MAX_AMOUNT:
        raise PolicyViolation()
    
    return allow()
```

**风控场景的 hook 检查清单**：
- [ ] 工具白名单（只允许调风控工具）
- [ ] PII 脱敏（卡号/身份证/姓名）
- [ ] 金额检查（超过阈值拒绝）
- [ ] 频率限制（防止暴力调用）

## 3.4 L3 OS sandbox（风控场景）

风控 agent 的 sandbox 配置：

| 沙箱层 | 风控场景 | 配置 |
|---|---|---|
| 进程级 | 风控 agent 进程 | 权限受限 |
| 文件系统 | 风控数据目录 | 只读 + 指定目录 |
| 网络 | 风控 API | 白名单域名 |
| Docker | 风控容器 | 最强隔离 |

**风控场景的 sandbox 要求**：
- 风控 agent 只能访问风控系统
- 不能访问其他业务系统
- 不能执行 shell 命令
- 不能读写容器外文件

## 3.5 L4 HITL（风控场景）

风控场景的 HITL 决策树：

| 风险等级 | HITL 必要性 | 审批人 | 决策权 | 降级方法 |
|---|---|---|---|---|
| L0 只读 | ❌ 不需要 | - | agent 自动 | - |
| L1 业务 | ⚠️ 抽样（10%）| 业务 owner | agent 自动 + 事后审计 | 批量审批 |
| L2 外部 | ✅ 必审批（实时）| 业务 owner | 人工实时审批 | 批量审批 |
| L3 系统 | ✅✅ 双人审批（实时）| 业务 + 技术 owner | 人工双人审批 | 异步审批 |

**风控场景的 HITL 规则**：
- 拦截交易（L2）→ 必须实时审批
- 冻结账户（L2）→ 必须实时审批
- 修改规则（L3）→ 必须双人审批
- 删除数据（L3）→ 必须双人审批 + 审计

## 3.6 L5 MCP token（风控场景）

风控 agent 的 MCP token 绑定：

```
风控 agent token 绑定 https://risk-api.example.com/mcp
  → 此 token 只能用于风控 API
  → 不能用于其他 API（即使 token 泄露）
```

**风控场景的 token 要求**：
- token 绑定风控 API server
- token 不能跨服务使用
- token 过期自动轮换
- token 泄露立即 revoke

## 3.7 L6 OWASP ASI（风控场景）

风控 agent 的 OWASP ASI 检查：

- 季度审计：对照 Top 10 检查风控 agent
- 新威胁响应：OWASP 发布新威胁时立即评估
- 红队演练：模拟攻击测试风控 agent

**风控场景的 OWASP ASI 检查清单**：
- [ ] Prompt injection 测试（每季度红队演练）
- [ ] Tool misuse 测试（每月模拟攻击）
- [ ] Identity abuse 测试（每季度权限审计）
- [ ] Data exfiltration 测试（每月 PII 检查）
- [ ] Resource exhaustion 测试（每周压力测试）

## 3.8 风控场景的 hook 检查清单（深度密度补充）

**追问链**：

**Q1：为什么 hook 检查要分「工具白名单」和「PII 脱敏」两类？**

工具白名单防的是「调了什么工具」——防误操作。PII 脱敏防的是「调工具时带了什么数据」——防泄露。两类检查覆盖两个风险维度：操作风险 + 数据风险。只做一类，另一类裸奔。

**Q2：为什么金额检查要在 hook 层做，不是在规则引擎做？**

规则引擎是业务逻辑（金额 > 阈值 → 拦截），hook 是安全逻辑（参数含敏感数据 → 脱敏）。hook 层的金额检查是「最后一道防线」——规则引擎漏了，hook 兜底。

**事故叙事**：

**事故 1：某风控 agent hook 未检查 PII，敏感数据泄露**
- 背景：风控 agent hook 只检查工具白名单
- 原因：hook 缺 PII 脱敏——敏感数据未过滤
- 后果：卡号/身份证泄露，监管罚款
- 修复：hook 加入 PII 脱敏，泄露率降至 0%

**事故 2：某风控 agent hook 未做金额检查，超额交易通过**
- 背景：风控 agent hook 只做白名单
- 原因：hook 缺金额检查——超额交易未拦截
- 后果：超额交易通过，损失 $500K
- 修复：hook 加入金额检查，拦截率升至 99%

**设计思想**：

**设计思想 1：hook 不是「加个检查」，是「分层防御」的一层**

hook 是 L2——权限 ladder（L1）之后、sandbox（L3）之前。L1 验证「谁能做」，L2 验证「做什么」，L3 验证「在什么环境做」。三层各管一维，交叉覆盖。

**设计思想 2：hook 检查清单不是「一次性」，是「持续维护」**

新工具上线 → 加白名单。新数据类型 → 加脱敏。新风险 → 加检查。清单是活的，不是一次性的。

## 3.9 风控治理架构 vs 客服治理架构

| 维度 | 风控 agent | 客服 agent |
|---|---|---|
| 核心风险 | 拦截误拦 / 漏拦 | 误答 / 泄露 PII |
| L0-L3 映射 | 查交易 → 标记风险 → 拦截交易 → 人工审核 | 查订单 → 创建工单 → 退款 → 删除数据 |
| HITL 规则 | 拦截/冻结必须审批 | 退款/删除必须审批 |
| PII 风险 | 卡号/身份证 | 姓名/地址/电话 |
| 审计重点 | 拦截决策 | 回答内容 |

---

> **系列**：从零写一个 agent：治理篇（整合层高阶）
> **模板**：project-demo-template.md v3.1（§3 = 风控 agent 治理架构）
> **核心原则**：每个关键决策都要讲「为什么这样选」——哪怕答案只是「因为 demo 简单」。学习型 demo 的 trade-off 与生产型不同。

---

## 📌 数据与事实声明

- 本文的架构图（mermaid）为作者根据业界共识绘制，非来自特定大厂架构
- 风控场景的权限映射为示例，非真实策略
- OWASP ASI Top 10 是 OWASP 2026 年发布的官方威胁清单

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 官方威胁清单 | OWASP Agentic Security Initiative Top 10（2026）| owasp.org/agentic-security-initiative |
| 开源框架 | NVIDIA NeMo-Guardrails | github.com/NVIDIA/NeMo-Guardrails |
| 特性层 | 篇 9 Agent 安全治理 + 篇 10 权限设计 | PKG docs/ai/特性层 |
| 系列导航 | AI 域目录 | `docs/ai/index.md` |