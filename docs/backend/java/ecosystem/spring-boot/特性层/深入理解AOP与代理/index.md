---
title: "深入理解AOP与代理（源码走读）"
date: 2026-09-03
aside: false
wordCount: 330
readMinutes: 1
---

# 深入理解AOP与代理（源码走读）

> 代理对象何时创建、切点如何匹配、@Transactional 的事务代理如何织入。
>
> **核心观点：** AOP 与事务代理共享同一套基础设施——AnnotationAwareAspectJAutoProxyCreator 是一切切面的源头。

## 一、本子系列在 4 层架构中的位置

| 层 | 定位 | 本子系列位置 |
|---|---|---|
| L1 入门层 | 概念扫盲 + 会用 | [入门 7 / 14](../../入门层/从零开始认识SpringBoot系列/0_系列导读-全景) |
| **L2 特性层** ✅ | 单点纵向深挖 | **本子系列（篇目待定稿）** |
| L4 整合层 | 跨专题收束 | [整合层（规划中）](../../整合层/index) |

## 二、规划方向（篇目待定稿）

> 大纲已确认本子系列的方向与数量，篇名与占位文件在定稿后补齐（不虚构篇名）。

| 方向 | 覆盖内容 |
|---|---|
| 代理创建与切点匹配源码 | 自动代理创建器 / 切点表达式求值 / JDK 与 CGLIB 决策 |
| @Transactional 事务代理源码 | 事务拦截器链 / 传播行为实现 / 回滚判定源码 |

**主线：** AnnotationAwareAspectJAutoProxyCreator → ProxyFactory → TransactionInterceptor

## 三、阅读建议

- 前置：入门 7（AOP）+ 14（事务管理）
- 顺序：按方向编号顺序读，每个方向独立成篇
- 对照源码：Spring Boot / Spring Framework 官方文档（3.5 主线 + 4.x 差异标注）
