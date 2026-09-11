---
title: "消费模型与 Offset"
type: concept
tags: [Kafka, Consumer, Offset, L1入门层]
date: 2026-09-03
wordCount: 205
readMinutes: 1
---

# 消费模型与 Offset

> pull 模型 / poll 循环 / offset 提交（自动 vs 手动）——消费端最容易出事故的地基概念。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：为什么 Kafka 用拉模式

- pull vs push / 消费速度自控
- broker 无状态，offset 归消费者管

### 2. 核心：poll 循环与心跳

- poll 的阻塞语义 / max.poll.interval
- subscribe vs assign 两种订阅

### 3. 机制：offset 提交

- 自动提交的丢/重窗口
- commitSync vs commitAsync / 提交位置

### 4. 实践：消费端事故地图

- 重复消费 / 消息积压的第一性原理
- 12 篇（消费可靠性）衔接

### 5. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
