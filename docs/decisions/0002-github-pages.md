# ADR-0002: 用 GitHub Pages + GitHub Actions 部署

## 状态

已采用（2025-07-19）

## 背景

需要**自动部署**——push 代码后 1-2 分钟站点自动更新，**不要手动操作**。

## 决定

使用 GitHub Pages + GitHub Actions。

## 架构

```
开发者
  ↓ git push origin master
GitHub Repo
  ↓ 触发
GitHub Actions
  ↓
  1. checkout 代码
  2. setup node 20
  3. npm ci
  4. npm run docs:build
  5. upload artifact
  6. deploy to Pages
  ↓
GitHub Pages (https://xiaobo1997.github.io/programmer-knowledge-graph/)
```

## 工作流文件

`.github/workflows/docs.yml` 完整内容见 [docs.yml](../../../.github/workflows/docs.yml)。

## 关键点

1. **`on.push.branches: [master]`** — 只在 push 到 master 触发
2. **`permissions: contents/pages/id-token`** — 部署必须
3. **`actions/upload-pages-artifact` + `actions/deploy-pages`** — 官方三件套
4. **`fetch-depth: 0`** — `lastUpdated` 字段需要 git 历史

## 评估过的方案

### 方案 A：Cloudflare Pages

- 优点：免费、CDN 快
- 缺点：账号注册时被防火墙挡住；不在主流程上时容易忘
- 结论：作为备选，workflow `cloudflare-pages.yml` 已就位

### 方案 B：Vercel

- 优点：DX 好
- 缺点：国内访问不稳
- 结论：不选

### 方案 C：自建服务器

- 优点：完全可控
- 缺点：要付服务器钱、要维护
- 结论：不选（个人项目不值得）

## 关键问题：域名锁定

- 2025-07-19 第一次部署时遇到：xiaobo1997 全局 Pages 配置被锁到 hjh.world
- 原因：hjh.world 域名过期但 GitHub Pages 全局配置未清
- 2025-07-20 凌晨：GitHub 自动解除了锁定（疑似 hjh.world 过期清理）
- 现在可正常通过 https://xiaobo1997.github.io/programmer-knowledge-graph/ 访问

## 关联

- [docs/changes/2025-07-20-classification-restructuring.md](../changes/2025-07-20-classification-restructuring.md)
- [AGENTS.md](../about/AGENTS)
