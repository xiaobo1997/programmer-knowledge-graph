---
title: 从零实现高性能网关
type: demo
tags: [网关, Nginx, Envoy, 性能调优, 高并发, Demo]
date: 2026-09-11
wordCount: 992
readMinutes: 3
---

# 从零实现高性能网关

> 本 Demo 目标：从零实现一个支持限流/熔断/路由/协议转换的高性能网关，单机 10w+ RPS，P99 < 5ms，支持热加载规则。

## 一、项目定位

| 项目 | 说明 |
|---|---|
| **目标量级** | 10w RPS |
| **核心指标** | P99 < 5ms / 热加载规则 / 不重启生效 |
| **技术选型** | Go + Nginx + Redis + Prometheus |
| **适用场景** | 微服务网关 / API 网关 / 流量入口 |

## 二、架构总览

```
┌─────────────────────────────────────────────────┐
│                   高性能网关架构                        │
│                                                       │
│  客户端 → 负载均衡 → 网关 → 过滤链 → 后端服务   │
│               ↑                                    │
│         路由/鉴权/限流/熔断                         │
│                                                       │
│  核心组件：                                              │
│  ├── Go: 网关主程序 (高并发)                        │
│  ├── Nginx: 负载均衡 + 反向代理                   │
│  ├── Redis: 限流计数器 + 规则存储                 │
│  └── Prometheus: 监控 + 告警                     │
└─────────────────────────────────────────────────┘
```

## 三、技术选型 ADR

| 组件 | 选型 | 备选 | 废弃理由 |
|---|---|---|---|
| **网关语言** | Go | Java/Rust | Go 并发模型简单，生态成熟 |
| **限流算法** | 令牌桶 | 滑动窗口 | 令牌桶实现简单，突发友好 |
| **熔断器** | 三态状态机 | 无 | 三态可防止误触发 |
| **路由** | 静态配置 + 热加载 | 动态注册 | 静态配置简单可靠 |
| **监控** | Prometheus | 无 | Prometheus 生态成熟 |

## 四、核心模块实现

### 4.1 限流模块

```go
// 令牌桶限流器
type TokenBucket struct {
    rate     float64   // 令牌生成速率
    capacity int64     // 桶容量
    tokens   int64     // 当前令牌数
    lastTime int64     // 上次生成时间
    mu       sync.Mutex
}

func (tb *TokenBucket) Allow() bool {
    tb.mu.Lock()
    defer tb.mu.Unlock()
    
    now := time.Now().UnixNano()
    elapsed := float64(now - tb.lastTime) / 1e9
    
    // 生成令牌
    tb.tokens += int64(elapsed * tb.rate)
    if tb.tokens > tb.capacity {
        tb.tokens = tb.capacity
    }
    tb.lastTime = now
    
    // 消费令牌
    if tb.tokens >= 1 {
        tb.tokens--
        return true
    }
    return false
}
```

### 4.2 熔断模块

```go
// 三态熔断器
type CircuitBreaker struct {
    state           State
    errorRate       float64
    callVolume      int64
    statisticalWindow time.Duration
    waitDuration    time.Duration
    halfOpenCalls   int64
    mu              sync.Mutex
}

func (cb *CircuitBreaker) Call(fn func() error) error {
    cb.mu.Lock()
    state := cb.state
    cb.mu.Unlock()
    
    switch state {
    case Closed:
        err := fn()
        if err != nil {
            cb.recordError()
        }
        return err
    case Open:
        return errors.New("circuit breaker is open")
    case HalfOpen:
        err := fn()
        if err != nil {
            cb.setState(Open)
        } else {
            cb.setState(Closed)
        }
        return err
    }
    return nil
}
```

### 4.3 路由模块

```go
// 路由规则
type Route struct {
    Path     string
    Method   string
    Backend  string
    Weight   int
}

// 路由匹配
func (r *Route) Match(path, method string) bool {
    return r.Path == path && r.Method == method
}
```

## 五、量级验证

| 指标 | 目标 | 实测 |
|---|---|---|
| RPS | 10w+ | 待压测 |
| P99 延迟 | < 5ms | 待压测 |
| 限流精度 | ±5% | 待压测 |
| 熔断响应 | < 100ms | 待压测 |
| 热加载 | 不重启生效 | 待验证 |

## 六、运维与可观测

```
监控大盘：
  ┌──────────────────────────────────────┐
  │ 网关监控指标                             │
  ├──────────────────────────────────────┤
  │ RPS │ P99/P95 延迟 │ 错误率          │
  │ 限流命中数 │ 熔断状态 │ 路由匹配耗时    │
  │ 连接数 │ 内存使用 │ CPU 使用率         │
  └──────────────────────────────────────┘
```

## 七、已知限制

- 当前实现为单机版，未支持集群
- 未实现动态路由注册（静态配置）
- 未实现协议转换（HTTP → gRPC）

## 八、快速开始

```bash
# 1. 启动 Redis
docker run -d -p 6379:6379 redis:7

# 2. 启动网关
go build -o gateway main.go
./gateway -config config.yaml

# 3. 压测
wrk -t4 -c100 -d30s http://localhost:8080/api
```

## 九、Trade-off 评估

| 决策 | 选 A | 选 B | Trade-off |
|---|---|---|---|
| 限流算法 | 令牌桶 | 滑动窗口 | 令牌桶简单，滑动窗口平滑 |
| 熔断器 | 三态 | 无 | 三态防误触发，无态简单 |
| 语言 | Go | Java | Go 并发简单，Java 生态丰富 |
| 存储 | Redis | 内存 | Redis 持久化，内存更快 |

## 📌 数据与事实声明

- 写于 2026-09-11，机制以 Go 1.21 / Nginx 1.24 / Redis 7.x 为基准
- 量级红线为行业认知口径，决策需按实际业务压测校准
- 事故案例为公开技术社区高频案例模式的匿名化复述
- 工具口径以各组件官方文档为准

## 📚 参考资料

- Nginx 官方文档：https://nginx.org/en/docs/
- Envoy 官方文档：https://www.envoyproxy.io/docs/
- Go 官方文档：https://golang.org/doc/