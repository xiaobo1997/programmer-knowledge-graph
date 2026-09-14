---
title: 从零实现事件总线 Demo
type: overview
tags: [系列规划, overview]
date: 2026-09-10
wordCount: 638
readMinutes: 2
aside: false
---

# 从零实现事件总线 Demo

> 整合层 Demo：从零实现最小事件总线（发布-订阅-幂等消费-死信），约 400 行可运行。

```mermaid
graph TD
    EV[事件 schema v1] --> EV2[schema v2 加可选字段<br/>向后兼容]
    EV --> EV3[schema v3 改字段语义<br/>破坏性: 需新 topic/双写期]
    EV2 --> OK[订阅者无感升级]
    EV3 --> R[订阅者逐个适配]
```

```mermaid
graph LR
    subgraph Demo验证三断言
    A1[重复投递x3 只消费一次]
    A2[处理失败x3 进死信]
    A3[死信补偿后平账关单]
    end
    A1 & A2 & A3 --> OK[部署验收通过]
```

## 一句话摘要

Demo 五模块：事件模型（schema 版本化）、总线（通道抽象）、订阅管理、幂等消费、死信与补偿——机制与语言无关，验证标准是「重复投递三次只消费一次 + 死信可补偿」。

```mermaid
graph LR
    P[Publisher] --> BUS[EventBus]
    BUS --> S1[Subscriber 幂等表]
    BUS --> S2[Subscriber 幂等表]
    S1 & S2 -->|失败x3| DLQ[死信]
    DLQ --> CP[补偿任务]
```

```mermaid
graph TD
    T[量级三档] --> A[Demo: 内存通道]
    T --> B[千万: Kafka 分区]
    T --> C[亿级: 流式+schema registry]
```

## 篇目规划（L1-L4，ADR-0012 方向=子目录）

| 篇目/层 |
|---|
| Demo 主篇 · 最小事件总线（步骤/代码/验证/三档 roadmap） · ⏳ 待写 |
## 篇目状态

| 篇目 | 状态 |
|---|---|
| Demo 主篇 | ⏳ 待写（按 ADR-0012 工程级） |



**机制定位与取舍**：本方向的每个机制（原理与底层实现）都在篇目里锚定了位置——规划期的取舍是「机制原理优先于操作罗列」，代价是入门读者需要更多耐心，收益是后续每篇的参数与步骤都有原理可归因；架构上各层互为上下游，边界由「机制讲透」与「操作可执行」这条线划分。

```mermaid
classDiagram
    class Event {
        +String id
        +String type
        +int version
        +String payload
    }
    class EventBus {
        +publish(event)
        +subscribe(type, handler)
    }
    class IdempotentHandler {
        +Set consumed
        +handle(event) 首见处理 重复跳过
    }
    EventBus --> Event : 载体
    EventBus --> IdempotentHandler : 分发
```

## 演进视角

从自研总线到标准中间件：Demo 的通道抽象在生产替换为 Kafka/Pulsar——机制不变（幂等/死信/补偿），形态随量级升级。

## 📌 数据与事实声明

- 本文件为方向骨架规划（篇目标注 ⏳ 待写 / ✅ 已落地），依据 ADR-0012 工程级深度标准与 4 层架构规范；量级与参数数字均为行业认知量级，落篇时以实测替换。

## 📚 参考资料

- 特性层《深入理解事件机制系列》、Kafka 官方文档。
