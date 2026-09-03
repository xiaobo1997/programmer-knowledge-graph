---
title: "过滤器、拦截器与 CORS"
type: concept
tags: [Spring Boot, Web, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# 过滤器、拦截器与 CORS

> Filter 与 Interceptor 的执行顺序与选型、跨域问题原理与配置、登录态等横切逻辑放哪。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：请求链路上的横切点

- Servlet Filter vs Spring Interceptor 的层次差异
- 两者能做什么、不能做什么

### 2. 核心：Filter 与 Interceptor 全对比

- 执行顺序：Filter → Interceptor → Controller
- HandlerInterceptor 的 pre/post/afterCompletion
- 注册方式：@WebFilter vs FilterRegistrationBean

### 3. 机制：CORS 跨域

- 同源策略与预检请求 OPTIONS
- @CrossOrigin 与全局 CORS 配置
- 携带凭证（credentials）时的细节

### 4. 实践：登录态与审计落点

- Token 校验放 Filter 还是 Interceptor
- 白名单与放行路径设计
- 与参数校验/异常处理的协作顺序

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
