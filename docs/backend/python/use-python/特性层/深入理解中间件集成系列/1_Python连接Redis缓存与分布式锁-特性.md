---
title: Python 连接 Redis：缓存与分布式锁
type: concept
tags: [Python, Redis, 中间件, 入门层]
date: 2026-09-16
wordCount: 1800
readMinutes: 6
aside: false
---

# Python 连接 Redis：缓存与分布式锁

## 一句话摘要

Python 操作 Redis 的三种方式：redis-py 直连 / Redis Cluster / 连接池。核心是缓存 + 分布式锁，这是企业级应用的基础设施。

## redis-py 基础

```python
import redis

# 连接池方式（推荐）
pool = redis.ConnectionPool(host='localhost', port=6379, db=0, max_connections=10)
r = redis.Redis(connection_pool=pool)

# 简单连接
r = redis.Redis(host='localhost', port=6379, db=0)
```

## 缓存模式

### Cache-Aside（旁路缓存）
```
读：
  1. 读缓存 → 命中则返回
  2. 未命中 → 读 DB → 写缓存 → 返回

写：
  1. 写 DB
  2. 删除缓存
```

### 缓存一致性
- 写 DB 后删缓存（不是更新缓存）
- 延时双删：写 DB → 删缓存 → 等待 → 删缓存
- 原因：并发写可能导致缓存脏数据

## 分布式锁

### 基本用法
```python
import redis

r = redis.Redis(host='localhost', port=6379, db=0)

# 简单的 setnx 锁
def acquire_lock(lock_key, expire=10):
    return r.set(lock_key, 'locked', nx=True, ex=expire)

def release_lock(lock_key):
    r.delete(lock_key)
```

### Redlock 算法
- 多 Redis 实例 → 加锁 → 释放
- 避免单点故障
- Python 实现：`redlock-py`

## 常见问题

1. **缓存穿透**：查不存在的数据 → 布隆过滤器
2. **缓存雪崩**：大量缓存同时过期 → 随机过期时间
3. **缓存击穿**：热点 key 过期 → 互斥锁
4. **锁超时**：业务执行时间 > 锁超时 → 续锁

## 量级考量

| 量级 | 架构 |
|---|---|
| < 1000 QPS | 单 Redis |
| 1000-10000 | Redis 主从 |
| > 10000 | Redis Cluster |

## 📌 数据与事实声明

- redis-py 是 Python 官方 Redis 客户端
- Redlock 是 Redis 官方推荐的分布式锁算法
