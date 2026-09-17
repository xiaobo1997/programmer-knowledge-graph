---
title: Python 整合层
wordCount: 113
readMinutes: 1
---

# Python 整合层

跨专题收束与量级演进——体系怎么串、5 年后怎么看。

## 规划篇目（陆续落盘）

| 篇目 | 定位 | 状态 |
|---|---|---|
| Python 工程全景与选型决策 | Web 框架/任务队列/数据栈的选型树 | ⏳ 待写 |
| 从脚本到平台：Python 应用的量级演进 | 单脚本 → 服务 → 平台的三段演进与阵痛 | ⏳ 待写 |

## 整合 Demo

| # | 篇目 | 架构 | 状态 |
|---|---|---|---|
| 1 | 订单支付微服务 Demo | FastAPI + Redis + MySQL + RabbitMQ + Nacos | ✅ 已完成 |
| 2 | 风控风控微服务 Demo | FastAPI + Redis + MySQL + Kafka + Prometheus + Grafana | ✅ 已完成 |

两个 Demo 覆盖企业级微服务的两种典型架构：**交易链路（订单→支付）** vs **风控链路（实时风控 → 异步处理）**。

## 关联

- 上游：[专题层](../专题层/index)