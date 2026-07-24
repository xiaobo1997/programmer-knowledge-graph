---
wordCount: 374
readMinutes: 1
---
# Git Commit 规范

## 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Type

| type | 含义 | 示例 |
|---|---|---|
| `feat` | 新增功能 | `feat: 新增 GitHub Actions 入门文章` |
| `fix` | 修复 bug | `fix: 自定义组件链接加 base 前缀` |
| `refactor` | 重构（不改功能） | `refactor: 提取 joinPath 工具函数` |
| `docs` | 仅文档 | `docs: 补充 AGENTS.md 仓库边界说明` |
| `style` | 格式（不影响代码） | `style: 统一缩进 2 空格` |
| `chore` | 构建/工具/杂项 | `chore: 升级 vitepress 到 1.6.4` |
| `test` | 仅测试 | `test: 补 sync-toc 边界测试` |
| `revert` | 回滚 | `revert: feat: 之前的改动` |

## Scope（可选）

标改动范围：`config` / `theme` / `script` / `docs` / `sidebar` / `cname` / `article` / `home` / `devops` / ...

## Subject 规则

- 中文 / 英文都行
- **不加句号**
- ≤ 50 字
- 用动词开头：「新增」「修复」「调整」「提取」「升级」

## Body

- 可选
- 写「为什么改」「改了什么」「影响什么」
- 多行时用 `-` 列表

## Footer

- 引用 issue / PR：`#123` `(#456)`
- BREAKING CHANGE：用 `BREAKING CHANGE: <description>`
- Co-authored-by：协作作者

## 完整示例

```
feat(devops): 新增 Istio 入门文章

- 包含 Service Mesh 基本概念
- 包含 Istio 部署示例
- 引用示例代码仓库 programmer-code-examples

Refs #42
```

## 一次性提交 vs 拆分

- ✅ **拆**：重构 + 新功能 + 修 bug = 3 个 commit
- ✅ **合**：单纯改一个文章 = 1 个 commit
- ❌ **不要**：把不相关的改动混在一个 commit

## 禁止的 commit

- ❌ `update` / `fix bug` / `wip` / `tmp`（太模糊）
- ❌ 整段 emoji 无文字
- ❌ 一行 git pull / merge 的默认信息
