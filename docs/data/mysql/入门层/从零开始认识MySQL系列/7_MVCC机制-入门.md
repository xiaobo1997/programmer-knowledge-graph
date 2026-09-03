---
title: "MVCC 机制"
type: concept
tags: [MySQL, MVCC, ReadView, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# MVCC 机制

> 版本链、ReadView、快照读/当前读——可重复读的实现秘密。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：不加锁的读

- 读写互不阻塞的诉求
- MVCC 的定位（是怎样运行的）

### 2. 核心：undo 版本链

- 每行记录的 trx_id/roll_pointer
- 多版本数据的组织

### 3. 机制：ReadView 与可见性

- ReadView 四字段与可见性算法
- RR vs RC 下 ReadView 创建时机

### 4. 实践：MVCC 工程视角

- 快照读与当前读的区别场景
- MVCC 与锁的配合（8 篇衔接）

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
