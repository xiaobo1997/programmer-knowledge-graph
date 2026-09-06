---
title: 深入理解集合源码系列（源码走读）
date: 2026-09-03
aside: false
wordCount: 502
readMinutes: 2
---

# 深入理解集合源码系列（源码走读）

> 集合框架三块最难啃的源码一次走读：HashMap 的散列与树化、ConcurrentHashMap 的锁粒度演进、ArrayList 的扩容与迭代器机制。
>
> **核心观点：** 集合不是「背结论」——扩容阈值、fail-fast、锁粒度都能在源码里看到设计权衡；看懂这三篇，入门层 11-16 的结论全部变成可推理的机制。

## 一、本子系列在 4 层架构中的位置

| 层 | 定位 | 本子系列位置 |
|---|---|---|
| L1 入门层 | 概念扫盲 + 会用 | [从零开始认识 Java 系列](../../入门层/从零开始认识Java系列/0_系列导读-全景)，篇 11-16 集合框架组 |
| **L2 特性层** ✅ | 每个机制 1 组源码走读 | **本子系列（3 篇）** |
| L3 专题层 | 横向组合拳 | [高并发编程实战](../../专题层/高并发编程实战/index) |
| L4 整合层 | 运行时性能演进 | Java 应用性能演进之路（规划中） |

## 二、篇目全景

| # | 标题 | 状态 | 核心议题 |
|---|---|---|---|
| 1 | [HashMap 源码走读：从散列到红黑树化](./1_HashMap源码走读-深度) | 📋 大纲已定 | hash 扰动 / put-get 全流程 / 树化边界 / 扩容 rehash |
| 2 | [ConcurrentHashMap 源码走读：锁粒度与并发扩容](./2_ConcurrentHashMap源码走读-深度) | 📋 大纲已定 | JDK7 分段锁→JDK8 CAS+synchronized / ForwardingNode / 并发扩容 |
| 3 | [ArrayList 扩容与迭代器机制源码走读](./3_ArrayList扩容与迭代器机制-深度) | 📋 大纲已定 | grow 扩容细节 / modCount / fail-fast / LinkedList 对照 |

**主线：** HashMap 散列与树化 → ConcurrentHashMap 锁粒度与并发扩容 → ArrayList 扩容与迭代器。

## 三、阅读建议

- 前置：入门 11-16（集合框架总览 / ArrayList-LinkedList / HashMap / Map-Set 家族 / Queue / 并发集合）
- 顺序：1 → 2 → 3（Map 两巨头 → List 扩容）
- 对照源码：JDK 17（本地 src.zip 或 GitHub openjdk/jdk tag jdk-17）
- 关联：专题层「高并发编程实战」会在线程安全容器场景再回扣本系列
