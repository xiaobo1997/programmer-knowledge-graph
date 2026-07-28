---
title: 总目录
aside: false
---

<script setup lang="ts">
import TocOverview from './.vitepress/theme/TocOverview.vue'
</script>

# 总目录

> 点击分类胶囊筛选该分类内容。点击文章直接阅读。

<TocOverview />

## 使用方式

- 顶部胶囊筛选：点「全部」或任意分类名 → 只显示该分类的文章
- 点分类标题 → 进入该分类目录页（左侧栏自动展开）
- 点文章标题 → 直接阅读
- 顶部 `⌘ K` → 全站全文搜索
- 左侧「知识分类」→ 按分类快速切换

## 沉淀原则

- 一篇文章对应一个具体知识点
- 不抄原文，写自己的思考
- 测试占位文章加 `test: true` frontmatter 标记，正式内容不加
- 链接到示例代码仓库，不在文档里贴大段代码

## 仓库治理

- [AGENTS.md](../../AGENTS.md) — AI 入口（必读）
- [docs/conventions/](./conventions/) — 写作规范（文章格式 / 图片 / 验证流程）
- [docs/adr/](./adr/) — 架构决策记录（VitePress 选型 / GitHub Pages / 9 大类 / shields badge 等）