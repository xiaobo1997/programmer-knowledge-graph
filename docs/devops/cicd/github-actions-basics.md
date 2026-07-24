---
title: GitHub Actions 基础：5 个核心概念
author: xiaobo
level: 入门
tags: [CICD, GitHub Actions]
test: true
---


# GitHub Actions 基础：5 个核心概念

> 给第一次写 workflow 的人的速通教程。

## 5 个核心概念

### 1. Workflow

定义在 `.github/workflows/*.yml`，每个文件是一个 workflow。

### 2. Event

触发 workflow 的事件：push / pull_request / schedule / workflow_dispatch。

### 3. Job

一个或多个步骤的集合，可以并行或串行。

### 4. Step

job 内的单个任务，可以是 `run` 或 `uses`。

### 5. Action

可复用的 step。在 https://github.com/marketplace 搜索。

## 最小例子

```yaml
name: hello
on: [push]
jobs:
  say-hello:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello World"
```

保存到 `.github/workflows/hello.yml`，push 后在 Actions 页面就能看到运行。

## 进一步

- 复杂工作流用矩阵构建：[参见 GitHub Actions 入门](../github-actions-cicd)
- 别的工具：[GitLab CI vs GitHub Actions](./gitlab-vs-github-actions)