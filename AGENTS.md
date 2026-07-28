# AGENTS.md

> 任何 AI（Cursor / Claude Code / Codex / Qoder / Hermes）第一次进入这个仓库，**必须先读这个文件**。

## 这是什么

**程序员的长期知识图谱**——按工程师工作场景分 9 大类，长期沉淀「值得保留的认知」。

## 仓库结构

- **`docs/`** — VitePress 站点源文件（首页 / 9 大类文章 / 知识地图）
- **`docs/conventions/`** — 写作规范（文章格式、图片规范、分类规范、UI 规范）
- **`docs/adr/`** — 架构决策记录（历史重大决策）
- **`scripts/`** — 构建脚本（sync-toc / inject-article-meta / x.mjs 统一入口）
- **`CHANGELOG.md`** — 所有变更记录
- **`AGENTS.md`** — 本文件

## AI 进入后必读

1. **本文件** — 总览
2. **`docs/conventions/article-format.md`** — 文章格式规范
3. **`docs/conventions/images.md`** — 图片规范
4. **`docs/conventions/classification.md`** — 分类规范
5. **`CHANGELOG.md`** — 最近改了什么

## Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat: 新增 xxx 文章
fix: 修复 xxx 问题
docs: 补充 xxx 文档
refactor: 重构 xxx
chore: 构建/工具链
```

## 不允许的事情

- ❌ 在文档里贴大段代码（> 20 行）— 链接到示例代码仓库
- ❌ 改已有正式文章的 frontmatter / 内容（除非用户明确允许）
- ❌ 不写 commit message 就 push
- ❌ 跳过 build 验证就推送（必须 `npm run docs:build` 跑通）

## 必跑命令

```bash
# 写完文章
cd ~/myworkspace/git/programmer-knowledge-graph
npm run x -- deploy "feat: 新增 XXX 文章"  # 自动 build + commit + push
```

## 提问的艺术

- 不确定用户意图 → 问，不要猜
- 多种方案 → 列出来让用户选
- 改动前先讲思路 → 等用户确认 → 再写代码
- 完成后跑验证 → 报告实际结果，不说"应该对了"
