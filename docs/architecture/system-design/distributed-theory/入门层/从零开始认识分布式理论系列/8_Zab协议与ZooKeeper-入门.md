---
title: Zab 协议与 ZooKeeper
date: 2026-09-06
type: deep-dive
tags: [架构, 分布式, 规划中]
wordCount: 252
readMinutes: 1
---

# Zab 协议与 ZooKeeper

> Zab 与 Raft 的异同——同一问题的另一种工程解法。
>
> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## Zab 的两个模式

- 崩溃恢复模式：Leader 挂后选新主 + 同步日志（选主阶段）
- 消息广播模式：类似 2PC 的 propose-ack-commit（正常服务阶段）
- ZooKeeper 的所有写请求都走 Zab

## Zab 与 Raft 的异同

- 相同：多数派提交、单 Leader、日志复制、任期纪元
- 差异：选主细节（Zab 看 zxid 最大的）、日志提交约束、epoch 语义
- 工程现状：ZooKeeper 主线 3.9.x 活跃（2026-09-05 核实），etcd（Raft）在 K8s 生态占主流

## 为什么 Raft 成了工程主流

- 可理解性 → 实现少踩坑 → 生态采用多（etcd/Consul/TiKV 等）
- ZooKeeper 因 CP + 客户端模型限制，新场景多用 etcd
- 理论等价、生态不同的演进启示

（正文落盘时按规划大纲展开，骨架占位不影响站点构建）
