---
title: "Kafka 是什么与生态全景"
type: concept
tags: [Kafka, 认知, 生态, L1入门层]
date: 2026-09-03
wordCount: 271
readMinutes: 1
---

# Kafka 是什么与生态全景

> 事件流平台定位 / 与消息队列的本质差异 / 生态全景（Broker+Connect+Streams+Schema）——先回答 Kafka 是什么、为什么而设计。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：从 LinkedIn 日志系统到 Apache 顶级项目

- 诞生背景与设计目标（高吞吐/可重放/水平扩展）
- 与 RocketMQ 同源不同路（22 篇选型展开）

### 2. 核心：事件流平台的定位

- 消息队列 vs 日志系统 vs 事件流平台
- 可重放/有序分区/保留策略带来的本质差异

### 3. 机制：Kafka 生态全景

- Broker 集群为核心 / Connect 数据集成 / Streams 流处理 / Schema 治理
- 客户端语言矩阵（Java 为主）

### 4. 实践：用 Kafka 的边界

- 什么场景适合 / 什么场景别用（小流量/强一致/复杂路由）
- 与 Redis Stream / RocketMQ 的第一印象对比

### 5. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
