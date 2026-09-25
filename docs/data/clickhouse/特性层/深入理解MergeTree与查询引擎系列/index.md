---
title: 深入理解MergeTree与查询引擎系列
type: series-index
tags: [数据库, 特性层]
date: 2026-09-24
---

# 深入理解MergeTree与查询引擎系列

> 特性层：ClickHouse 核心机制——MergeTree 写入合并/向量化执行/集群分布式表。

## 文章清单

| # | 篇目 | 一句话定位 |
|---|---|---|
| 1 | [MergeTree 写入与合并路径深度](./1_MergeTree写入与合并路径深度-特性.md) | part 生命周期 · Too many parts 防线 · mutation |
| 2 | [查询执行与向量化引擎](./2_查询执行与向量化引擎-特性.md) | Pipeline 处理器 · 聚合状态 · PREWHERE · 近似计算 |
| 3 | [集群与分布式表深度](./3_集群与分布式表深度-特性.md) | Distributed 路由 · 分片键 · Keeper 副本同步 |

## 📌 维护说明

新增文章同步本表；系列内互指保持相对链接。
