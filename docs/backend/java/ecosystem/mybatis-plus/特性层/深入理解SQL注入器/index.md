---
title: 深入理解 SQL 注入器（源码走读）
date: 2026-09-02
aside: false
wordCount: 415
readMinutes: 1
---

# 深入理解 SQL 注入器（源码走读）

> MyBatis-Plus 特性层第三个源码走读子系列：回答入门 0_导读心智模型的核心谜题——`userMapper.selectById(1L)` 没写任何 SQL，那条 SQL 是什么时候、被谁、怎么生成的。
>
> **核心观点：** 继承 BaseMapper 就有全套 CRUD，靠的是启动期「实体 → TableInfo → SQL 注入器逐方法生成 MappedStatement」——SQL 在启动时一次生成，运行时只做参数绑定。

## 一、本子系列在 4 层架构中的位置

| 层 | 定位 | 本子系列位置 |
|---|---|---|
| L1 入门层 | 概念扫盲 + 会用 | [从零开始认识 MyBatis-Plus 系列](../../入门层/从零开始认识MyBatisPlus系列/0_系列导读-全景)，篇 3 BaseMapper / 13 SQL 注入器 |
| **L2 特性层** ✅ | 每个机制 1 组源码走读 | **本子系列（2 篇）** |
| L3 专题层 | 横向组合拳 | [MyBatis-Plus 生产实战深度](../../专题层/MyBatisPlus生产实战深度/index) |
| L4 整合层 | 数据访问工程实践 | 待真实实践主题（规划中） |

## 二、2 篇源码走读全景

| # | 标题 | 状态 | 核心议题 |
|---|---|---|---|
| 1 | [SQL 注入器架构与启动注册](./1_SQL注入器架构与启动注册-深度) | 📋 大纲已定 | 启动注册流程 / TableInfo / selectById SQL 模板生成 / 运行期零拼接 |
| 2 | [自定义方法扩展](./2_自定义方法扩展-深度) | 📋 大纲已定 | AbstractMethod 子类 / DefaultSqlInjector / getMethodList / sql-injector 配置 |

**源码主线：** `BaseMapper` 方法表 → `ISqlInjector` → `AbstractMethod` 拼 SQL → `MappedStatement` 注册 → 启动流程。

## 三、阅读建议

- 前置：入门 3 BaseMapper 通用 CRUD / 13 SQL 注入器；本子系列是「一个 Mapper 方法的一生」心智模型的启动期落地
- 顺序：1 → 2（读懂内置 → 写自己的）
- 对照源码：MP v3.5.17（本地 jar sources 或 GitHub tag）
- 关联：特性层「深入理解插件机制」（运行期机制）与本子系列（注册期机制）合起来 = MP 增强全貌
