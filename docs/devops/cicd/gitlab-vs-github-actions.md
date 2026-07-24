---
title: GitLab CI vs GitHub Actions：怎么选
author: xiaobo
level: 进阶
tags: [CICD, GitLab, GitHub Actions, 对比]
test: true
wordCount: 249
readMinutes: 1
---


# GitLab CI vs GitHub Actions：怎么选

> 两个主流 CICD 工具的对比，帮你做技术选型。

## 核心差异

| 维度 | GitHub Actions | GitLab CI |
|---|---|---|
| 与代码托管集成 | GitHub | GitLab |
| 配置文件 | `.github/workflows/*.yml` | `.gitlab-ci.yml` |
| Runner | GitHub 托管 + 自托管 | GitLab 托管 + 自托管 |
| 价格 | 公开仓库免费、私有仓库 2000 分钟/月 | 自托管免费 |
| 矩阵构建 | 原生支持 | 通过 `parallel: matrix` |
| 缓存 | `actions/cache` | `cache:` 关键字 |

## 选 GitHub Actions 的场景

- 仓库本身在 GitHub
- 想要与 PR、Issue 深度集成
- 使用 Actions Marketplace（社区生态丰富）

## 选 GitLab CI 的场景

- 仓库本身在 GitLab
- 需要**自托管**（出于安全或合规要求）
- 想要把代码托管和 CI 统一在一个平台

## 我仓库用的方案

本仓库用的是 **GitHub Actions**（因为仓库在 GitHub）。workflow 文件在 `.github/workflows/docs.yml`。

如果以后想换 GitLab，配置类似，迁移成本不高。

## 参考

- [GitHub Actions 入门](../github-actions-cicd)
- [5 个核心概念](./github-actions-basics)