---
title: ArrayList 扩容与迭代器机制源码走读
type: deep-dive
tags: [Java, 集合, ArrayList, LinkedList, 源码, L2特性层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# ArrayList 扩容与迭代器机制源码走读

> 动态数组的扩容数学与迭代器契约：ArrayList 的 grow、modCount 与 fail-fast 是每个 Java 工程师都该读一遍的源码。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：最常用的容器反而最少被读源码
- 为什么从 ArrayList 开始读 List
- 扩容与迭代器两个高频考点本质

### 2. 字段与构造
- elementData / size / DEFAULT_CAPACITY
- 空数组共享与懒分配

### 3. add 与 grow 扩容细节
- 1.5 倍扩容的位运算实现
- 扩容拷贝 Arrays.copyOf 与内存代价

### 4. 迭代器与 modCount
- Itr 内部类与 expectedModCount
- fail-fast 触发路径（并发修改检测）

### 5. subList 视图的坑
- 视图关联原列表的改动传播
- 视图上结构性修改的约束

### 6. LinkedList 对照与选型
- 链表节点开销与缓存不友好
- 什么时候 LinkedList 真的更优

### 7. 速记卡 + 系列收束
- 扩容倍数/初始容量/迭代器行为速记
- 集合三篇走读完成后的全景回看
