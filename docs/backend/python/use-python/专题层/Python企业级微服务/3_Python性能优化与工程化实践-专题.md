---
title: Python 性能优化与工程化实践
type: practice
tags: [Python, 性能, 工程化, 专题层]
date: 2026-09-16
wordCount: 3000
readMinutes: 10
aside: false
---

# Python 性能优化与工程化实践

## 一句话摘要

Python 性能优化 = **代码层 + 运行层 + 架构层**。本文讲透三层优化 + 工程化实践。

## 代码层优化

### 1. 算法优化

```python
# 坏：O(n²)
result = [x for x in list1 if x in list2]

# 好：O(n)
set2 = set(list2)
result = [x for x in list1 if x in set2]
```

### 2. 数据结构

| 操作 | list | dict | set |
|---|---|---|---|
| 查找 | O(n) | O(1) | O(1) |
| 插入 | O(1) | O(1) | O(1) |
| 删除 | O(n) | O(1) | O(1) |

### 3. 内置函数

```python
# 慢
result = []
for x in data:
    result.append(x * 2)

# 快
result = list(map(lambda x: x * 2, data))

# 最快
result = [x * 2 for x in data]
```

## 运行层优化

### 1. Cython

```python
# 伪代码：Cython
cdef int compute(int n):
    cdef int i, result = 0
    for i in range(n):
        result += i
    return result
```

### 2. 多进程

```python
# 伪代码：多进程
from multiprocessing import Pool

with Pool(4) as p:
    results = p.map(compute, data)
```

### 3. 异步

```python
# 伪代码：asyncio
import asyncio

async def main():
    tasks = [compute(x) for x in data]
    results = await asyncio.gather(*tasks)
```

## 架构层优化

### 1. 缓存

```python
# 伪代码：缓存
import redis

client = redis.Redis()

def get_data(key):
    data = client.get(key)
    if data:
        return data
    data = compute()
    client.set(key, data)
    return data
```

### 2. 异步任务

```python
# 伪代码：Celery
from celery import Celery

app = Celery('tasks', broker='redis://localhost')

@app.task
def async_task(data):
    return compute(data)
```

### 3. 数据库优化

```python
# 伪代码：SQL 优化
# 坏：N+1 查询
for user in users:
    print(user.profile)

# 好：JOIN 查询
users = session.query(User).join(Profile).all()
```

## 工程化实践

### 1. 项目结构

```
project/
├── apps/           # 业务模块
├── libs/           # 公共库
├── configs/        # 配置
├── tests/          # 测试
├── docker/         # Docker
└── k8s/            # K8s
```

### 2. 测试

```python
# 伪代码：pytest
import pytest

def test_compute():
    assert compute(10) == 45
```

### 3. CI/CD

```yaml
# 伪代码：GitHub Actions
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: pip install -r requirements.txt
      - run: pytest
```

## 踩坑记录

1. **过早优化**：先 profiling 再优化
2. **缓存一致性**：缓存与数据库不一致
3. **异步误用**：CPU 密集型用 asyncio
4. **连接池耗尽**：连接未释放

## 量级考量

| 量级 | 优化策略 |
|---|---|
| < 100 QPS | 代码优化 |
| 100-1000 QPS | 缓存 + 异步 |
| > 1000 QPS | 架构优化 + Cython |

## 📌 数据与事实声明

- 优化策略基于 Python 实践
- 踩坑来自生产环境经验
