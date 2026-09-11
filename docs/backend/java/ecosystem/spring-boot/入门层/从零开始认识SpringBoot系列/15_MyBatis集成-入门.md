---
title: "MyBatis 集成"
type: concept
tags: [Spring Boot, 数据访问, L1入门层]
date: 2026-09-03
wordCount: 232
readMinutes: 1
---

# MyBatis 集成

> Mapper 扫描与代理、XML vs 注解、动态 SQL 初识，以及与 JPA 的选型对比（增强能力归 MyBatis-Plus 系列）。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：ORM 的两种路线

- 全自动 ORM（JPA/Hibernate）vs 半自动（MyBatis）
- SQL 可控性与开发效率的权衡

### 2. 核心：Boot 集成 MyBatis

- mybatis-spring-boot-starter 配置
- @MapperScan 与 Mapper 代理
- XML 与注解的边界（复杂 SQL 用 XML）

### 3. 机制：动态 SQL 与参数

- `&lt;if&gt;/&lt;foreach&gt;/&lt;where&gt;` 等常用标签（写法见 XML mapper）
- #{} 与 ${} 的注入区别
- 结果映射 resultMap 场景

### 4. 实践：与 JPA 的选型对比

- 团队技术栈与金融项目惯例
- MyBatis-Plus 增强能力留独立系列（ecosystem/mybatis-plus）
- Mapper 层规范与代码生成思路

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
