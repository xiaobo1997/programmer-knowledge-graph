---
wordCount: 365
readMinutes: 1
---
# ADR-0001: 用 VitePress 做静态站点

## 状态

已采用（2025-07-19）

## 背景

需要一个**长期可维护**的技术博客 / 知识图谱平台。要求：

- 纯静态站点（便于部署到 GitHub Pages / Cloudflare Pages）
- Markdown 写文章，方便专注内容
- 支持全文搜索（中文友好）
- 主题可定制（不想被 SaaS 平台样式绑架）
- 加载快，SEO 友好

## 决定

使用 [VitePress](https://vitepress.dev) 作为静态站点生成器。

## 评估过的方案

### 方案 A：Hexo

- 优点：Node 生态，主题多
- 缺点：基于 EJS 模板，二次开发体验差；中文搜索插件维护一般
- 结论：不选

### 方案 B：Docusaurus

- 优点：Facebook 出品，文档站专业
- 缺点：基于 React，bundle 体积大；自定义主题比 VitePress 复杂
- 结论：不选

### 方案 C：Astro

- 优点：现代、岛屿架构快
- 缺点：生态比 VitePress 复杂；学习曲线更陡
- 结论：备选

### 方案 D：VitePress（采用）

- 优点：Vite 启动快；Vue 3 写自定义组件简单；本地搜索 + Pagefind 全文搜索开箱即用；主题系统清晰
- 缺点：纯静态站点，没有服务端能力（我们不需要）
- 结论：✅ 选用

## 后果

- ✅ 文章用 Markdown 写
- ✅ Vue 3 组件能深度定制 UI
- ✅ `npm run docs:build` 一键构建
- ✅ GitHub Pages 部署免费、稳定
- ⚠️ VitePress 版本升级偶尔有 breaking change（已知风险，固定 1.6.4）
- ⚠️ 自定义组件需要 Vite + Vue 3 知识（可接受）

## 关联

- [README.md](../about/README)
- [AGENTS.md](../about/AGENTS)
