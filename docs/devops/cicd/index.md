---
title: CICD
type: concept
tags: [DevOps, CICD]
wordCount: 402
readMinutes: 1
---

# CICD

> 持续集成 / 持续部署——GitHub Actions、Jenkins、GitLab CI、流水线编排、灰度发布、回滚机制。

## 子主题

- [CICD 进阶](./advanced/) — 复杂场景与优化（actions-matrix、reusable-workflows）
- [GitHub Actions](./github-actions/) — GitHub Actions 实战

## 生态定位

### 在哪里

- 工程交付链路的关键环节（DevOps 工具链核心）
- 衔接代码托管（Git）和部署平台（K8s/ECS/VM）
- 反馈环路的源头：CI 失败 → 快速修复；CD 失败 → 快速回滚

### 现在怎么样

- 主流平台：GitHub Actions（开源主流）/ GitLab CI（自建主流）/ Jenkins（传统企业）/ Argo CD（K8s GitOps）
- 演进方向：GitOps 模式（Git 作为唯一事实源）/ 渐进式交付（蓝绿/灰度/金丝雀）/ Pipeline as Code

### 能干什么

| 场景 | CICD 适合度 |
|---|---|
| 自动化测试 | ⭐⭐⭐⭐⭐ |
| 自动化部署 | ⭐⭐⭐⭐⭐ |
| 灰度发布 / 回滚 | ⭐⭐⭐⭐ |
| 多环境管理（dev/staging/prod） | ⭐⭐⭐⭐ |
| 合规审计 / 制品签名 | ⭐⭐⭐ |

### 怎么配合

- 代码托管：GitHub / GitLab / Bitbucket
- 制品仓库：Docker Hub / Harbor / Nexus
- 部署平台：Kubernetes / ECS / VM
- 监控：Prometheus / Grafana（部署后验证）

### 类似什么

| 方案 | 类型 | 优势 | 劣势 |
|---|---|---|---|
| GitHub Actions | SaaS CI/CD | 开箱即用 / 生态丰富 | 自定义受限 |
| GitLab CI | 自建 + SaaS | 一体化（Git + CI + CD） | 资源消耗大 |
| Jenkins | 自建 | 插件生态最丰富 | 维护成本高 |
| Argo CD | K8s GitOps | K8s 场景最佳 | 只管部署不管构建 |

## 一句话总结

> CICD 是把「代码变成线上服务」的自动化流水线——CI 保证「能跑」，CD 保证「能上」，灰度/回滚保证「能稳」。