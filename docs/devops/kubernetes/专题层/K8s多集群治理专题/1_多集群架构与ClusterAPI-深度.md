---
title: K8s 多集群架构：Hub-Spoke / Mesh / Cluster API
type: deep-dive
tags: [DevOps & 云原生, Kubernetes, 多集群, Cluster API, 架构, 专题层]
date: 2026-09-07
wordCount: 1405
readMinutes: 4
---

# K8s 多集群架构：Hub-Spoke / Mesh / Cluster API

> 单集群 5000 节点是 K8s 极限——超过必须多集群。多集群架构有 Hub-Spoke、Mesh 等多种形态，Cluster API（CAPI）管理集群生命周期。本篇讲清三种架构对比、CAPI 工作机制、生产实践。

## 一句话摘要

多集群三种架构：Hub-Spoke（中心管理 + 多边缘集群）/ Mesh（对等互通）/ Hybrid（混合）；Cluster API（CAPI）通过 CRD + Controller 管理集群生命周期（创建/升级/删除）；生产推荐 Hub-Spoke + CAPI + Argo CD 的组合。

## 一、为什么需要多集群

### 1.1 单集群的极限

```mermaid
graph LR
    A["单集群"] -->|"5000+ 节点"| B["API Server 性能瓶颈"]
    A -->|"单 AZ"| C["灾备缺失"]
    A -->|"租户过多"| D["安全/合规风险"]
    style A fill:#ffaaa5

```

**关键认知**：
- 单集群 5000 节点是 API Server 性能上限
- 单 AZ 部署无灾备
- 多租户混部增加安全风险

### 1.2 多集群的价值

```mermaid
graph TD
    A["多集群"] --> B["1. 规模突破"]
    A --> C["2. 灾备(多 AZ/多 Region)"]
    A --> D["3. 合规隔离"]
    A --> E["4. 业务隔离"]
    A --> F["5. 云边协同"]
    style A fill:#a8e6a3

```

## 二、三种架构对比

### 2.1 Hub-Spoke（中心 + 边缘）

```mermaid
graph TB
    subgraph Hub["Hub 集群(中心)"]
        H["管理组件<br/>CAPI + Argo CD"]
    end

    subgraph Spoke1["Spoke 集群(边缘 1)"]
        S1["业务 Pod"]
    end

    subgraph Spoke2["Spoke 集群(边缘 2)"]
        S2["业务 Pod"]
    end

    H -->|"管理"| S1
    H -->|"管理"| S2
    style H fill:#a8e6a3
    style S1 fill:#ffd3a5
    style S2 fill:#ffd3a5

```

**特点**：
- ✅ 统一管理（中心集群管所有边缘集群）
- ✅ 工具链复用（CAPI/Argo CD 部署在 Hub）
- ❌ Hub 单点故障风险
- 适用：企业 / 大厂

### 2.2 Mesh（对等互通）

```mermaid
graph LR
    A["集群 A"] <-.->|"对等"| B["集群 B"]
    B <-.->|"对等"| C["集群 C"]
    A <-.->|"对等"| C
    style A fill:#a8e6a3
    style B fill:#a8e6a3
    style C fill:#a8e6a3

```

**特点**：
- ✅ 无中心单点
- ✅ 集群间自由互通
- ❌ 管理复杂（每集群都要配工具链）
- 适用：多云 / 多团队

### 2.3 Hybrid（混合）

```mermaid
graph TB
    subgraph Hub["Hub"]
        H["Argo CD"]
    end

    subgraph Spoke["Spoke 1(生产)"]
        S1["业务"]
    end

    subgraph Edge["边缘集群"]
        E1["IoT 网关"]
    end

    H -->|"管理"| S1
    H -->|"管理"| E1
    style H fill:#a8e6a3

```

**特点**：
- ✅ Hub-Spoke + Mesh 混合
- ✅ 灵活适配不同场景
- 适用：复杂企业（生产 + 边缘 + 多云）

### 2.4 选型决策

```mermaid
graph TD
    A["多集群选型"] --> Q{"是否需要<br/>统一管理?"}
    Q -->|"是"| B["Hub-Spoke"]
    Q -->|"否 + 多云"| C["Mesh"]
    Q -->|"否 + 单一云"| D["单集群"]
    style B fill:#a8e6a3
    style C fill:#a8e6a3
    style D fill:#ffd3a5

```

## 三、Cluster API（CAPI）

### 3.1 CAPI 是什么

```mermaid
graph TB
    A["Cluster API"] --> B["用 K8s 管理 K8s"]
    A --> C["CRD 定义集群"]
    A --> D["Controller 调和"]
    style A fill:#a8e6a3

```

**核心理念**：用 K8s 风格的声明式 API 管理 K8s 集群——和 HPA、Deployment 一致。

### 3.2 CAPI 核心 CRD

| CRD | 作用 |
|---|---|
| **Cluster** | 集群定义 |
| **Machine** | 节点定义（类似 Node 但由 CAPI 管） |
| **MachineDeployment** | 节点池（类似 Deployment） |
| **MachineSet** | 节点副本（类似 ReplicaSet） |
| **MachineHealthCheck** | 节点健康检查 |
| **ClusterClass** | 集群模板（可复用） |

### 3.3 CAPI 工作机制

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as CAPI Controller
    participant P as 云 Provider
    participant K as 新集群

    U->>C: 1. 创建 Cluster CR
    C->>C: 2. 解析 ClusterClass
    C->>P: 3. 调云 API 创建节点
    P->>K: 4. 新集群初始化
    K->>C: 5. 加入 CAPI 管理

```

### 3.4 CAPI 安装

```bash
# 1. 安装 clusterctl
curl -L https://github.com/kubernetes-sigs/cluster-api/releases/download/v1.7.0/clusterctl-linux-amd64 -o clusterctl
chmod +x clusterctl
mv clusterctl /usr/local/bin/

# 2. 初始化管理集群
clusterctl init --infrastructure aws

# 3. 创建集群
clusterctl generate cluster my-cluster \
  --kubernetes-version v1.30.0 \
  --control-plane-machine-count 3 \
  --worker-machine-count 3 > my-cluster.yaml
kubectl apply -f my-cluster.yaml
```

### 3.5 ClusterClass 模板

```yaml
apiVersion: cluster.x-k8s.io/v1beta1
kind: ClusterClass
metadata:
  name: aws-prod
spec:
  controlPlane:
    ref:
      apiVersion: controlplane.cluster.x-k8s.io/v1beta1
      kind: KubeadmControlPlaneTemplate
      name: aws-prod-control-plane
  infrastructure:
    ref:
      apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
      kind: AWSClusterTemplate
      name: aws-prod-template
  workers:
    machineDeployments:
    - class: aws-prod-worker
      name: md-0
```

**优势**：定义一次模板，重复用于多个集群——保证一致性。

## 四、生产实践

### 4.1 集群命名规范

```
prod-<region>-<az>
  - prod-us-east-1a
  - prod-us-east-1b
  - prod-cn-north-1a
```

### 4.2 集群分类

| 集群类型 | 用途 | 资源规模 |
|---|---|---|
| **prod** | 生产 | 大 |
| **staging** | 预生产 | 中 |
| **dev** | 开发 | 小 |
| **edge** | 边缘 | 小 |

### 4.3 多集群可观测

```mermaid
graph LR
    A["集群 1"] -->|"metrics"| P["Prometheus 联邦"]
    B["集群 2"] -->|"metrics"| P
    C["集群 3"] -->|"metrics"| P
    P --> G["Grafana"]
    style P fill:#a8e6a3
    style G fill:#a8e6a3

```

```yaml
# Prometheus 联邦配置
scrape_configs:
- job_name: 'federate'
  honor_labels: true
  metrics_path: '/federate'
  params:
    'match[]':
    - '{job="kube-state-metrics"}'
    - '{__name__="up"}'
  static_configs:
  - targets:
    - 'cluster-1.monitoring:9090'
    - 'cluster-2.monitoring:9090'
```

## 五、典型场景

### 5.1 多 Region 灾备

```mermaid
graph TB
    subgraph us-east
        P["生产集群"]
    end

    subgraph us-west
        D["灾备集群<br/>(跨 Region)"]
    end

    P -.数据同步.-> D
    style P fill:#a8e6a3
    style D fill:#ffaaa5

```

### 5.2 多云部署

```mermaid
graph LR
    A["AWS 集群"] --> C["跨云服务网格"]
    B["GCP 集群"] --> C
    C --> U["统一入口"]
    style C fill:#a8e6a3

```

### 5.3 云边协同

```mermaid
graph TB
    subgraph Cloud
        C["中心 K8s"]
    end

    subgraph Edge
        E1["边缘 K8s 1"]
        E2["边缘 K8s 2"]
    end

    C -.KubeEdge.-> E1
    C -.KubeEdge.-> E2

```

## 六、自测三问

1. **Hub-Spoke 和 Mesh 的核心区别？**
   - Hub-Spoke 有中心管理集群；Mesh 无中心对等互通。Hub-Spoke 管理简单但有单点故障；Mesh 灵活但管理复杂。

2. **Cluster API 的核心价值是什么？**
   - 用 K8s 风格的声明式 API 管理 K8s 集群——CRD + Controller 模式，与 HPA/Deployment 一致。

3. **多集群的最低要求是什么？**
   - ≥ 2 集群（多 AZ 灾备）；统一管理工具（CAPI 或 KubeFed）；统一可观测（Prometheus 联邦）。

## 📌 数据与事实声明

- 写于 2026-09-07，针对 K8s 1.30+
- CAPI 当前版本：v1.7+
- 行业认知：大厂普遍 10+ 集群（公开报道 2024）
- 单集群极限：5000 节点（公开讨论）
- 免责：多集群工具演进快

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 官方文档 | Cluster API | cluster-api.sigs.k8s.io |
| 官方文档 | Karmada | karmada.io |
| 实战 | Multi-cluster GitOps | argoproj.github.io/cd/ |
| 实战 | Cluster API Provider AWS | github.com/kubernetes-sigs/cluster-api-provider-aws |
