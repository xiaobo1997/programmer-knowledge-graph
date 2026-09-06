---
title: "Schema 设计与数据类型"
type: concept
tags: [MySQL, Schema设计, 数据类型, L1入门层]
date: 2026-09-03
wordCount: 195
readMinutes: 1
---

# Schema 设计与数据类型

> 字段类型选择、范式与反范式——表设计决定查询的上限。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：schema 是查询的地基

- 类型选错的三类代价（空间/索引/转换）
- 范式与反范式的权衡

### 2. 核心：数值与字符串类型

- INT/BIGINT/DECIMAL 选择
- CHAR vs VARCHAR vs TEXT 陷阱

### 3. 机制：时间与枚举类型

- DATETIME vs TIMESTAMP
- ENUM/SET/JSON 的使用边界

### 4. 实践：建表最佳实践

- 主键选择（自增 vs 业务键 vs UUID）
- 预留字段与冗余的度

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
