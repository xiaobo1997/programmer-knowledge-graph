# 程序员的长期知识图谱

这里沉淀：

- **读书笔记**：每一本书的核心观点、个人思考、行动清单
- **全栈学习**：跨端到端的技术能力地图
- **DevOps**：Linux、Docker、K8s、CICD、监控、应急响应
- **Agent 开发**：LLM Agent、Tool Use、RAG、Memory
- **技术地图**：各领域学习路径与里程碑



## 站点

使用 VitePress 1.6 构建，技术书房浅色主题：

- 顶部导航：首页 / 总目录
- 左侧：5 个分类（读书笔记 / 全栈 / DevOps / Agent / 技术地图）
- 文章页：阅读时间、字数、更新时间
- 全局搜索：`⌘ K`
- 图片：点击放大

本地开发：

```bash
npm install
npm run docs:dev
```

构建并验证：

```bash
npm run docs:build
npm run docs:verify
```

新增文章时先 `node scripts/inject-article-meta.cjs` 自动注入字数与阅读时间，再提交。

## 写作规范

每篇文章至少包含：

- 核心观点：作者主张什么
- 个人思考：我认同/怀疑的部分
- 行动清单：接下来 30 天要做的 1-3 件事
- 工程实践连接：与日常工作/项目怎么打通

## 许可

仓库使用 MIT 协议公开。引用或 fork 欢迎，但请保留原始来源标注。
