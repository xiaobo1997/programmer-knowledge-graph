---
title: K8s GitOps 实践：Argo CD / Flux 深度
type: deep-dive
tags: [DevOps & 云原生, Kubernetes, GitOps, Argo CD, Flux, 专题层]
date: 2026-09-07
wordCount: 1376
readMinutes: 4
---

# K8s GitOps 实践：Argo CD / Flux 深度

> GitOps = Git 作为唯一真相源（Single Source of Truth）——集群状态由 Git 定义，控制器持续调和。本篇讲清 GitOps 原则、Argo CD vs Flux 对比、典型架构、生产实践。

## 一句话摘要

GitOps 三原则：声明式（Git 定义状态）+ 版本化（Git 提交历史）+ 自动调和（控制器持续应用）；Argo CD（UI 强 + 多租户）是主流；Flux（轻量 + GitOps Toolkit）是 CNCF 毕业项目；生产推荐「Argo CD + Image Updater + 镜像签名验证」组合。

## 一、GitOps 原则

### 1.1 三原则

```mermaid
graph TD
    A["GitOps 3 原则"] --> B["1. 声明式<br/>(整个系统用 yaml 描述)"]
    A --> C["2. 版本化<br/>(Git 提交历史即审计日志)"]
    A --> D["3. 自动调和<br/>(持续把状态推向期望)"]
    style A fill:#a8e6a3

```

### 1.2 传统部署 vs GitOps

```mermaid
graph LR
    subgraph 传统["传统部署"]
        T1["开发 push 代码"] --> T2["CI 构建"]
        T2 --> T3["CD 调 kubectl apply"]
        T3 --> T4["集群状态"]
    end

    subgraph GitOps["GitOps"]
        G1["开发 push 代码"] --> G2["CI 构建镜像"]
        G2 --> G3["更新 Git yaml"]
        G3 --> G4["GitOps Controller 检测"]
        G4 --> G5["自动调集群"]
        G5 --> G6["集群状态"]
    end

    style T4 fill:#ffaaa5
    style G6 fill:#a8e6a3

```

**关键认知**：GitOps 把「部署」从「CI/CD」解耦到「Git + Controller」——kubectl 不直接调集群。

## 二、Argo CD

### 2.1 架构

```mermaid
graph TB
    subgraph 控制平面
        API["API Server"]
        RC["Repo Server<br/>(Git 拉取)"]
        CS["Application Controller<br/>(调和)"]
        DB[("Redis")]
    end

    subgraph 应用
        A1["Application 1"]
        A2["Application 2"]
    end

    G["Git Repo"] --> RC
    RC --> CS
    CS -->|apply| A1
    CS -->|apply| A2
    style CS fill:#a8e6a3

```

### 2.2 三状态对比

```mermaid
stateDiagram-v2
    [*] --> Synced: 集群与 Git 一致
    [*] --> OutOfSync: 集群与 Git 不一致
    OutOfSync --> Synced: Argo CD 自动同步
    Synced --> OutOfSync: Git 更新
    OutOfSync --> Unknown: 同步失败

```

| 状态 | 含义 | 行动 |
|---|---|---|
| **Healthy** + **Synced** | 健康 + 一致 | 无需操作 |
| **Healthy** + **OutOfSync** | 健康 + 不一致 | Argo CD 会自动同步 |
| **Degraded** | 不健康 | 需人工介入 |
| **Unknown** | 状态未知 | 检查 Argo CD 连接 |

### 2.3 Application 资源

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: web
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myrepo
    targetRevision: HEAD
    path: manifests/web
  destination:
    server: https://kubernetes.default.svc
    namespace: prod
  syncPolicy:
    automated:
      prune: true             # 自动删除 Git 中移除的资源
      selfHeal: true          # 偏离自动恢复
    syncOptions:
    - CreateNamespace=true
```

### 2.4 Argo CD 优势 / 劣势

| 优势 | 劣势 |
|---|---|
| ✅ Web UI 强大 | ❌ 单租户架构（多租户复杂） |
| ✅ 多 Git 源支持 | ❌ 资源占用较高 |
| ✅ Helm/Kustomize 原生 | ❌ 集群内安装（需先有集群） |
| ✅ ApplicationSet 多集群 | |

## 三、Flux

### 3.1 GitOps Toolkit

```mermaid
graph LR
    A["Source Controller<br/>(Git/Helm 拉取)"] --> B["Kustomize Controller"]
    A --> C["Helm Controller"]
    A --> D["Notification Controller"]
    style A fill:#a8e6a3

```

### 3.2 GitRepository + Kustomization

```yaml
# 1. 监听 Git
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: web
  namespace: flux-system
spec:
  interval: 1m0s
  ref:
    branch: main
  url: https://github.com/myorg/myrepo
---
# 2. 应用 Kustomize
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: web
  namespace: flux-system
spec:
  interval: 10m0s
  path: ./manifests/web
  prune: true
  sourceRef:
    kind: GitRepository
    name: web
```

### 3.3 Flux 优势 / 劣势

| 优势 | 劣势 |
|---|---|
| ✅ CNCF 毕业项目 | ❌ UI 较弱（需依赖 Weave GitOps） |
| ✅ GitOps Toolkit 工具化 | ❌ 学习曲线较陡 |
| ✅ 多租户友好 | |
| ✅ 轻量 | |

## 四、Argo CD vs Flux

### 4.1 对比

| 维度 | Argo CD | Flux |
|---|---|---|
| **CNCF 状态** | 毕业 | 毕业 |
| **架构** | 单体 + UI | Toolkit（多个 Controller） |
| **UI** | 强 | 弱（需第三方） |
| **多租户** | 复杂 | 原生支持 |
| **性能** | 中 | 较轻 |
| **生态** | 丰富（Image Updater/Notifications） | 标准 |
| **学习曲线** | 平缓 | 较陡 |
| **社区** | 大 | 中 |

### 4.2 选型决策

```mermaid
graph TD
    A["GitOps 选型"] --> Q{"需要强 UI?"}
    Q -->|"是"| B["Argo CD"]
    Q -->|"否 + 多租户"| C["Flux"]
    Q -->|"否 + 简单场景"| D["Argo CD / Flux 均可"]
    style B fill:#a8e6a3
    style C fill:#a8e6a3

```

## 五、典型架构

### 5.1 Argo CD + Image Updater

```mermaid
graph TB
    G["Git Repo<br/>(yaml)"] --> AR["Argo CD"]
    IR["Image Registry<br/>(web:v1.0)"] --> IU["Image Updater"]
    IU -->|"更新 yaml tag"| G
    G --> AR
    AR -->|apply| K["K8s 集群"]
    style IU fill:#a8e6a3

```

### 5.2 多集群 GitOps

```mermaid
graph TB
    subgraph Hub["Hub 集群"]
        AR["Argo CD"]
    end

    subgraph Spoke1["Spoke 1"]
        K1["业务"]
    end

    subgraph Spoke2["Spoke 2"]
        K2["业务"]
    end

    AR -->|"ApplicationSet"| K1
    AR -->|"ApplicationSet"| K2
    style AR fill:#a8e6a3

```

```yaml
# ApplicationSet 多集群部署
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: web-multicluster
spec:
  generators:
  - list:
      elements:
      - cluster: spoke-1
        url: https://spoke-1.example.com
      - cluster: spoke-2
        url: https://spoke-2.example.com
  template:
    metadata:
      name: 'web-{cluster}'
    spec:
      project: default
      source:
        repoURL: https://github.com/myorg/myrepo
        path: manifests/web
      destination:
        server: '{url}'
        namespace: prod
```

## 六、生产实践

### 6.1 Argo CD 高可用

```mermaid
graph LR
    A["Argo CD HA"] --> B["3 API Server 副本"]
    A --> C["3 Repo Server 副本"]
    A --> D["3 Controller 副本"]
    A --> E["Redis Sentinel<br/>(HA 存储)"]
    style A fill:#a8e6a3

```

### 6.2 GitOps + 镜像签名验证

```mermaid
graph TB
    A["镜像构建"] --> B["Cosign 签名"]
    B --> C["Registry"]
    C --> D["Argo CD 部署"]
    D -->|"Kyverno 验证签名"| E["K8s 集群"]
    style D fill:#a8e6a3

```

### 6.3 Progressive Delivery（渐进式发布）

```mermaid
graph LR
    A["新版本"] --> B["5% 流量"]
    B --> C{"指标 OK?"}
    C -->|"是"| D["25% 流量"]
    C -->|"否"| E["回滚"]
    D --> F{"指标 OK?"}
    F -->|"是"| G["100% 流量"]
    F -->|"否"| E
    style G fill:#a8e6a3
    style E fill:#ffaaa5

```

工具：Argo Rollouts / Flagger。

## 七、自测三问

1. **GitOps 和 CI/CD 的本质区别？**
   - CI/CD 把「部署」放在 CI 流水线（CI push 调集群）；GitOps 把「部署」放在 GitOps Controller（Git 是唯一真相源，Controller 持续调和）。

2. **Argo CD 的 selfHeal 和 prune 是什么？**
   - selfHeal：集群状态偏离 Git 时自动恢复；prune：Git 中移除的资源自动从集群删除。

3. **为什么生产需要 GitOps + 镜像签名？**
   - GitOps 保证「期望状态可追溯」；镜像签名保证「实际拉取的镜像是可信的」。两者结合实现「可追溯 + 可验证」。

## 📌 数据与事实声明

- 写于 2026-09-07，针对 K8s 1.30+
- Argo CD 当前版本：v2.10+
- Flux 当前版本：v2.x
- 行业认知：Argo CD 是 GitOps 事实标准（公开讨论）
- 免责：GitOps 工具演进快

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 官方文档 | Argo CD | argoproj.github.io/cd/ |
| 官方文档 | Flux | fluxcd.io |
| 实战 | OpenGitOps | opengitops.dev |
| 实战 | Argo Rollouts | argoproj.github.io/rollouts/ |
