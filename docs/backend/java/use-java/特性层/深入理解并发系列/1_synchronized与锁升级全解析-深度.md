---
title: synchronized 与锁升级全解析
type: deep-dive
tags: [Java, 并发, synchronized, 锁升级, L2特性层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# synchronized 与锁升级全解析

> 从对象头到重量级 monitor：synchronized 的锁升级路径是理解 JVM 并发设计的钥匙。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：为什么 synchronized 值得深挖
- 入门 20 结论的底层机制
- 现代 JDK 还在持续优化它

### 2. 对象头与 mark word
- 32/64 位下的 mark word 布局
- 锁状态与 mark word 的映射

### 3. monitor 与可重入
- ObjectMonitor 结构（JVM 侧）
- 可重入计数与 wait/notify 关联

### 4. 偏向→轻量→重量升级路径
- 偏向锁的获取与撤销
- 轻量锁 CAS 自旋
- 重量级锁阻塞
- 历史视角：偏向锁废弃（JDK15 JEP374）

### 5. 锁消除与锁粗化
- 逃逸分析驱动的锁消除
- JIT 的锁粗化优化

### 6. 与 ReentrantLock 对比铺垫
- 功能差异速览
- 下篇 AQS 的引入

### 7. 速记卡
- 对象头状态机一张图收束
