---
title: PowerJob Server-Worker 架构
date: 2026-09-16
aside: false
wordCount: 0
readMinutes: 0
---

# PowerJob Server-Worker 架构

> PowerJob 的核心架构：Server 做决策，Worker 做执行——去中心化 ≠ 无中心。

## 一句话摘要

> Server-Worker = 决策层 + 执行层——Server 不执行，Worker 不决策，各司其职。

## 架构模型

|| 组件 | 职责 | 部署 |
|---|---|---|---|
| Server | 调度决策 / 分片 / 存储 | 集群 |
| Worker | 任务执行 | 接入业务机器 |
| Ops | 运维控制台 | 独立 |

## 通信机制

- Server → Worker：HTTP 推送 / 长连接
- Worker → Server：心跳 + 回调
- Server 间：集群共识

## 与 xxl-job 对比

|| 维度 | XXL-Job | PowerJob |
|---|---|---|
| 架构 | 中心化 | Server-Worker |
| 秒级 | 不支持 | 支持 |
| 工作流 | 基础 | 完整 |
| 部署 | 独立应用 | 内嵌 Worker |

## 生产陷阱

- ❌ Worker 不配心跳——Server 感知不到离线
- ❌ Server 单点——集群部署
- ❌ Worker 与业务混部署——资源争抢

## 量级参考

- 10w 档：默认够用
- 千万级：Worker 集群 + Server 集群
- 亿级：多机房部署