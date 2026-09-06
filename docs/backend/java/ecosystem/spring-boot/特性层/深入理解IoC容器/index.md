---
title: "深入理解IoC容器（源码走读）"
date: 2026-09-03
aside: false
wordCount: 341
readMinutes: 1
---

# 深入理解IoC容器（源码走读）

> BeanDefinition 怎么被加载、doCreateBean 走完一生、三级缓存如何支撑循环依赖。
>
> **核心观点：** 容器是 Spring 的心脏：理解了 BeanDefinition → 实例化 → 初始化 → 销毁的完整链路，框架问题大多能自答。

## 一、本子系列在 4 层架构中的位置

| 层 | 定位 | 本子系列位置 |
|---|---|---|
| L1 入门层 | 概念扫盲 + 会用 | [入门 3 / 4 / 5](../../入门层/从零开始认识SpringBoot系列/0_系列导读-全景) |
| **L2 特性层** ✅ | 单点纵向深挖 | **本子系列（篇目待定稿）** |
| L4 整合层 | 跨专题收束 | [整合层（规划中）](../../整合层/index) |

## 二、规划方向（篇目待定稿）

> 大纲已确认本子系列的方向与数量，篇名与占位文件在定稿后补齐（不虚构篇名）。

| 方向 | 覆盖内容 |
|---|---|
| BeanFactory 体系与 Bean 定义加载 | BeanFactory 层级 / BeanDefinitionReader / 扫描与注册 |
| Bean 生命周期与三级缓存源码 | doCreateBean 全流程 / earlySingletonObjects / 循环依赖解析 |

**主线：** XmlBeanDefinitionReader / AnnotatedBeanDefinitionReader → doCreateBean → 三级缓存 getSingleton

## 三、阅读建议

- 前置：入门 3-5（IoC/注入/作用域与循环依赖）
- 顺序：按方向编号顺序读，每个方向独立成篇
- 对照源码：Spring Boot / Spring Framework 官方文档（3.5 主线 + 4.x 差异标注）
