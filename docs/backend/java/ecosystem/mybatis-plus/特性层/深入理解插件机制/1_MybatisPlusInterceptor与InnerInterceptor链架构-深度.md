---
title: MybatisPlusInterceptor 与 InnerInterceptor 链架构
type: deep-dive
tags: [MyBatis-Plus, 插件机制, 拦截器, L2特性层]
date: 2026-09-02
wordCount: 0
readMinutes: 0
---

# MybatisPlusInterceptor 与 InnerInterceptor 链架构

> MP 插件体系的壳：怎么装进 MyBatis 拦截器机制，又怎么在内部编排多条 InnerInterceptor。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：MyBatis 原生拦截器机制回顾
- 四大对象 Executor/StatementHandler/ParameterHandler/ResultSetHandler
### 2. MybatisPlusInterceptor 是什么
- 实现 MyBatis Interceptor 的门面，拦截 Executor
### 3. InnerInterceptor 链
- addInnerInterceptor 顺序、查询/更新拦截语义、短路
### 4. 与 MyBatis 原生拦截器共存
- 代理顺序与 @Order
### 5. 3.5.9+ 插件为什么拆可选依赖
- jsqlparser 解析器依赖体积
### 6. 反推使用
- 分页/乐观锁不生效先查注册与顺序
### 7. 速记卡 + 预告
- 下一篇分页插件源码
