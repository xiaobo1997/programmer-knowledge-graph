---
title: ThreadPoolExecutor 源码走读
type: deep-dive
tags: [Java, 并发, 线程池, ThreadPoolExecutor, 源码, L2特性层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# ThreadPoolExecutor 源码走读

> execute 一行调用背后：ctl 状态机、Worker 生命周期、任务队列与拒绝策略的完整流水线。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：7 参数背后的执行模型
- 入门 25 结论的源码落地
- 线程池为什么难调优——先懂执行流

### 2. ctl 状态机
- 高 3 位状态 + 低 29 位线程数
- RUNNING→SHUTDOWN→STOP→TIDYING→TERMINATED

### 3. execute 三路分支
- 工作线程数 < core / 入队 / 新增至 max
- addWorker 的 double-check

### 4. Worker 与任务循环
- Worker 继承 AQS 的意义
- runWorker 与 getTask 循环

### 5. 线程回收与 keepAlive
- getTask 的超时阻塞与回收
- allowCoreThreadTimeOut

### 6. 拒绝策略落地
- 四种内置策略源码视角
- 自定义策略与业务兜底

### 7. 速记卡 + 调优预告
- 执行流一张图收束
- 预告专题层线程池调优实战
