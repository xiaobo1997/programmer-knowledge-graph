---
title: 深入理解插件机制（源码走读）
date: 2026-09-02
aside: false
wordCount: 484
readMinutes: 2
---

# 深入理解插件机制（源码走读）

> MyBatis-Plus 特性层第二个源码走读子系列：把入门 7/9/14 的分页、乐观锁、多租户、防全表更新背后同一套插件机制从源码层穿透。
>
> **核心观点：** MP 的插件不是各自为战，而是「一个 MybatisPlusInterceptor 门面 + 多条 InnerInterceptor 链」——分页改写 SQL、乐观锁改写参数、多租户注入条件，全是链上的插件实例。

## 一、本子系列在 4 层架构中的位置

| 层 | 定位 | 本子系列位置 |
|---|---|---|
| L1 入门层 | 概念扫盲 + 会用 | [从零开始认识 MyBatis-Plus 系列](../../入门层/从零开始认识MyBatisPlus系列/0_系列导读-全景)，篇 7 分页 / 9 乐观锁 / 14 插件机制 |
| **L2 特性层** ✅ | 每个机制 1 组源码走读 | **本子系列（3 篇）** |
| L3 专题层 | 横向组合拳 | [MyBatis-Plus 生产实战深度](../../专题层/MyBatisPlus生产实战深度/index) / [性能与大数据量](../../专题层/MyBatisPlus性能与大数据量深度/index) |
| L4 整合层 | 数据访问工程实践 | 待真实实践主题（规划中） |

## 二、3 篇源码走读全景

| # | 标题 | 状态 | 核心议题 |
|---|---|---|---|
| 1 | [MybatisPlusInterceptor 与 InnerInterceptor 链架构](./1_MybatisPlusInterceptor与InnerInterceptor链架构-深度) | 📋 大纲已定 | 四大对象拦截回顾 / 门面与链 / 顺序语义 / 3.5.9+ 可选依赖 |
| 2 | [分页插件 PaginationInnerInterceptor 源码](./2_PaginationInnerInterceptor分页插件源码-深度) | 📋 大纲已定 | Page 识别 / COUNT 优化 / 方言改写 / 深翻页机制层 |
| 3 | [乐观锁 · 多租户 · 防全表更新拦截器逐个拆](./3_乐观锁多租户防全表拦截器逐个拆-深度) | 📋 大纲已定 | 参数改写 vs SQL 改写 vs 执行前校验 / 组合顺序 |

**源码主线：** `MybatisPlusInterceptor` 注册 → `InnerInterceptor` 链编排 → 拦截 MyBatis 四大对象 → 各拦截器改写 SQL/参数。

## 三、阅读建议

- 前置：入门 7 分页 / 9 乐观锁 / 14 插件机制；《深入浅出 MyBatis》拦截器与四大对象章节
- 顺序：1 → 2 → 3（架构 → 最常用分页 → 三个安全拦截器对比）
- 对照源码：MP v3.5.17 + MyBatis 3.5.x（本地 jar sources 或 GitHub tag）
- 关联：特性层「深入理解 SQL 注入器」（注册期机制）与本子系列（运行期机制）合起来 = MP 增强全貌
