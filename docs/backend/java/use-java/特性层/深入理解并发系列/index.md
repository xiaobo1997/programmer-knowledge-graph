---
title: 深入理解并发系列（源码走读）
date: 2026-09-03
aside: false
wordCount: 475
readMinutes: 1
---

# 深入理解并发系列（源码走读）

> 并发三支柱逐层拆解：synchronized 的锁升级、AQS 的排队骨架、ThreadPoolExecutor 的执行流水线。
>
> **核心观点：** Java 并发不是散点 API——锁与线程池共享同一套「状态 + 等待队列」心智模型；AQS 是承上启下的轴，synchronized 与线程池在它两侧。

## 一、本子系列在 4 层架构中的位置

| 层 | 定位 | 本子系列位置 |
|---|---|---|
| L1 入门层 | 概念扫盲 + 会用 | [从零开始认识 Java 系列](../../入门层/从零开始认识Java系列/0_系列导读-全景)，篇 17-25 并发编程组 |
| **L2 特性层** ✅ | 每个机制 1 组源码走读 | **本子系列（3 篇）** |
| L3 专题层 | 横向组合拳 | [高并发编程实战](../../专题层/高并发编程实战/index) |
| L4 整合层 | 运行时性能演进 | Java 应用性能演进之路（规划中） |

## 二、篇目全景

| # | 标题 | 状态 | 核心议题 |
|---|---|---|---|
| 1 | [synchronized 与锁升级全解析](./1_synchronized与锁升级全解析-深度) | 📋 大纲已定 | monitor / 对象头 / 偏向→轻量→重量 / 锁消除锁粗化 |
| 2 | [AQS 源码走读与 ReentrantLock](./2_AQS源码走读与ReentrantLock-深度) | 📋 大纲已定 | CLH 变体 / acquire-release 模板 / condition 队列 / 公平性 |
| 3 | [ThreadPoolExecutor 源码走读](./3_ThreadPoolExecutor源码走读-深度) | 📋 大纲已定 | execute 流程 / ctl 状态位 / Worker 生命周期 / 拒绝策略 |

**主线：** synchronized 锁升级（JVM 侧）→ AQS 骨架（JUC 侧）→ ThreadPoolExecutor 执行流水线（应用侧）。

## 三、阅读建议

- 前置：入门 17-25（线程生命周期 / 协作 / JMM / synchronized / CAS / AQS / 工具类 / ThreadLocal / 线程池）
- 顺序：1 → 2 → 3（JVM 锁 → JUC 锁 → 线程池）
- 对照源码：JDK 17（synchronized 需结合 JVM 源码/HotSpot；AQS 与 TPE 在 JDK 源码内）
- 关联：专题层「高并发编程实战」把本系列能力用于调优与改造
