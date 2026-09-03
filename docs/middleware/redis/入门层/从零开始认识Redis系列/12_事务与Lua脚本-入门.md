---
title: "事务与 Lua 脚本"
type: concept
tags: [Redis, 事务, Lua, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# 事务与 Lua 脚本

> MULTI/EXEC/WATCH / Lua 原子性边界——Redis 没有传统事务，但有原子性保证。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：命令级原子 vs 事务级原子

- 单命令原子
- 多命令组合的原子需求

### 2. 核心：MULTI/EXEC/WATCH

- 队列执行与错误处理
- WATCH 乐观锁与 CAS

### 3. 机制：Lua 脚本

- EVAL 与原子执行
- 脚本 vs 事务的边界

### 4. 实践：原子场景落地

- 扣库存/防超卖
- Lua 的滥用警告

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
