---
title: 服务治理
aside: false
wordCount: 281
readMinutes: 1
---

# ⬡ 服务治理

> 治理层三环节：通信（RPC）+ 服务治理（注册/配置/负载均衡/路由/容错/网关/分组版本/上下线/鉴权/元数据）+ 稳定性（限流/熔断/降级/监控/追踪/应急/发布）。

## 子目录

**通信**

- `rpc/` — RPC 远程过程调用（协议/序列化/服务发现/容错）

**服务治理**

- `service-discovery/` — 服务注册与发现（注册/订阅/健康检查/AP 与 CP）
- `config-center/` — 配置中心（存储/订阅/动态刷新/灰度/回滚）
- `load-balancing/` — 负载均衡（随机/轮询/一致性哈希/最少活跃）
- `service-routing/` — 服务路由（条件/标签/灰度/泳道）
- `cluster-fault-tolerance/` — 集群容错（failover/failfast/failsafe/failback）
- `gateway/` — 网关（路由/过滤链/协议转换/限流鉴权）
- `service-versioning/` — 服务分组与版本（版本管理/分组隔离/多版本灰度）
- `graceful-shutdown/` — 优雅上下线（优雅停机/摘除/预热/无损发布）
- `service-auth/` — 服务鉴权（认证/授权/mTLS/Token）
- `metadata-center/` — 元数据中心（标签/属性/元数据应用）

**稳定性**

- `stability/` — 稳定性工程（限流/熔断/降级/监控/追踪/应急/发布）
