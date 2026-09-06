---
title: "IoC 容器与 Bean 生命周期"
type: concept
tags: [Spring Boot, IoC, L1入门层]
date: 2026-09-03
wordCount: 249
readMinutes: 1
---

# IoC 容器与 Bean 生命周期

> 容器是什么、Bean 怎么定义、生命周期钩子何时触发——IoC 是 Spring 的地基，本篇把它一次讲清。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：从 new 对象到容器管理

- 硬编码依赖的痛点
- 容器 = 对象工厂 + 生命周期管理 + 依赖装配

### 2. 核心：Bean 定义与注册方式

- @Component 家族与 @Bean 的差异
- 配置类 @Configuration 与扫描路径
- BeanDefinition 的直观理解

### 3. 机制：Bean 生命周期钩子

- 初始化：@PostConstruct / InitializingBean / initMethod
- 销毁：@PreDestroy / DisposableBean / destroyMethod
- Aware 接口族（ApplicationContextAware 等）

### 4. 实践：容器使用的日常姿势

- 获取 Bean 的几种方式与反模式
- Bean 定义覆盖与冲突排查
- 延迟初始化 @Lazy 的适用场景

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
