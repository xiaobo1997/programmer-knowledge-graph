---
title: "数据源与 JDBC 基础"
type: concept
tags: [Spring Boot, 数据访问, L1入门层]
date: 2026-09-03
wordCount: 235
readMinutes: 1
---

# 数据源与 JDBC 基础

> 连接池与数据源配置、HikariCP 关键参数、JdbcTemplate 的日常用法——Java 访问数据库的地基。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：JDBC 原生开发的痛点

- DriverManager 手动管理连接的问题
- 连接池为什么是标配

### 2. 核心：数据源配置

- spring.datasource 配置项
- HikariCP 默认行为与关键参数（maxPoolSize/connectionTimeout）
- 多数据源配置预览（16 篇）

### 3. 机制：连接池工作原理

- 池化生命周期：创建/借出/归还/回收
- 连接泄漏与校验
- HikariCP 为何快（字节码级优化）

### 4. 实践：JdbcTemplate 与工程选择

- query/update/batch 基本用法
- 与 ORM 框架的分工（15 篇衔接）
- 慢 SQL 排查入口（衔接 MySQL 系列）

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
