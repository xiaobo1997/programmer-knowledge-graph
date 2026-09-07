---
title: XA 规范与数据库支持
date: 2026-09-06
type: deep-dive
tags: [架构, 分布式事务, 规划中]
wordCount: 245
readMinutes: 1
---

# XA 规范与数据库支持

> X/Open DTP 模型——2PC 的工业标准化，MySQL/Oracle 的 XA 实现。
>
> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## XA 规范的角色

- X/Open DTP 模型：AP（应用）/ TM（事务管理器）/ RM（资源管理器）
- XA 接口：TM 通过 xa_start/xa_end/xa_prepare/xa_commit 协调 RM
- 2PC 的工业标准封装：各数据库按接口实现 RM 角色

## 数据库的 XA 支持

- MySQL：innodb_support_xa / XA START..XA COMMIT 语法，性能损耗明显
- Oracle/SQL Server：成熟 XA 支持（金融老系统常见）
- JTA：Java 侧的 XA 事务接口（Atomikos/Seata XA 模式）

## XA 的适用与不适用

- 适用：强一致刚需 + 吞吐要求不高 + 数据库原生支持
- 不适用：高并发互联网场景（锁与阻塞代价）
- 定位：XA 是「最后的一致性底线」——能不用则用柔性方案代替

（正文落盘时按规划大纲展开，骨架占位不影响站点构建）
