---
title: "副本机制与 ISR"
type: concept
tags: [Kafka, 副本, ISR, 高可用, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# 副本机制与 ISR

> leader/follower / ISR 收缩扩张 / HW-LEO——数据不丢的存储侧保证，ack=all 的真相。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：副本因子决定冗余

- replication.factor 与机架感知
- 副本 = 存储单元的高可用化身

### 2. 核心：ISR 机制

- ISR 是与 leader 保持同步的副本集合
- ISR 收缩（落后踢出）与扩张

### 3. 机制：HW 与 LEO

- LEO=分区日志末端 / HW=已提交水位
- 为什么 acks=all + min.insync 才不丢

### 4. 实践：副本参数与故障直觉

- min.insync.replicas 配置
- 14 篇（选举）衔接

### 5. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
