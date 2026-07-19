---
title: 云原生工程师学习路径
author: xiaobo
level: 进阶
tags: [云原生, K8s, 路线]
wordCount: 403
readMinutes: 1
---

# 云原生工程师学习路径

> 这条路径帮你从"会用 Docker"过渡到"能在生产环境用 K8s"。

## 阶段 1：容器基础（1-2 个月）

### 必备

- Docker 命令、Dockerfile 编写
- Docker Compose 多容器编排
- 镜像构建最佳实践（多阶段构建、镜像瘦身）
- 容器网络基础（bridge / host / overlay）

### 验收

- 能从零构建一个生产级镜像
- 能用 Compose 编排 3-5 个微服务

## 阶段 2：Kubernetes 入门（2-3 个月）

### 必备

- Pod / Service / Deployment
- ConfigMap / Secret / Volume
- Namespace / Label / Annotation
- kubectl 常用命令

### 资源

- 官方交互式教程：https://killercoda.com/kubernetes
- 《Kubernetes 权威指南》

## 阶段 3：Kubernetes 进阶（3-6 个月）

### 必备

- StatefulSet（数据库）
- Ingress（HTTP 路由）
- RBAC（权限管理）
- NetworkPolicy（网络隔离）
- CRD 与 Operator

### 实战

- 用 Helm 部署完整应用
- 用 Kustomize 管理多环境

## 阶段 4：可观测性（2-3 个月）

### 必备

- Prometheus + Grafana（Metrics）
- Loki / EFK（日志）
- Jaeger / SkyWalking（链路追踪）

### 目标

- 能在 Grafana 看 10 个核心指标的 Dashboard
- 能用 TraceID 定位跨服务慢调用

## 阶段 5：服务网格（3-4 个月）

### 必备

- Istio / Linkerd 概念
- Sidecar 注入原理
- 流量管理（金丝雀、熔断、限流）
- mTLS 与零信任

## 阶段 6：GitOps 与 CI/CD（2-3 个月）

### 必备

- ArgoCD / Flux
- Tekton / Jenkins X
- 配置漂移检测

## 推荐书目

- 《Kubernetes 权威指南》
- 《Cloud Native DevOps with Kubernetes》
- 《Production Kubernetes》

## 推荐社区

- K8s 官方 Slack
- CNCF 社区
- 阿里云云原生博客

## 总结

云原生是一个**生态**而不是单一技术。学完上面 6 个阶段，你在任何一家公司都能聊得开、做得动。