---
title: "Kafka 可靠性演进之路"
type: deep-dive
tags: [Kafka, 可靠性, 演进, 整合, L4整合层]
date: 2026-09-03
wordCount: 182
readMinutes: 1
---

# Kafka 可靠性演进之路

> at-most-once → at-least-once → exactly-once / ZooKeeper → KRaft——一条主线看 Kafka 的可靠性哲学演进。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 投递语义演进

- 三种语义的代价曲线 / 幂等与事务的边界 / 端到端恰好一次的真相

### 2. 架构演进

- 单机 → 集群（ZK）→ KRaft / 控制器演进 / 元数据管理变革

### 3. 生态与选型收束

- 生态组件如何增强可靠性 / 与 RocketMQ 路线的差异 / 可靠性方法论收束

### 4. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
