---
title: 深入理解MongoDB核心机制系列
type: series-index
tags: [数据库, 特性层]
date: 2026-09-24
---

# 深入理解MongoDB核心机制系列

> 特性层：MongoDB 核心机制——WiredTiger/副本集 oplog/分片 chunk 治理/聚合性能。

## 文章清单

| # | 篇目 | 一句话定位 |
|---|---|---|
| 1 | [WiredTiger 存储引擎深度](./1_WiredTiger存储引擎深度-特性.md) | MVCC 快照 · 文档级并发 · checkpoint+journal · 压缩 |
| 2 | [副本集 oplog 与选举深度](./2_副本集oplog与选举深度-特性.md) | PV1 选举 · writeConcern 读语义 · 因果一致会话 |
| 3 | [分片架构与 chunk 治理深度](./3_分片架构与chunk治理深度-特性.md) | shard key 对赌 · jumbo chunk · balancer · reshard |
| 4 | [聚合管道性能与索引协同](./4_聚合管道性能与索引协同-特性.md) | 下推改写 · 100MB 红线 · ESR 复核 · $merge 分批 |

## 📌 维护说明

新增文章同步本表；系列内互指保持相对链接。
