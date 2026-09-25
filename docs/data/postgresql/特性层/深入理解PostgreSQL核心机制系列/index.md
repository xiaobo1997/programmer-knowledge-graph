---
title: 深入理解PostgreSQL核心机制系列
type: series-index
tags: [数据库, 特性层]
date: 2026-09-24
---

# 深入理解PostgreSQL核心机制系列

> 特性层：PG 核心机制源码级——进程模型/MVCC 与 VACUUM/索引家族/优化器与执行计划。

## 文章清单

| # | 篇目 | 一句话定位 |
|---|---|---|
| 1 | [进程模型与存储布局深度](./1_进程模型与存储布局深度-特性.md) | postmaster/backend · 每连接内存账 · fork 布局 |
| 2 | [MVCC 与 VACUUM 深度](./2_MVCC与VACUUM深度-特性.md) | xmin/xmax · 表膨胀 · autovacuum 调参 · xid 回卷 |
| 3 | [索引家族全景：Btree 之外](./3_索引家族全景：Btree之外-特性.md) | GIN/GiST/BRIN/Hash · 部分与表达式索引 |
| 4 | [查询优化器与执行计划深度](./4_查询优化器与执行计划深度-特性.md) | EXPLAIN(ANALYZE,BUFFERS) 逐层 · 代价模型 · 计划劣化 |

## 📌 维护说明

新增文章同步本表；系列内互指保持相对链接。
