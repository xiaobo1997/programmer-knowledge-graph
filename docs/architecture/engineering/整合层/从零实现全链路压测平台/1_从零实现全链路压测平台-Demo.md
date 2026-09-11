---
title: 从零实现全链路压测平台
type: demo
tags: [压测, 全链路, 影子流量, 可观测, 高并发, Demo]
date: 2026-09-11
wordCount: 1003
readMinutes: 3
---

# 从零实现全链路压测平台

> 本 Demo 目标：从零实现一个支持流量录制回放、自动化瓶颈定位、扩容预案生成的全链路压测平台。

## 一、项目定位

| 项目 | 说明 |
|---|---|
| **目标** | 从零实现全链路压测平台 |
| **核心指标** | 流量录制回放 / 瓶颈定位 / 扩容预案 |
| **技术选型** | Go + Kafka + Prometheus |
| **适用场景** | 全链路压测/流量回放/性能调优 |

## 二、架构总览

```
┌─────────────────────────────────────────────────┐
│                   全链路压测平台架构                      │
│                                                          │
│  录制模块 ──→ 回放模块 ──→ 瓶颈定位 ──→ 扩容预案     │
│     │                │              │                  │
│     ↓                ↓              ↓                  │
│  Kafka (流量)      Prometheus     分析引擎       │
│     │                │              │                  │
│     └────────────────┴──────────────┘                 │
│                     CI/CD 集成                       │
└─────────────────────────────────────────────────┘
```

## 三、技术选型 ADR

| 组件 | 选型 | 备选 | 废弃理由 |
|---|---|---|---|
| **录制** | Kafka | RocketMQ | Kafka 高吞吐 |
| **回放** | Go | Java | Go 并发简单 |
| **监控** | Prometheus | 无 | Prometheus 生态 |
| **分析** | 自研 | 无 | 定制化需求 |

## 四、核心模块实现

### 4.1 流量录制

```go
// 流量录制器
type Recorder struct {
    kafkaProducer *kafka.Producer
    topic         string
}

func (r *Recorder) Record(req *http.Request) {
    // 录制请求
    data, _ := json.Marshal(map[string]interface{}{
        "method":   req.Method,
        "url":      req.URL.String(),
        "headers":  req.Header,
        "body":     req.Body,
        "time":     time.Now(),
    })
    
    // 发送到 Kafka
    r.kafkaProducer.Produce(&kafka.Message{
        Topic: r.topic,
        Value: data,
    })
}
```

### 4.2 流量回放

```go
// 流量回放器
type Replayer struct {
    kafkaConsumer *kafka.Consumer
    client        *http.Client
}

func (rp *Replayer) Replay() {
    for {
        msg := rp.kafkaConsumer.ReadMessage(-1)
        
        // 解析请求
        var reqData map[string]interface{}
        json.Unmarshal(msg.Value, &reqData)
        
        // 回放请求
        req, _ := http.NewRequest(
            reqData["method"].(string),
            reqData["url"].(string),
            bytes.NewReader(reqData["body"].([]byte)),
        )
        rp.client.Do(req)
    }
}
```

### 4.3 瓶颈定位

```go
// 瓶颈定位器
type BottleneckDetector struct {
    metrics *MetricsCollector
}

func (bd *BottleneckDetector) Detect() []Bottleneck {
    bottlenecks := []Bottleneck{}
    
    // 1. 检查 DB 延迟
    dbLatency := bd.metrics.GetDBLatency()
    if dbLatency > 100*time.Millisecond {
        bottlenecks = append(bottlenecks, Bottleneck{
            Type:    "DB",
            Detail:  "数据库延迟过高",
            Latency: dbLatency,
        })
    }
    
    // 2. 检查缓存命中率
    cacheHitRate := bd.metrics.GetCacheHitRate()
    if cacheHitRate < 0.8 {
        bottlenecks = append(bottlenecks, Bottleneck{
            Type:    "Cache",
            Detail:  "缓存命中率过低",
            HitRate: cacheHitRate,
        })
    }
    
    // 3. 检查网络延迟
    netLatency := bd.metrics.GetNetworkLatency()
    if netLatency > 50*time.Millisecond {
        bottlenecks = append(bottlenecks, Bottleneck{
            Type:    "Network",
            Detail:  "网络延迟过高",
            Latency: netLatency,
        })
    }
    
    return bottlenecks
}
```

### 4.4 扩容预案

```go
// 扩容预案生成器
type ScalingPlanner struct {
    metrics *MetricsCollector
}

func (sp *ScalingPlanner) Plan() ScalingPlan {
    plan := ScalingPlan{}
    
    // 1. 计算当前容量
    currentQPS := sp.metrics.GetCurrentQPS()
    maxQPS := sp.metrics.GetMaxQPS()
    
    // 2. 计算扩容需求
    if currentQPS > maxQPS*0.8 {
        plan.ScaleUp = true
        plan.TargetQPS = currentQPS * 2
        plan.Instances = int(currentQPS / maxQPS) + 1
    }
    
    // 3. 计算扩容时机
    plan.ScaleTime = time.Now().Add(5 * time.Minute)
    
    return plan
}
```

## 五、量级验证

| 指标 | 目标 | 实测 |
|---|---|---|
| 录制吞吐 | 10w QPS | 待压测 |
| 回放精度 | 秒级 | 待压测 |
| 瓶颈定位 | < 5s | 待压测 |
| 扩容响应 | < 30s | 待压测 |

## 六、运维与可观测

```
监控大盘：
  ┌──────────────────────────────────────┐
  │ 压测平台监控指标                           │
  ├──────────────────────────────────────┤
  │ 录制 QPS │ 回放延迟 │ 瓶颈数量       │
  │ 扩容次数 │ 预案执行率 │ 告警数量    │
  │ 压测耗时 │ 压测成功率 │ 资源消耗     │
  └──────────────────────────────────────┘
```

## 七、已知限制

- 当前实现为单机录制，未支持分布式录制
- 瓶颈定位依赖 Prometheus 指标
- 扩容预案需要手动确认

## 八、快速开始

```bash
# 1. 启动 Kafka
docker run -d -p 9092:9092 kafka:3

# 2. 启动压测平台
go build -o loadtest main.go
./loadtest -config config.yaml

# 3. 录制流量
curl -X POST http://localhost:8080/record -d '{"url": "/api"}'

# 4. 回放流量
curl -X POST http://localhost:8080/replay
```

## 九、Trade-off 评估

| 决策 | 选 A | 选 B | Trade-off |
|---|---|---|---|
| 录制 | Kafka | RocketMQ | Kafka 高吞吐，RocketMQ 事务 |
| 回放 | Go | Java | Go 并发简单，Java 生态 |
| 监控 | Prometheus | 无 | Prometheus 生态成熟 |
| 分析 | 自研 | 无 | 定制化 vs 开箱即用 |

## 📌 数据与事实声明

- 写于 2026-09-11，机制以 Go 1.21 / Kafka 3.x 为基准
- 量级红线为行业认知口径，决策需按实际业务压测校准
- 事故案例为公开技术社区高频案例模式的匿名化复述
- 工具口径以各组件官方文档为准

## 📚 参考资料

- Kafka 官方文档：https://kafka.apache.org/documentation
- Prometheus 官方文档：https://prometheus.io/docs/
- Go 官方文档：https://golang.org/doc/