---
title: "Kafka Streams：流处理"
type: concept
tags: [Kafka, Streams, 流处理, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# Kafka Streams：流处理

> KStream/KTable/GlobalKTable / 拓扑 DSL / 有状态处理直觉——不引入 Flink 也能做流处理。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：为什么要流处理库

- 库 vs 框架（嵌入应用内）
- 与 Flink/Spark Streaming 的定位差异

### 2. 核心：流-表二象性

- KStream=事件流 / KTable=最新值
- GlobalKTable=全量广播

### 3. 机制：拓扑与状态

- DSL 算子（map/filter/join/聚合）
- 状态存储与窗口

### 4. 实践：Streams 应用骨架

- 典型拓扑示例（风控规则/对账）
- 恰好一次配置（9/特性 5 衔接）

### 5. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
