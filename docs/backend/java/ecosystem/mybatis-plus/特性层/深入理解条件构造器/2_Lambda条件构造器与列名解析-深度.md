---
title: Lambda 条件构造器与列名解析
type: deep-dive
tags: [MyBatis-Plus, 条件构造器, Lambda, L2特性层]
date: 2026-09-02
wordCount: 0
readMinutes: 0
---

# Lambda 条件构造器与列名解析

> LambdaQueryWrapper.eq(User::getName) 凭什么不写字符串列名——SFunction 反射与缓存机制。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：从字符串列名到 Lambda 写法
- 列名易错难重构的动机
### 2. SFunction 是什么
- 方法引用如何被识别为函数式接口
### 3. 列名解析链路
- 方法引用 → SerializedLambda → implMethodName → 驼峰转下划线 → ColumnCache
### 4. 缓存机制
- LambdaUtils columnMap：每实体只解析一次
### 5. 为什么 Lambda 版更安全
- 编译期方法引用 vs 字符串列名运行时才炸
### 6. 边界与坑
- SerializedLambda 反序列化限制
### 7. 速记卡 + 预告
- 下一篇 Wrapper 与自定义 SQL 协作
