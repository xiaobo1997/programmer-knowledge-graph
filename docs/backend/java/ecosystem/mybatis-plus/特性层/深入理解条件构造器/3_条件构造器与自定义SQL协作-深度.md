---
title: 条件构造器与自定义 SQL 的协作（customSqlSegment 原理）
type: deep-dive
tags: [MyBatis-Plus, 条件构造器, XML, L2特性层]
date: 2026-09-02
wordCount: 218
readMinutes: 1
---

# 条件构造器与自定义 SQL 的协作（customSqlSegment 原理）

> ew.customSqlSegment 把 Wrapper 条件搬进 XML 的原理：固定别名、片段展开与安全边界。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：复杂查询回 XML 时条件如何复用 Wrapper
- （正文落盘时按规划大纲展开）
### 2. 传参机制
- Mapper 方法声明 Wrapper 参数，MyBatis 固定别名 ew
### 3. customSqlSegment 是什么
- getCustomSqlSegment 输出不带 WHERE 的片段，XML 里 ${} 拼入
### 4. 参数名绑定
- ew.paramNameValuePairs 引用与 @Param(Constants.WRAPPER) 由来
### 5. 安全边界
- ${} 拼接片段仍走占位符参数，但别和用户输入直接拼
### 6. 实战范式
- 查询 DTO + Wrapper 构造 + XML 复杂 SQL 分层协作模板
### 7. 速记卡 + 预告
- （正文落盘时按规划大纲展开）
