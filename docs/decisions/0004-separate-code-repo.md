---
wordCount: 380
readMinutes: 1
---
# ADR-0004: 示例代码独立仓库

## 状态

待实施（决策已定，仓库未建）

## 背景

现在文章里贴大段代码块（spring boot YAML、docker 命令等）。问题：

- 文档**不是**完整可运行的项目，读者复制粘贴后还要自己补依赖
- 完整代码应该有自己的 git history（看到「为什么这么写」的演化）
- 测试代码、构建配置不应该污染文档
- 文档应该聚焦「认知」，代码应该聚焦「实现」

## 决定

**示例代码放到独立仓库 `xiaobo1997/programmer-code-examples`。**

文档里需要演示代码时，**贴链接**，**不贴大段代码**。

## 仓库分工

| 仓库 | 放什么 | 不放什么 |
|---|---|---|
| `programmer-knowledge-graph` | 「为什么、怎么做、踩过什么坑」 | 完整可运行项目 |
| `programmer-code-examples` | 完整可运行项目、测试、依赖、git history | 零散代码片段、认知性内容 |

## 链接格式

```
仓库根：https://github.com/xiaobo1997/programmer-code-examples

某目录：.../tree/main/<path>
某文件：.../blob/main/<path>/<file>
某 commit：.../blob/<sha>/<path>
```

## 何时贴代码到文档

| 场景 | 贴代码？ |
|---|---|
| 关键片段 < 20 行 | ✅ 贴 |
| 配置文件示例（yaml / json） | ✅ 贴 |
| 命令片段 | ✅ 贴 |
| 完整方法实现 | ❌ 链到代码仓库 |
| 完整类文件 | ❌ 链到代码仓库 |
| 完整项目结构 | ❌ 链到代码仓库 |

## 实施步骤（待做）

1. 建 `xiaobo1997/programmer-code-examples` 仓库
2. 加 AGENTS.md 写仓库目标
3. 加 README.md 说明结构
4. 把现有测试文章里的代码示例迁过去
5. 改文档里的链接指向新仓库

## 关联

- [docs/conventions/code-example-link.md](../conventions/code-example-link.md)
- [AGENTS.md 仓库边界](../about/AGENTS)
