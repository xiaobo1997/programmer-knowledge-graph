---
title: "Actuator 监控与生产就绪"
type: concept
tags: [Spring Boot, 运维, L1入门层]
date: 2026-09-03
wordCount: 0
readMinutes: 0
---

# Actuator 监控与生产就绪

> Actuator 端点、健康检查、metrics 指标、优雅停机——应用上线后的可观测性底座。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：上线不等于结束

- 生产可观测性的三支柱：日志/指标/链路
- Actuator 在其中的角色

### 2. 核心：Actuator 端点

- 常用端点：health/info/metrics/env
- 端点暴露的安全控制
- 自定义 health indicator

### 3. 机制：metrics 与 Prometheus

- Micrometer 指标体系
- 与 Prometheus + Grafana 的集成
- JVM/连接池/HTTP 关键指标

### 4. 实践：优雅停机与就绪

- shutdown 端点与 graceful 停机
- 启动探针/就绪探针（k8s 衔接）
- 健康检查在负载均衡摘流中的使用

### 6. 速记卡 + 下篇预告

- 一张表收束本篇关键点
- 预告下一篇的衔接问题
