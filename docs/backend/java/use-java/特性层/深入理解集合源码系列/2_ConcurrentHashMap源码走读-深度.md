---
title: ConcurrentHashMap 源码走读：锁粒度与并发扩容
type: deep-dive
tags: [Java, 集合, ConcurrentHashMap, 源码, 并发, L2特性层]
date: 2026-09-03
wordCount: 260
readMinutes: 1
---

# ConcurrentHashMap 源码走读：锁粒度与并发扩容

> 从 JDK7 分段锁到 JDK8 CAS+synchronized：CHM 的锁粒度演进是 Java 并发容器设计的缩影。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：并发 Map 的演进诉求
- Hashtable 全表锁 vs CHM 的并发读诉求
- 入门 16 结论的源码落地

### 2. JDK7 分段锁设计回顾
- Segment 数组与二次寻址
- 历史版本视角：为什么被淘汰

### 3. JDK8 结构与初始化
- 散列桶数组 + CAS + synchronized
- 延迟初始化 table 的 CAS 细节

### 4. putVal 与锁粒度
- bin 为空 CAS 插入 / 非空锁头节点
- 树化 TreeBin 的加锁方式

### 5. 并发扩容 helpTransfer
- ForwardingNode 与扩容标记
- 多线程协同搬运的拆分逻辑

### 6. size 统计与弱一致性
- baseCount + CounterCell（LongAdder 思想）
- 迭代器弱一致性与使用注意

### 7. 速记卡 + 使用建议
- 锁粒度对照表（Hashtable/CHM7/CHM8）
- 什么场景该换别的容器
