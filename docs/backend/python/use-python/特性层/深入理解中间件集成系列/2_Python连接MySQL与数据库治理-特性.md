---
title: Python 连接 MySQL：ORM 进阶与数据库治理
type: concept
tags: [Python, MySQL, 中间件, 入门层]
date: 2026-09-16
wordCount: 2000
readMinutes: 7
aside: false
---

# Python 连接 MySQL：ORM 进阶与数据库治理

## 一句话摘要

Python 操作 MySQL 的三种方式：原生 SQL / SQLAlchemy ORM / Django ORM。核心是连接池 + 事务 + 读写分离。

## 三种方式对比

| 方式 | 优点 | 缺点 | 适用 |
|---|---|---|---|
| 原生 SQL | 灵活 | 拼接繁琐 | 复杂查询 |
| SQLAlchemy | 灵活 + ORM | 学习曲线 | 企业级 |
| Django ORM | 简单 | 绑定 Django | Django 项目 |

## SQLAlchemy 核心

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))

engine = create_engine('mysql+pymysql://user:pass@localhost/db')
Session = sessionmaker(bind=engine)
```

## 连接池

```python
engine = create_engine(
    'mysql+pymysql://user:pass@localhost/db',
    pool_size=10,          # 连接池大小
    max_overflow=20,       # 最大溢出
    pool_timeout=30,       # 超时
    pool_recycle=3600      # 回收
)
```

## 事务管理

```python
# 方式一：上下文管理器
with Session.begin() as session:
    session.add(user)

# 方式二：手动提交
session = Session()
try:
    session.add(user)
    session.commit()
except:
    session.rollback()
    raise
```

## 读写分离

```python
# 主库写
write_engine = create_engine('mysql+pymysql://master/...')
# 从库读
read_engine = create_engine('mysql+pymysql://slave/...')
```

## 分库分表

- ShardingSphere
- MyCat
- 应用层分片（按 user_id hash）

## 常见问题

1. **连接泄漏**：未关闭连接 → 连接池耗尽
2. **事务超时**：长事务占用连接
3. **N+1 查询**：ORM 懒加载陷阱
4. **死锁**：事务交叉锁

## 量级考量

| 量级 | 数据库方案 |
|---|---|
| < 100万行 | 单库单表 |
| 100万-1亿 | 主从 + 读写分离 |
| > 1亿 | 分库分表 |

## 📌 数据与事实声明

- SQLAlchemy 是 Python 最流行的 ORM
- 分库分表方案基于业界实践
