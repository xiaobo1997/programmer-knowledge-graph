---
title: AQS 源码走读与 ReentrantLock
type: deep-dive
tags: [Java, 并发, AQS, ReentrantLock, 源码, L2特性层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# AQS 源码走读与 ReentrantLock

> CLH 变体队列 + state 状态位：AQS 是 JUC 半壁江山的骨架，读透它 ReentrantLock/CountDownLatch/Semaphore 全通。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：JUC 锁的公共骨架
- 入门 22 结论的源码落地
- 哪些类建立在 AQS 上

### 2. AQS 骨架：state + 队列
- volatile state 的意义
- CLH 变体双向队列与 Node 状态

### 3. acquire / release 模板
- acquireQueued 自旋与 park
- release 唤醒后继

### 4. ReentrantLock 实现
- 公平/非公平的 tryAcquire 差异
- 可重入计数与锁释放

### 5. Condition 条件队列
- await/signal 与条件队列
- 与 synchronized wait/notify 对照

### 6. 使用抉择
- ReentrantLock vs synchronized 场景
- 中断/超时/多条件的能力差

### 7. 速记卡 + 下篇预告
- AQS 状态流转速记
- 预告 ThreadPoolExecutor 也复用 AQS
