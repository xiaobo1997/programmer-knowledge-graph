---
title: Java 17 新特性
type: concept
tags: [后端, Java, LTS, 新特性]
wordCount: 380
readMinutes: 1
---

# Java 17 新特性

> Java 17 是 2021 年发布的 LTS 长期支持版本，至少支持到 2029 年。
> 本文系统讲解 Java 17 的关键新特性 + 升级决策。

## 生态定位

### 在哪里

- 编程语言层（JVM 生态核心）
- Spring Boot 3.x 强制要求 Java 17+
- Quarkus / Helidon 等现代 Java 框架默认 17+

### 现在怎么样

- Java 发布节奏：每 6 个月一个版本，每 2 年一个 LTS
- 版本时间线：Java 8（2014）/ 11（2018）/ 17（2021 LTS）/ 21（2023 LTS）/ 25（2025 LTS）

### 能干什么

| 特性 | 解决问题 |
|---|---|
| sealed classes | 限制继承，实现模式匹配 + 编译期安全 |
| records | 自动生成 getter/equals/hashCode，消灭模板代码 |
| pattern matching | instanceof + switch 增强，类型检查更简洁 |
| text blocks | 多行字符串不用拼接 |
| 强封装 JDK 内部 | 安全增强 |

### 怎么配合

- Spring Boot 3.x（强制 17+）
- GraalVM Native Image（AOT 编译）
- Jakarta EE 10（命名空间 javax → jakarta）

### 类似什么

- Kotlin 的 data class（≈ records）
- Scala 的 case class（≈ records + pattern matching）
- Rust 的 enum（≈ sealed classes）

### 怎么演进

- Java 8：lambda + stream
- Java 11：HTTP Client + var
- Java 17：sealed + records + pattern matching（本系列）
- Java 21：virtual threads + pattern matching for switch

## 学习路径

1. 环境升级（30 分钟）：装 JDK 17，跑 Hello World
2. sealed classes（1 小时）：受限继承
3. records（1 小时）：数据类
4. pattern matching（1 小时）：类型模式
5. 升级实战（30 分钟）：从 11 升 17 踩坑

## 一句话总结

> Java 17 是「现代化 Java 的起点」——records / sealed / pattern matching 三大特性让 Java 摆脱「啰嗦」标签。
