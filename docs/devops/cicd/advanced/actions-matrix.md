---
title: GitHub Actions 矩阵构建：多环境并行跑
author: xiaobo
level: 进阶
tags: [CICD, GitHub Actions, 矩阵]
---

# GitHub Actions 矩阵构建：多环境并行跑

> 用 matrix 一次跑多个环境 / 多个版本 / 多个操作系统。

## 基本例子

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [16, 18, 20]
        os: [ubuntu-latest, macos-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

这个配置会跑 **3 × 2 = 6 个 job**：3 个 Node 版本 × 2 个操作系统。

## 常见场景

### 1. 多 Node 版本测试

```yaml
matrix:
  node: [16, 18, 20]
```

### 2. 多数据库测试

```yaml
matrix:
  db: [postgres, mysql, mariadb]
  port: [5432, 3306]
```

注意这种「笛卡尔积」会变很多 job，要设 `fail-fast: false` 不让一个失败导致其他全停。

### 3. include 定制某一项

```yaml
matrix:
  node: [18, 20]
  include:
    - node: 18
      coverage: true
```

只有 node=18 的 job 会拿到 `coverage: true`，可以用来单跑覆盖率。

## 进阶：取消冗余构建

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

同一个分支再次 push 时，自动取消前一次正在跑的 build，节省资源。

## 参考

- [GitHub Actions 入门](../../github-actions-cicd)
- [可复用 workflow](./reusable-workflows)