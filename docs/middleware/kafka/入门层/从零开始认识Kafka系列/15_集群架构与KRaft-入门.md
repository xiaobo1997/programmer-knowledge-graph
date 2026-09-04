---
title: "集群架构与 KRaft"
type: concept
tags: [Kafka, 集群, KRaft, 控制器, L1入门层]
date: 2026-09-03
wordCount: 201
readMinutes: 1
---

# 集群架构与 KRaft

> broker 集群 / controller 职责 / ZooKeeper → KRaft 演进——集群的「大脑」怎么管元数据。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：集群不是一堆 broker 的简单相加

- 元数据（topic/分区/配置）谁来管
- controller 单点职责（分配/选举）

### 2. 核心：ZooKeeper 时代回顾

- ZK 存元数据 / controller 抢主
- ZK 的运维负担

### 3. 机制：KRaft 取代 ZK

- 元数据日志 + quorum 控制器
- Raft 协议直觉 / 版本演进（23 篇展开）

### 4. 实践：集群形态选型

- KRaft 模式部署要点
- 与 3.x/4.x 版本的关系（待核实）

### 5. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
