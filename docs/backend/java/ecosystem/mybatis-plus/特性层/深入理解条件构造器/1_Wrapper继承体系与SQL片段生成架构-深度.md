---
title: Wrapper 继承体系与 SQL 片段生成架构
type: deep-dive
tags: [MyBatis-Plus, 条件构造器, Wrapper, L2特性层]
date: 2026-09-02
wordCount: 0
readMinutes: 0
---

# Wrapper 继承体系与 SQL 片段生成架构

> 条件构造器把 Java 条件调用变成 WHERE 子句的主机制：继承树、条件片段模型、参数绑定与防注入。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：条件构造器为什么值得深入
- 防注入、动态拼 SQL、与 XML 协作全靠它
### 2. 类体系全景
- Wrapper → AbstractWrapper → QueryWrapper/UpdateWrapper → Lambda 变体的继承树
### 3. 条件片段模型
- 一次 eq 内部发生了什么：条件如何拆成 ISqlSegment 暂存
### 4. SQL 组装时机
- getSqlSegment/mergeSegments 何时拼出 WHERE、长什么样
### 5. 参数绑定与防注入机制
- #{ew.paramNameValuePairs...} 占位符参数从哪来
### 6. 反推使用
- last()/apply()/nested() 为什么这么设计
### 7. 速记卡 + 预告
- 下一篇 Lambda 列名解析
