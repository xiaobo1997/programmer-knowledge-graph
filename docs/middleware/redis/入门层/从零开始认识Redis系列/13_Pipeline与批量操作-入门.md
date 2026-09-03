---
title: "Pipeline 与批量操作"
type: concept
tags: [Redis, Pipeline, 性能, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# Pipeline 与批量操作

> RTT / 与 MGET / 与 Lua 对比——把 N 次往返压成 1 次的性能技巧。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：RTT 是隐形成本

- 网络往返 vs 命令执行
- 批量的三种姿势

### 2. 核心：Pipeline 机制

- 客户端批量发送/服务端批量回
- 注意：不保证原子

### 3. 机制：与 MGET/Lua 对比

- MGET 原生批量
- Lua 的原子批量
- Pipeline 的吞吐边界

### 4. 实践：客户端使用

- Jedis/Lettuce pipeline API
- 管道大小与内存权衡

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
