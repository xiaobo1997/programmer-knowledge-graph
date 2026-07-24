---
title: GitHub Actions 入门：把仓库变成自动发布系统
author: xiaobo
level: 入门
tags: [CICD, GitHub Actions, DevOps]
test: true
---


# GitHub Actions 入门：把仓库变成自动发布系统

> 写给第一次想给仓库加自动化发布的工程师。一文搞清楚「push 后站点怎么自动更新」。

## 为什么需要 CICD

没有 CICD 的时候，每改一点东西你要：

1. 在本地 build
2. 检查 dist 文件夹有没有问题
3. 上传到服务器（ftp / scp / 控制台点上传）
4. 自己记「线上现在是什么版本」

CICD 让你**只需要 push 代码**，剩下的事情（构建、验证、上传、通知）机器自动做。

**对个人项目最直接的价值：**

- push 后 1-2 分钟站点自动更新，**不用手动操作**
- 每次构建都是「从同一个起点重新构建」，**不会漏步骤**
- 失败了有日志，**不用问自己「上次明明是好的」**

## 一个最简单的 GitHub Actions workflow

仓库根目录加 `.github/workflows/docs.yml`：

```yaml
name: Deploy VitePress site to GitHub Pages

on:
  push:
    branches: [master]      # 只在 push 到 master 时触发

permissions:
  contents: read            # 读取仓库
  pages: write              # 写入 Pages
  id-token: write           # 启用 OIDC 验证（Pages 部署需要）

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # 拉完整历史（lastUpdated 需要）

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - run: npm run docs:build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**这是 VitePress 官方推荐的 GitHub Pages 部署模板**，能直接用。

## 这个 workflow 的三个关键点

### 1. `on.push.branches`

```yaml
on:
  push:
    branches: [master]
```

只有 `git push origin master` 才会触发。其它分支（比如 `feature/*`）push 不会跑。

### 2. `permissions.pages: write` + `permissions.id-token: write`

这是 GitHub Pages 部署的两个权限开关。没有这两行，部署会失败。

### 3. `actions/upload-pages-artifact` + `actions/deploy-pages`

GitHub Pages 的「**官方三件套**」：

- `configure-pages` —— 准备 Pages 运行环境
- `upload-pages-artifact` —— 把 build 产物上传
- `deploy-pages` —— 真正发布

## 我们仓库里的实际 workflow

`programmer-knowledge-graph` 用的是上面这个官方模板，加了 Cloudflare Pages 的备选方案 `.github/workflows/cloudflare-pages.yml`。

主流程：
- push master → Actions 自动跑
- 跑完 1-2 分钟
- 站点在 https://xiaobo1997.github.io/programmer-knowledge-graph/ 更新

## 怎么验证它真的在工作

**看 Actions 日志：**

1. 打开 https://github.com/xiaobo1997/programmer-knowledge-graph/actions
2. 看到最新的 "Deploy VitePress site to GitHub Pages" workflow
3. 点进去看每个步骤是否绿勾

**看线上：**

直接访问 https://xiaobo1997.github.io/programmer-knowledge-graph/

每次 push 后页面内容应该 1-2 分钟内变化。

## 完整的「写文章到上线」流程

写给本站所有作者——你已经知道怎么做，这里把 5 个步骤固化下来：

### 步骤 1：本地起 dev server

```bash
cd ~/myworkspace/git/programmer-knowledge-graph
rm -rf docs/.vitepress/dist docs/.vitepress/cache
npm run docs:dev -- --host 127.0.0.1 --port 5175
```

浏览器打开 http://127.0.0.1:5175（或 5176，看哪个端口空）实时看效果。

### 步骤 2：写新文章

```bash
cat > docs/devops/istio-intro.md <<'EOF'
---
title: Istio 入门
author: xiaobo
level: 进阶
tags: [Service Mesh, Istio, K8s]
---

# Istio 入门

内容...
EOF
```

dev server 自动热更新，不需要重启。

### 步骤 3：本地构建 + 验证

```bash
rm -rf docs/.vitepress/dist docs/.vitepress/cache
npm run docs:build    # 自动跑 sync-toc + meta-inject
npm run docs:verify   # 检查 7 个关键产物
```

`docs:build` 在 build 之前会自动跑：

- `scripts/sync-toc.cjs` —— 扫描 docs/，把文章元数据注入 TocOverview.vue
- `scripts/inject-article-meta.cjs` —— 把字数、阅读时间写进 frontmatter

### 步骤 4：提交推送

```bash
git add -A
git commit -m "feat: 新增 Istio 入门"
git push origin master
```

### 步骤 5：等 1-2 分钟

- 看 https://github.com/xiaobo1997/programmer-knowledge-graph/actions 跑成绿色
- 浏览器访问 https://xiaobo1997.github.io/programmer-knowledge-graph/ 看新文章

**这就是全部。**

## 修改分类的流程

如果你想增加分类、改分类名、改图标，需要同步改 3 个文件：

| 文件 | 改什么 |
|---|---|
| `docs/.vitepress/theme/KnowledgeRail.vue` | 顶部胶囊菜单 |
| `docs/.vitepress/utils.ts` 的 `titleMap` | sidebar 显示名 |
| `scripts/sync-toc.cjs` 的 `iconMap` + `descMap` | 总目录卡片显示名 / 图标 / 描述 |

**必须 3 个文件同时改**，否则会出现「胶囊菜单是名字 A，sidebar 显示名字 B」的混乱。

## 改文章标签的流程

标签**不用改任何代码**，直接在文章 frontmatter 写：

```yaml
---
tags: [Java, JVM, 调优]
---
```

`ArticleMeta.vue` 会自动渲染成顶部胶囊。

## 常见坑

### 坑 1：dev 显示 OK，线上 404

dev server 用源文件直接 serve，**不验证 base 路径**。必须 `npm run docs:build` 看产物。

### 坑 2：改了分类但只改了 1-2 个文件

胶囊菜单 / sidebar / 总目录，三处必须同时改。

### 坑 3：新建分类但没建 index.md

每个分类必须有 `docs/<分类>/index.md`，否则访问 `/<分类>` 会 404。

### 坑 4：frontmatter 格式错

`---` 后面必须换行：

```yaml
---
title: 正确写法
---

内容...
```

```yaml
---title: 错误写法（少换行）
---
```

### 坑 5：Actions 跑了但没更新

去 Actions 页面看日志。90% 的失败是因为：

- 缺 `permissions.pages: write` 和 `id-token: write`
- build 报错（npm script 失败、依赖装不上）
- Pages Source 没设成「GitHub Actions」

## 总结

**CICD 的本质：把「我手动做的流程」变成「机器自动跑的步骤」。**

对个人项目，GitHub Actions + Pages 是最省事的组合——免费、稳定、不用管服务器。

本站的工作流：

```
写文章（任意编辑器）
  ↓
git push origin master
  ↓
GitHub Actions 自动 build + verify + deploy
  ↓
1-2 分钟后站点自动更新
  ↓
任何人访问 https://xiaobo1997.github.io/programmer-knowledge-graph/ 看到新内容
```

**push 是你唯一需要手动做的事。**

## 参考

- GitHub Actions 官方文档：https://docs.github.com/actions
- VitePress 部署指南：https://vitepress.dev/guide/deploy
- 本站的 workflow：https://github.com/xiaobo1997/programmer-knowledge-graph/blob/master/.github/workflows/docs.yml
- 本站的 sync-toc 脚本：https://github.com/xiaobo1997/programmer-knowledge-graph/blob/master/scripts/sync-toc.cjs