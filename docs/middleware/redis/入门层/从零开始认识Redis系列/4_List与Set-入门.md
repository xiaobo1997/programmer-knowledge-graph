---
title: "List 与 Set"
type: concept
tags: [Redis, 数据结构, List, Set, L1入门层]
date: 2026-09-03
wordCount: 190
readMinutes: 1
---

# List 与 Set

> quicklist/intset 初识 + 队列/去重/抽奖场景——List 做消息队列雏形、Set 做去重与集合运算。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：线性与集合结构

- List 的双端队列语义
- Set 的无序去重语义

### 2. 核心：List 命令与场景

- LPUSH/RPUSH/LPOP/阻塞版本 BLPop
- 队列、栈、最新列表

### 3. 机制：Set 命令与场景

- SADD/SISMEMBER/交集并集差集
- 抽奖、去重、关注关系

### 4. 实践：选型与注意

- List 做队列 vs Stream（14 篇衔接）
- Set 大成员数的内存注意

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
