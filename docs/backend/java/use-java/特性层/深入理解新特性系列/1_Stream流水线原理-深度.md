---
title: Stream 流水线原理：从惰性求值到并行流
type: deep-dive
tags: [Java, Stream, 函数式, L2特性层]
date: 2026-09-03
wordCount: 259
readMinutes: 1
---

# Stream 流水线原理：从惰性求值到并行流

> 一句 .filter().map().collect() 背后：ReferencePipeline 的 Sink 链、惰性求值与并行流的分治实现。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：从会用 Stream 到懂流水线
- 入门 37 的结论层回顾
- 性能质疑的真相：流水线开销在哪

### 2. 惰性求值与中间操作
- 中间操作不立即执行
- 无状态 vs 有状态操作的执行差异

### 3. Sink 链与 ReferencePipeline
- 每个中间操作如何包装 Sink
- 终端操作如何触发整条链

### 4. 短路操作
- limit/findFirst 如何提前终止
- 短路对无限流的支撑

### 5. 并行流 Spliterator 实现
- ForkJoin 分治与 trySplit
- 什么时候并行真的更快

### 6. 性能真相与使用边界
- 装箱/分配/循环展开的代价
- 小数据集与复杂对象的实测直觉

### 7. 速记卡
- 流水线执行时序一张图收束
