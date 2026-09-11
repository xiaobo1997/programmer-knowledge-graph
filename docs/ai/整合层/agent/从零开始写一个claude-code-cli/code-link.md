---
wordCount: 197
readMinutes: 1
---
# code-link（文档 → 代码）

> **本文档**：PKG wiki「从零开始写一个 claude-code-cli」→ 代码仓库的链接。

## 代码位置

**仓库**：program-code-example
**目录**：`agent/claude-code-cli-from-scratch/`
**远程**：https://github.com/xiaobo1997/program-code-example/tree/master/agent/claude-code-cli-from-scratch

## 简要说明

- **主语言**：Python 3.10+
- **依赖**：requests（唯一外部依赖；argparse / json / 标准库）
- **启动**：`git clone ... && cd agent/claude-code-cli-from-scratch/cli-agent && python main.py "任务"`

## 与 wiki 的对应关系

| wiki 章节 | 代码位置 |
|---|---|
| §3 系统架构与技术选型 | `cli-agent/main.py`（入口）+ `cli-agent/agent.py`（核心循环）|
| §5 实现方案与思考 | `cli-agent/tools/`（6 工具）+ `cli-agent/permissions.py`（5 层权限）|
| §7 项目架构和亮点 | `cli-agent/` 全部（模块划分见 README 目录结构）|

## 四件套

- 需求.md / specs.md / 实施计划.md / 交付报告.md —— 见代码目录 `docs/`

---

*状态：v1.0 已填充（2026-08-21，技术选型定 Python 3.10 + requests）*
