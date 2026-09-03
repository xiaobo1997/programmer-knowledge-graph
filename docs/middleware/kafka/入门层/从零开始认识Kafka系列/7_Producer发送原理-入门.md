---
title: "Producer 发送原理"
type: concept
tags: [Kafka, Producer, 发送链路, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# Producer 发送原理

> 异步发送链路：分区器 → 累加器 → Sender 线程——理解为什么 send() 立即返回却不代表送达。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：send 是异步的

- send() 返回 Future 的真实语义
- 回调 vs Future 两种拿结果方式

### 2. 核心：发送链路三段

- 拦截器/序列化器/分区器
- RecordAccumulator 攒批 + Sender 线程发网络

### 3. 机制：批量与缓冲参数

- batch.size / linger.ms / buffer.memory
- 攒批收益与延迟代价的权衡

### 4. 实践：发送端配置基线

- 重试与超时的关系（8 篇衔接）
- 常见坑：发送失败静默丢失的写法

### 5. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
