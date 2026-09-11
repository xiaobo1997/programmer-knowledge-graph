---
title: 云原生 · Kubernetes 生态
aside: false
wordCount: 1377
readMinutes: 4
---

# 云原生 · Kubernetes 生态

> K8s 是事实上的容器编排标准，但「学 K8s」≠「会用 kubectl」。本系列从**机制层**开始建心智模型，再到**组件层**深挖核心能力，最后用**从零搭一个 K8s demo** 验证机制——避免读完只会读官方文档。

## 一、为什么写这个系列

学 K8s 的人常遇到三个困境：

1. **读完文档不会用**——API 文档列了 200+ CRD，但不知道「为什么先有 Pod 再有 Deployment」「为什么 Service 默认 ClusterIP」「为什么需要 CNI/CSI/CRI 分层」
2. **会用但不知为何**——能跑 yaml，但排障时看不懂 kubelet 日志、scheduler 决策、etcd 行为
3. **懂 K8s 但不懂生态**——Istio / Argo CD / Prometheus 这些「K8s 周边」为什么要独立、怎么和 K8s 配合、各自的边界在哪

本系列按 4 层架构组织：

```
L1 入门层：是什么 + 为什么 + 怎么用（机制 + tips 点组件）
L2 特性层：核心机制深挖（Scheduler / API Server / etcd / Operator 模式）
L3 专题层：跨特性专题（生产化 / 可观测性 / 安全 / 多集群治理）
L4 整合层：全景 + 选型决策 + 从零搭 demo
```

## 二、抽象 vs 实现讲法（系列总原则）

按总规划「抽象 → 实现 → 深挖」三层讲法：

| 层 | 讲什么 | 角色 |
|---|---|---|
| **抽象/机制** | 容器编排这一类东西的机制，不绑定 K8s | 主角 |
| **实现/对比** | K8s 怎么做 + 和 Nomad/Swarm/Mesos 的差异 | 例证 |
| **深挖组件** | K8s 某个组件深挖（如 Scheduler） | 单独成系列 |

**核心原则**：L1-L2 阶段**机制是主角**（建立「为什么这么设计」的心智模型），K8s 作为例子出现；L3-L4 阶段**K8s 是主角**（深挖组件与生态）。

## 三、4 层目录全景

```
docs/devops/kubernetes/
├── index.md                              ← 你正在看的（导航 + 写作清单）
├── 入门层/                                ← L1：概念入门（8-10 篇，已铺）
│   └── 从零开始认识K8s生态系列/
├── 特性层/                                ← L2：核心机制深挖（15-20 篇，待铺）
│   └── 深入理解K8s核心特性系列/
├── 专题层/                                ← L3：跨特性专题（10-15 篇，待铺）
│   ├── K8s生产化深度/
│   ├── K8s可观测性专题/
│   ├── K8s安全与多租户专题/
│   └── K8s多集群治理专题/
└── 整合层/                                ← L4：跨专题综合（3-6 篇 + 子目录，待铺）
    ├── K8s架构全景-选型决策/
    ├── 代码实践/
    ├── 场景实践/
    ├── 工具接入/
    └── agent/                              ← 从零搭一个 K8s demo（机制层 L4）
```

## 四、写作清单

### ✅ L1 入门层（10 篇 · 全铺完）

| # | 题目 | 状态 | 锚点命中 |
|:--:|------|:---:|:---:|
| 0 | 系列导读-全景 | ✅ | — |
| 1 | K8s 是什么与为什么需要 | ✅ | 机制穿透 |
| 2 | 容器与 K8s 关系全景 | ✅ | 机制穿透 |
| 3 | Pod 是 K8s 最小调度单位 | ✅ | 机制穿透 |
| 4 | Deployment 与声明式 API | ✅ | 机制穿透 |
| 5 | Service 与 ClusterIP | ✅ | 跨系统架构 |
| 6 | Ingress 与 Gateway API | ✅ | 跨周期经验 |
| 7 | ConfigMap / Secret / PV | ✅ | 跨系统架构 |
| 8 | K8s 生态分层（CNI/CSI/CRI/Operator） | ✅ | 跨系统架构 |
| 9 | 容器编排选型（K8s vs Nomad vs Swarm） | ✅ | 跨公司视角 |

### ⏳ L2 特性层（15-20 篇 · 待铺）

子系列 A 核心调度机制（5-6 篇）：
- Scheduler 调度原理 / 节点资源模型 / 调度策略 / Pod 生命周期 / 控制循环 / 弹性伸缩

子系列 B 核心抽象机制（5-6 篇）：
- etcd 与 K8s 数据一致性 / API Server / CRD Operator / RBAC / Network Policy / 镜像安全

子系列 C 核心运行机制（4-5 篇）：
- kubelet / kube-proxy / DNS / 存储子系统

子系列 D Etcd 与分布式协调（4 篇，组件视角深挖）：
- etcd 架构全景与协调组件对比 / Raft 工程实现与线性一致读 / MVCC 与 Watch / Lease 与生产运维

### ⏳ L3 专题层（10-15 篇 · 待铺）

- K8s 生产化深度（4-5 篇）
- K8s 可观测性专题（3-4 篇）
- K8s 安全与多租户专题（3-4 篇）
- K8s 多集群治理专题（3-4 篇）

### ⏳ L4 整合层（3-6 篇 + 子目录 · 待铺）

- K8s 架构全景：从入门到生产
- 选型决策树：K8s / Nomad / Swarm / Mesos
- 跨周期视角：K8s 5 年演进与未来
- agent：从零搭一个最小可运行 K8s demo

## 五、与相邻分类的关系

- **architecture/system-design/**：分布式理论/分布式 ID/分布式事务/分布式系统设计—— K8s 解决的是「分布式系统怎么部署/调度/运维」，上游引用，不复写
- **devops/docker/**：Docker 是 K8s 的容器底座之一（CRI 实现），入门层会引用
- **middleware/**：服务网格（Istio）、消息中间件（K8s 上部署）会与 K8s 网络/存储产生交集

## 六、维护说明

- 新增 L1 文章 → 更新本文「L1 入门层」表格
- 新增 L2/L3/L4 文章 → 同步更新对应层表格
- 整合层子目录新增 demo → 在「agent/」下单独建工程目录（按 `project-demo-template.md` 9 段模板）

## 📌 数据与事实声明

- K8s 版本基线：本系列写于 2026-09，针对 K8s 1.30+ 版本生态
- 时效性验证：所有版本相关数据已用 gh CLI + ddgs + browser 三件套核实（截至 2026-09-07）
- 免责：K8s 版本演进快，文中 API/默认值以官方文档为准

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 官方文档 | Kubernetes Documentation | kubernetes.io/docs |
| 官方源码 | kubernetes/kubernetes | github.com/kubernetes/kubernetes |
| 官方文档 | Container Orchestration | kubernetes.io/docs/concepts/overview/ |
| 生态 | CNCF Landscape | landscape.cncf.io |
| 生态 | Gateway API | gateway-api.sigs.k8s.io |
