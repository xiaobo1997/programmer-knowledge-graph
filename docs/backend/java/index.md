---
title: Java
date: 2026-09-03
aside: false
wordCount: 0
readMinutes: 0
---

# ▥ Java

> JVM 生态核心语言与框架分类入口：左侧是 Java 语言本体（use-java）的 L1-L4 完整体系，右侧是语言生态（ecosystem）里的框架系列。知识分层统一走「入门层铺全 → 特性层深入 → 专题层组合 → 整合层收束」。

## Java 语言本体（use-java）

> 从对象与内存布局，到并发与虚拟线程：Java 17 LTS 主线 + 21 演进的完整知识面。

| 系列 | 入口 |
|---|---|
| 入门层（7 组 41 篇） | [从零开始认识 Java 系列](./use-java/入门层/从零开始认识Java系列/0_系列导读-全景) |
| 特性层（4 子系列 11 篇） | [集合源码](./use-java/特性层/深入理解集合源码系列/index) / [并发](./use-java/特性层/深入理解并发系列/index) / [JVM](./use-java/特性层/深入理解JVM系列/index) / [新特性](./use-java/特性层/深入理解新特性系列/index) |
| 专题层（3 专题 9 篇） | [JVM 调优与排障实战](./use-java/专题层/JVM调优与排障实战/index) / [高并发编程实战](./use-java/专题层/高并发编程实战/index) / [Java 工程实践](./use-java/专题层/Java工程实践/index) |
| 整合层（1 篇） | [Java 应用性能演进之路](./use-java/整合层/index) |

## 语言生态（ecosystem）

> Java 语言强相关的框架系列，独立立项、独立 L1-L4（分类归属见 classification.md：框架生态 → backend/<语言>/ecosystem/）。

| 框架 | 入口 | 状态 |
|---|---|---|
| Spring Boot | [Spring Boot 实战](./ecosystem/spring-boot/index) | 23 篇立项（入门层落盘中） |
| MyBatis-Plus | [MyBatis-Plus 实战](./ecosystem/mybatis-plus/index) | 16 篇立项（特性/专题层大纲已定） |

## 沉淀原则

- Java 语言本体与 Spring Boot 生态**分开独立系列**：语言管语法/JVM/并发底层，框架管工程能力
- 版本锚点：Java 17 LTS（工作主线）+ 21 LTS（演进方向）；旧机制标注「历史版本视角」
- 对标书目：Java 核心技术卷I / Effective Java / 深入理解 Java 虚拟机 / Java 并发编程实战；框架对标官方文档 + 源码
- 面试问答不在此仓库沉淀（见 interview 仓库）
