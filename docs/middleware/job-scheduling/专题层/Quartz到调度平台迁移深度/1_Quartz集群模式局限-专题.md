---
title: Quartz集群模式局限
date: 2026-09-16
aside: false
wordCount: 231
readMinutes: 1
---

# Quartz 集群模式局限

> Quartz 是老牌调度框架——集群模式有局限，迁移是常态。

## 一句话摘要

> Quartz 集群 = DB 锁 + 节点竞争——锁争用 = 性能瓶颈，迁移不可避免。

## Quartz 集群原理

|| 组件 | 职责 |
|---|---|---|
| Scheduler | 调度器 | 触发 + 执行 |
| JobStore | 存储 | DB 持久化 |
| Cluster | 集群 | 节点竞争 |

## 集群局限

|| 局限 | 说明 |
|---|---|---|
| DB 锁 | 竞争锁 | 性能瓶颈 |
| 主从切换 | 切换时间 | 秒级中断 |
| 扩缩容 | 加节点 | 需重启 |
| 状态管理 | 状态存储 | DB 压力 |

## 迁移路径

|| 目标 | 迁移成本 |
|---|---|---|
| XXL-Job | 中 | 配置迁移 |
| PowerJob | 高 | 架构重写 |
| ElasticJob | 中 | API 适配 |

## 生产陷阱

- ❌ Quartz 集群不做锁优化 = DB 瓶颈
- ❌ 不做迁移规划 = 旧锁难解
- ❌ 状态不持久化 = 宕机丢失

## 量级参考

- 10w 档：Quartz 够用
- 千万级：迁移到 XXL-Job
- 亿级：迁移到 PowerJob