---
title: "Schema Registry 与序列化治理"
type: concept
tags: [Kafka, Schema, Avro, 治理, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# Schema Registry 与序列化治理

> Avro/Protobuf Schema / 兼容性演进 / 注册表的作用——消息格式从「能跑」到「可演进」。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：裸 JSON 上生产的痛

- 字段改名/删除/类型变更的连锁故障
- 消费端反序列化失败的现场

### 2. 核心：Schema 与注册表

- Avro/Protobuf 基本心智
- schema id 随消息携带

### 3. 机制：兼容性演进

- BACKWARD/FORWARD/FULL 兼容级别
- 演进策略与发布顺序

### 4. 实践：Schema 治理落地

- 注册表选型（Confluent SR/自研）
- 信贷报文演进案例

### 5. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
