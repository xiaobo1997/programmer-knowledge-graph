---
title: 中间件 · Sentinel 流控防护
aside: false
wordCount: 873
readMinutes: 3
---

# 中间件 · Sentinel 流控防护

> Sentinel 是面向云原生微服务的高可用流控防护组件。学「限流熔断」最容易犯的错是把「机制」和「组件」混在一起：为什么限流要用滑动窗口、熔断器为什么要有半开态，这些**跨实现机制**在架构域的「稳定性工程」系列讲；本系列专注 **Sentinel 这个组件本身**——它的规则体系、实现手法和生产落地。

## 一、这个系列怎么读

按 4 层架构组织，每层可独立进入：

```
L1 入门层：Sentinel 是什么 + 规则体系 + 接入（概念入门，机制 tips 点到组件）
L2 特性层：核心实现深挖（流控算法 / 熔断器 / 扩展机制）
L3 专题层：跨特性专题（规则持久化推送 / 大促防护治理）
L4 整合层：防护全景演进 + 框架选型决策 + 接入实战
```

## 二、4 层目录全景

```
docs/middleware/sentinel/
├── index.md                          ← 你正在看的（导航 + 写作清单）
├── 入门层/从零开始认识Sentinel系列/     ← 0 导读 + 7 篇
├── 特性层/
│   ├── 深入理解流控算法系列/
│   ├── 深入理解熔断器实现系列/
│   └── 深入理解扩展机制系列/
├── 专题层/
│   ├── 规则持久化与动态推送深度/
│   └── 大促防护与热点治理深度/
└── 整合层/
    ├── Sentinel高可用防护全景-深度/
    └── 代码接入/
```

## 三、写作清单

### 入门层（0 导读 + 7 篇）

| # | 题目 | 状态 |
|:--:|------|:---:|
| 0 | 系列导读-全景 | ✅ |
| 1 | Sentinel 是什么与定位 | ✅ |
| 2 | 核心概念与心智模型 | ✅ |
| 3 | 流控规则 | ⏳ |
| 4 | 熔断降级与系统自适应保护 | ⏳ |
| 5 | 热点参数与访问控制规则 | ⏳ |
| 6 | 接入实战与 Dashboard | ⏳ |
| 7 | 版本演进与生态 | ⏳ |

### 特性层（3 个子系列，deep-dive）

- 深入理解流控算法系列：滑动窗口 / 预热与匀速排队 / 集群流控 Token Server
- 深入理解熔断器实现系列：状态机与探测 / 异常统计 / 与 Resilience4j 对比
- 深入理解扩展机制系列：Slot 责任链与 SPI / 自定义 Slot / 指标统计结构

### 专题层（2 个专题）

- 规则持久化与动态推送深度：Pull vs Push / 数据源实现 / 生产推送选型
- 大促防护与热点治理深度：大促限流预案 / 热点参数实战 / 系统自适应兜底

### 整合层

- Sentinel 高可用防护全景-深度（演进叙事 + Sentinel vs Resilience4j vs Hystrix 选型决策树）
- 代码接入（Spring Boot + Dashboard 端到端接入实战）

## 四、与相邻系列的关系

- **architecture/service-governance/stability**：限流/熔断/降级的**机制**正式定义篇在那边——本系列机制概念级带过 + tips 互指，只讲 Sentinel 怎么实现
- **architecture/service-governance/gateway**：网关抽象机制在那边；Sentinel 网关流控作为组件能力在专题层讲

## 📌 数据与事实声明

- 版本基线：本系列规划写于 2026-09，对标 Sentinel 1.8.10（2026-05-21 发布，2026-09-08 gh CLI 实测）
- 时效性：版本与 star 数据已实测；若上游发布 2.x，写正文前需复核官方 Wiki 兼容表
- 免责：具体配置项与默认值以官方 Wiki 为准

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 官方 Wiki | Sentinel Wiki | github.com/alibaba/Sentinel/wiki |
| 官方源码 | alibaba/Sentinel | github.com/alibaba/Sentinel |
| 生态 | Spring Cloud Alibaba | github.com/alibaba/spring-cloud-alibaba |
