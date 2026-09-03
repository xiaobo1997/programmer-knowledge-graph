---
title: "Kafka Connect：数据集成"
type: concept
tags: [Kafka, Connect, 数据集成, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# Kafka Connect：数据集成

> source/sink 连接器 / 单机与分布式模式 / 常用连接器——把外部系统接进 Kafka 的官方管道。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：数据集成是 Kafka 的第二曲线

- 为什么需要 Connect（避免自写采集）
- 与 Flume/自研的对比

### 2. 核心：连接器模型

- source 连接器（入）与 sink 连接器（出）
- task 并行度与 offset 管理

### 3. 机制：运行模式

- standalone vs distributed
- REST API 管理连接器

### 4. 实践：常用连接器场景

- JDBC / Debezium CDC / ES sink
- 信贷对账取数的 Connect 玩法

### 5. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
