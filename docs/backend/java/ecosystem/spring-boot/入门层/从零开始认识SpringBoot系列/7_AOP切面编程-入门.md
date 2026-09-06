---
title: "AOP 切面编程"
type: concept
tags: [Spring Boot, AOP, L1入门层]
date: 2026-09-03
wordCount: 244
readMinutes: 1
---

# AOP 切面编程

> 切点怎么表达、通知有哪几种、JDK 与 CGLIB 代理怎么选、切面顺序如何控制——AOP 实战全解析。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：横切逻辑的抽离

- 日志/鉴权/事务等横切关注点
- OOP 无法优雅解决的重复代码

### 2. 核心：切点与通知

- execution / within / @annotation 切点表达式
- @Before / @AfterReturning / @AfterThrowing / @Around
- @Around 与 ProceedingJoinPoint 的完整控制

### 3. 机制：动态代理选择

- JDK 动态代理与接口要求
- CGLIB 子类代理与类要求
- Boot 2.x 后默认 CGLIB 的原因

### 4. 实践：切面工程细节

- 切面顺序 @Order 与嵌套调用
- 自调用失效问题与解决方法
- 切面性能与误伤范围控制

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
