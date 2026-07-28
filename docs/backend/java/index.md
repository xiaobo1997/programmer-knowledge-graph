---
title: Java 实战
type: concept
tags: [后端, Java]
wordCount: 325
readMinutes: 1
---

# Java 实战

> Java 工程实践 + 版本演进 + 特性学习。

## 子主题

- [Java 17 新特性](./java17特性/) — LTS 长期支持版本，至少支持到 2029 年

## 生态定位

### 在哪里

- JVM 生态核心语言之一
- 后端服务主流选型（Spring Boot / Quarkus / Helidon）
- Android 开发首选

### 现在怎么样

- Java 发布节奏：每 6 个月一个版本，每 2 年一个 LTS
- 版本时间线：Java 8（2014 LTS）/ 11（2018 LTS）/ 17（2021 LTS）/ 21（2023 LTS）/ 25（2025 LTS）

### 能干什么

| 场景 | Java 适合度 |
|---|---|
| 后端微服务 | ⭐⭐⭐⭐⭐ |
| 大数据处理 | ⭐⭐⭐⭐（Scala 也在用） |
| 云原生 | ⭐⭐⭐⭐（Quarkus / Micronaut） |
| AI/ML | ⭐⭐（Python 为主） |
| Android | ⭐⭐⭐⭐⭐ |

### 怎么配合

- Spring Boot 3（要求 17+）
- GraalVM Native Image
- Kotlin（Android 官方推荐）

### 类似什么

| 方案 | 类型 | 优势 | 劣势 |
|---|---|---|---|
| Java | 编译型 | 生态最大 / 性能稳定 | 代码啰嗦 |
| Kotlin | JVM 语言 | 简洁 / 兼容 Java | 学习曲线 |
| Go | 编译型 | 部署简单 / 性能强 | 生态较小 |
| Scala | JVM 语言 | 函数式 / 大数据强 | 学习曲线陡 |

### 怎么演进

- Java 8 → 11 → 17 → 21 → 25（LTS 节奏）
- 现代化特性：lambda → records → sealed → virtual threads

## 一句话总结

> Java 是后端工程的「默认选项」——生态最大、LTS 稳定、现代特性逐步补齐。