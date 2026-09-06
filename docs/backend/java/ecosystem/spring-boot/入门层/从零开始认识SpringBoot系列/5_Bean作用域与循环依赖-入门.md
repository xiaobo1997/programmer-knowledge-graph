---
title: "Bean 作用域与循环依赖"
type: concept
tags: [Spring Boot, IoC, L1入门层]
date: 2026-09-03
wordCount: 253
readMinutes: 1
---

# Bean 作用域与循环依赖

> singleton 还是 prototype？三级缓存为什么能解循环依赖？作用域与依赖闭环一次说透。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：对象要几个实例

- singleton 默认与线程安全问题
- prototype 每次新建的代价

### 2. 核心：作用域全景

- request / session / application 作用域（Web 场景）
- 作用域与代理（@Scope proxyMode）
- 自定义作用域思路

### 3. 机制：三级缓存与循环依赖

- 为什么构造器循环依赖解不了
- 三级缓存：singletonObjects / earlySingletonObjects / singletonFactories
- AOP 代理对象与提前暴露的配合

### 4. 实践：解决与规避策略

- 构造器注入如何从源头避免
- @Lazy 打破循环的适用场景
- 循环依赖与设计坏味道的讨论

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
