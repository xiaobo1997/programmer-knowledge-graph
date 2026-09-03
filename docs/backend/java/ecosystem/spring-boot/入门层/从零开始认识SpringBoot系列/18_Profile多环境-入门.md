---
title: "Profile 多环境"
type: concept
tags: [Spring Boot, 配置, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# Profile 多环境

> dev/test/prod 的环境隔离：application-{profile}.yml、分组 Profile、打包与切换的完整实践。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：一套代码多套环境

- 环境差异：库地址/日志级别/开关项
- 配置漂移事故的教训

### 2. 核心：Profile 机制

- application-{profile}.yml 命名与激活
- spring.profiles.active 的多种设置方式
- 默认 profile 与兜底配置

### 3. 机制：分组 Profile 与打包

- spring.profiles.group 组合环境
- Maven profile 与 Spring profile 的配合
- 容器化环境下的注入方式

### 4. 实践：多环境工程规范

- 三套环境的配置基线
- 本地联调/测试/生产的切换清单
- 环境敏感信息不入库的纪律

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
