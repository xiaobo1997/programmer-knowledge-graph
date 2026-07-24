---
title: GitHub Actions 可复用 workflow
author: xiaobo
level: 进阶
tags: [CICD, GitHub Actions, DRY]
test: true
---


# GitHub Actions 可复用 workflow

> 用 `workflow_call` 把通用流水线抽出来，多仓库共享。

## 场景

你有 5 个仓库都用同一种「install → test → build → deploy」流程。每次复制粘贴 workflow 改一点点，维护起来很痛苦。

可复用 workflow 让你：

- 主流程写在一个仓库的 `.github/workflows/reusable.yml`
- 其它仓库的 workflow 用 `uses: org/repo/.github/workflows/reusable.yml@v1` 调用
- 改一处主流程，所有下游自动更新

## 例子：可复用的 deploy workflow

**主仓库 `.github/workflows/deploy.yml`：**

```yaml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      DEPLOY_KEY:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

**调用方 `.github/workflows/ci.yml`：**

```yaml
on: [push]

jobs:
  test:
    uses: myorg/build-pipeline/.github/workflows/reusable.yml@v1
    with:
      environment: production
    secrets:
      DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

## 关键点

1. **`on.workflow_call`**：声明这个 workflow 可以被其它 workflow 调用
2. **`inputs` / `secrets`**：声明可复用 workflow 接收的参数
3. **版本标签**：`@v1` 锁定主仓库的 tag

## 什么时候用

✅ **用**：5+ 仓库用同样流程、需要统一改一处

❌ **不用**：单个仓库、流程不通用、调试复杂

## 参考

- [GitHub Actions 入门](../../github-actions-cicd)
- [矩阵构建](./actions-matrix)