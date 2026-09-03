---
title: "String 与 Hash"
type: concept
tags: [Redis, 数据结构, String, Hash, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# String 与 Hash

> SDS/dict 初识 + 缓存/计数/对象场景——最常用的两个类型，编码细节留特性层。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：String 是万金油

- 缓存/计数/分布式锁载体
- String 的底层 SDS 直觉

### 2. 核心：String 命令与场景

- SET/GET/INCR/EXPIRE
- 缓存、计数器、限流场景

### 3. 机制：Hash 与对象存储

- HSET/HGETALL/字段过期问题
- 对象序列化 vs Hash 的选择

### 4. 实践：类型选型

- String vs Hash 存对象
- 大 key 隐患初识（11 篇展开）

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
