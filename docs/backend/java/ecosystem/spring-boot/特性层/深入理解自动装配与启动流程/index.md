---
title: "深入理解自动装配与启动流程（源码走读）"
date: 2026-09-03
aside: false
wordCount: 353
readMinutes: 1
---

# 深入理解自动装配与启动流程（源码走读）

> 从 main 方法到 Bean 就绪：SpringApplication run() 的启动旅程与自动装配的条件求值。
>
> **核心观点：** 启动流程与自动装配是 Boot 的「魔法」所在——读源码后，@SpringBootApplication 背后不再是黑盒。

## 一、本子系列在 4 层架构中的位置

| 层 | 定位 | 本子系列位置 |
|---|---|---|
| L1 入门层 | 概念扫盲 + 会用 | [入门 2 / 6](../../入门层/从零开始认识SpringBoot系列/0_系列导读-全景) |
| **L2 特性层** ✅ | 单点纵向深挖 | **本子系列（篇目待定稿）** |
| L4 整合层 | 跨专题收束 | [整合层（规划中）](../../整合层/index) |

## 二、规划方向（篇目待定稿）

> 大纲已确认本子系列的方向与数量，篇名与占位文件在定稿后补齐（不虚构篇名）。

| 方向 | 覆盖内容 |
|---|---|
| SpringApplication run() 启动流程源码走读 | 启动阶段划分 / 环境准备 / refresh 触发时机 |
| 自动装配机制与条件装配源码 | AutoConfiguration.imports 加载 / @Conditional 求值 / 自动配置生效顺序 |

**主线：** run() → prepareContext → refresh → AutoConfiguration.imports 加载 → 条件求值

## 三、阅读建议

- 前置：入门 2（工程结构）+ 6（条件装配与 starter）
- 顺序：按方向编号顺序读，每个方向独立成篇
- 对照源码：Spring Boot / Spring Framework 官方文档（3.5 主线 + 4.x 差异标注）
