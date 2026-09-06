---
title: "条件装配与 Starter 机制"
type: concept
tags: [Spring Boot, 自动装配, L1入门层]
date: 2026-09-03
wordCount: 241
readMinutes: 1
---

# 条件装配与 Starter 机制

> @Conditional 家族怎么按条件生效、@EnableAutoConfiguration 背后是什么、自定义 starter 怎么做——自动装配机制入门。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：一个 jar 全家桶如何按需生效

- 没有条件装配时代的配置地狱
- 条件装配 = 运行时环境驱动 Bean 装配

### 2. 核心：@Conditional 家族

- @ConditionalOnClass / OnProperty / OnBean 等常用条件
- 条件注解的组合与求值顺序

### 3. 机制：自动装配原理初识

- @EnableAutoConfiguration 与 AutoConfiguration.imports
- 自动配置类 vs 普通配置类
- 失效分析（failure analyzer）

### 4. 实践：自定义 starter 全流程

- 自动配置类 + spring.factories/imports 注册
- starter 命名规范与条件设计
- 金融项目私有 starter 的封装思路

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
