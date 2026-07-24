---
title: Kubernetes 核心概念：一文读懂 Pod / Service / Deployment
author: xiaobo
level: 进阶
tags: [Kubernetes, 云原生]
wordCount: 322
readMinutes: 1
---

# Kubernetes 核心概念：一文读懂 Pod / Service / Deployment

> K8s 不只是容器调度器，是一整套声明式运维系统。

## 三个核心对象

### Pod

K8s 调度的最小单位，可以包含 1 个或多个容器：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello
spec:
  containers:
    - name: app
      image: myapp:1.0
      ports:
        - containerPort: 8080
```

### Deployment

声明期望状态，K8s 自动维护：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello
  template:
    metadata:
      labels:
        app: hello
    spec:
      containers:
        - name: app
          image: myapp:1.0
```

### Service

把一组 Pod 暴露成一个稳定的访问入口：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello
spec:
  selector:
    app: hello
  ports:
    - port: 80
      targetPort: 8080
```

## 三者的关系

```
Deployment ──创建──▶ 多个 Pod
                       │
                       └─▶ Service ──▶ 负载均衡 ──▶ 外部流量
```

## 常用命令

```bash
kubectl get pods
kubectl describe pod <name>
kubectl logs <pod>
kubectl apply -f deployment.yaml
kubectl scale deployment hello --replicas=5
kubectl rollout undo deployment hello
```

## 排错路径

1. `kubectl get pods` 看 Pod 状态
2. `kubectl describe pod <name>` 看事件
3. `kubectl logs <pod>` 看应用日志
4. `kubectl exec -it <pod> sh` 进容器

## 总结

K8s 的设计哲学是**声明式 + 期望状态**。你只描述"想要什么"，K8s 负责"让它成立"。理解了 Pod/Service/Deployment 三件套，就理解了 80% 的日常运维场景。

## 参考

- 官方文档：https://kubernetes.io/docs/home/
- 《Kubernetes 权威指南》第 5 版