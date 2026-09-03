---
title: HashMap 源码走读：从散列到红黑树化
type: deep-dive
tags: [Java, 集合, HashMap, 源码, L2特性层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# HashMap 源码走读：从散列到红黑树化

> 从 hash 扰动到红黑树化的完整 put/get 旅程：读懂 HashMap，就看懂了散列表的工程设计。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：HashMap 为什么值得逐行读
- 入门 13 只讲了结论，源码层看设计权衡
- 散列表通用问题：冲突、扩容、退化

### 2. 数据结构与核心字段
- table / size / threshold / loadFactor
- Node 与 TreeNode 的关系

### 3. hash 扰动与寻址
- hash() 为什么高 16 位异或低 16 位
- 寻址 (n-1)&hash 与扩容联动

### 4. put 全流程
- 首次插入 resize / 追加 vs 树化 vs 覆盖
- 树化边界 8/64 为什么这么定

### 5. resize 扩容机制
- 容量翻倍与 rehash 拆分
- lo/hi 链表拆分原理

### 6. get / remove / 迭代
- 查找路径与树查找
- 迭代顺序不保证的原因

### 7. 速记卡 + 下篇预告
- 一张表收束关键数值（默认容量/阈值/树化边界）
- 预告 ConcurrentHashMap 锁粒度
