---
title: OOM 案例与内存泄漏排查实战
type: deep-dive
tags: [Java, JVM, OOM, 内存泄漏, 排障, L3专题层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# OOM 案例与内存泄漏排查实战

> OOM 不是终点而是起点：堆转储、分析工具与常见泄漏模式的完整排查路径。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：OOM 的种类与表象
- Heap/GC overhead/Metaspace/Direct memory 等 OOM 长相
- 报错信息到排查方向的映射

### 2. 堆转储获取
- jmap 与 -XX:+HeapDumpOnOutOfMemoryError
- 生产环境安全转储的注意点

### 3. 分析工具链
- MAT 的 Leak Suspects 与支配树
- jhat/JProfiler/Arthas 的取舍

### 4. 常见泄漏模式
- 静态集合持有 / 未关闭资源 / ThreadLocal 误用 / 缓存无界
- 每种模式的堆栈特征

### 5. 案例复盘
- 一个典型泄漏从报警到定位的完整过程
- 对象引用链如何指认根因

### 6. 预防与监控
- 容器内存 vs 堆内存的配置陷阱
- 指标告警与定期巡检

### 7. 速记卡
- OOM→工具→定位流程一张图收束
