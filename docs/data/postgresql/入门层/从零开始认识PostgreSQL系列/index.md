---
title: 从零开始认识PostgreSQL系列
type: series-index
tags: [数据库, 入门层]
date: 2026-09-24
---

# 从零开始认识PostgreSQL系列

> 主线：与 MySQL 的机制差异——进程模型/MVCC/索引家族/JSONB 扩展，篇篇对标讲解。

## 文章清单

| # | 篇目 | 一句话定位 |
|---|---|---|
| 1 | [PostgreSQL 是什么与全景](./1_PostgreSQL是什么与全景-入门.md) | 最先进开源关系型 · 2026 登顶挑战 · second database 首选 |
| 2 | [进程模型与存储架构](./2_进程模型与存储架构-入门.md) | 每连接一进程 vs MySQL 每连接一线程 · WAL 对照 |
| 3 | [MVCC 与索引的机制差异](./3_MVCC与索引的机制差异-入门.md) | xmin/xmax vs undo log · VACUUM · GIN/GiST/BRIN |
| 4 | [JSONB 扩展性与生态选型](./4_JSONB扩展性与生态选型-入门.md) | JSONB+GIN · pgvector/PostGIS · 什么时候 PG 一步到位 |

## 📌 维护说明

新增文章同步本表；系列内互指保持相对链接。
