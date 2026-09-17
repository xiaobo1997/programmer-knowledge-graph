---
title: Python 消息队列集成：RabbitMQ 与 Kafka
type: concept
tags: [Python, RabbitMQ, Kafka, 中间件, 特性层]
date: 2026-09-16
wordCount: 2800
readMinutes: 10
aside: false
---

# Python 消息队列集成：RabbitMQ 与 Kafka

## 一句话摘要

Python 消息队列选型：**RabbitMQ = 可靠路由 / Kafka = 高吞吐流处理**。本文覆盖两种客户端的核心用法 + 生产踩坑。

## RabbitMQ（可靠消息）

### 场景定位

- 任务队列 / 异步解耦 / 可靠投递
- 适合：订单处理、邮件通知、事务消息

### 核心概念

```
Producer → Exchange → Queue → Consumer
         direct/fanout/topic/headers
```

### 生产者

```python
import pika

connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost')
)
channel = connection.channel()

# 声明 durable 队列
channel.queue_declare(queue='task_queue', durable=True)

# 持久化消息
channel.basic_publish(
    exchange='',
    routing_key='task_queue',
    body='hello',
    properties=pika.BasicProperties(delivery_mode=2)  # persistent
)
connection.close()
```

### 消费者（手动 ACK）

```python
def callback(ch, method, properties, body):
    try:
        process(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)  # 手动确认
    except Exception:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

channel.basic_consume(queue='task_queue', on_message_callback=callback)
channel.start_consuming()
```

### 发布确认（Publisher Confirm）

```python
channel.confirm_delivery()  # 开启发布确认
try:
    channel.basic_publish(...)
except pika.exceptions.UnroutableError:
    # 消息未到达队列，补偿处理
    retry_or_log()
```

## Kafka（高吞吐流）

### 场景定位

- 日志聚合 / 事件流 / 实时计算
- 适合：用户行为追踪、风控数据流、CDC

### 生产者

```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    acks='all',              # 所有 ISR 确认
    retries=3,               # 失败重试
    enable_idempotence=True  # 幂等写入
)

producer.send('events', {'user_id': 1, 'action': 'login'})
producer.flush()
```

### 消费者（消费者组）

```python
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'events',
    bootstrap_servers=['localhost:9092'],
    group_id='my-group',
    auto_offset_reset='earliest',  # 从头开始
    enable_auto_commit=False       # 手动提交偏移量
)

for msg in consumer:
    process(msg.value)
    consumer.commit()  # 手动提交
```

## RabbitMQ vs Kafka 对比

|| 维度 | RabbitMQ | Kafka |
|---|---|---|---|
| 吞吐 | 中（万级/s） | 高（百万级/s） |
| 路由 | 丰富（exchange 类型） | 简单（topic + partition） |
| 持久化 | 消息级持久化 | 日志文件持久化 |
| 消费模型 | 队列消费 | 消费者组 |
| 适用 | 任务队列 / 可靠投递 | 流处理 / 日志聚合 |

## 生产踩坑

1. **RabbitMQ 消息丢失**
   - 未开启持久化 + 手动 ACK → 生产者确认 + 队列 durable + 消息 persistent + 手动 ACK

2. **Kafka 重复消费**
   - 消费者崩溃后重平衡 → 偏移量手动提交 + 幂等消费

3. **连接数暴增**
   - 消费者未关闭连接 → 用连接池 + heartbeat

4. **消息堆积**
   - 消费速度 < 生产速度 → 扩容消费者 + 监控 lag

## 量级考量

|| 量级 | 方案 |
|---|---|---|
| < 1000 msg/s | RabbitMQ 单队列 |
| 1000-10万 msg/s | RabbitMQ 集群 / Kafka 小集群 |
| > 10万 msg/s | Kafka 大集群 + 分区扩展 |

## 📌 数据与事实声明

- pika 是 Python 最流行的 RabbitMQ 客户端
- kafka-python 是社区 Kafka 客户端（Confluent 官方客户端另计）
- 踩坑来自生产环境经验
