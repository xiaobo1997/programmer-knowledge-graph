---
title: "Web MVC 请求链路"
type: concept
tags: [Spring Boot, Web, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# Web MVC 请求链路

> 一个 HTTP 请求从进入到响应经历了什么：DispatcherServlet 分发、HandlerMapping 路由、视图与响应。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：Web 层的核心问题

- 请求怎么找到处理方法
- Servlet 与 MVC 的关系

### 2. 核心：DispatcherServlet 分发流程

- 前端控制器模式
- HandlerMapping → HandlerAdapter → 处理 → 响应
- @Controller vs @RestController

### 3. 机制：请求处理细节

- 视图解析与 @ResponseBody 直出
- 静态资源与欢迎页处理
- 统一前缀与路径匹配规则

### 4. 实践：Web 层常见问题

- 404/405 排查思路
- 异步请求与拦截器的配合
- RESTful 设计与 HTTP 语义

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
