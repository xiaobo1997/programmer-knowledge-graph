---
title: 事务消息
aside: false
wordCount: 170
readMinutes: 1
---

# 事务消息

RocketMQ 事务消息专题。

## 文章

- [RocketMQ 事务消息：分布式事务的工程实践](./1_transactional-message) — 写 DB + 通知下游的强一致方案

## 何时用事务消息

| 场景 | 适合度 |
|---|---|
| 写业务单 + 通知下游 | ⭐⭐⭐ 强推荐 |
| 异步通知下游 | ⭐⭐ 推荐 |
| 强一致账户扣减 | ❌ 用 TCC |
| 大数据流处理 | ❌ 用 Kafka |

## 核心机制

半消息 + 回查：
1. 生产者发送**半消息**（对消费者不可见）
2. 生产者执行**本地事务**
3. 根据结果 Commit / Rollback
4. 若生产者挂了，Broker **定时回查** checkLocalTransaction()

详细原理 + 代码 + 踩坑见上方文章。