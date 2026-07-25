---
title: KnowledgeRail shields.io badge 风格改造
date: 2025-07-25
status: shipped
wordCount: 536
readMinutes: 2
---

# KnowledgeRail shields.io badge 风格改造

## 目标

让左侧栏 KnowledgeRail 更紧凑、更专业，参考 [shields.io static badge](https://shields.io/badges/static-badge) 的设计风格。

## 改动

### 1. 新组件：CategoryIcon.vue（SVG 图标库）

9 大类各一个独特 SVG 图标（统一 24x24 viewBox）：

| 分类 | 图标 | 视觉化含义 |
|------|------|------|
| 后端 | 咖啡杯 + 蒸汽 | Java |
| 前端 | 浏览器 + `</>` | Web |
| 数据 | 圆柱 + 立方体 | DB + Redis |
| DevOps | 鲸鱼 | Docker |
| AI | 神经网络节点 | LLM |
| 架构 | 六边形蜂巢 | 分布式 |
| 工程实践 | 工具箱 | tools |
| 读书 | 翻开的书 | book |
| 成长 | 阶梯 + 树 | growth |

### 2. KnowledgeRail 改用 shields badge 风格

**shields.io badge 风格：**
- 双段结构：左半深色 label + 右半彩色 value
- 小尺寸（22px 高）、紧凑排列
- 圆角矩形、扁平设计

**新布局：**
- 默认状态：1 个 HOME badge + 1 个 CATEGORIES 合并按钮
- 展开状态：HOME + COLLAPSE + 9 个分类 badge
- 全部为 shields 风格的彩色 badge

每个分类 badge 形如：`[☕ backend] | 后端开发`（左半深色含图标+小写英文，右半彩色含中文名）

### 3. 折叠/展开状态记忆

- `localStorage.pkg-rail-expanded-sections` 记住用户选择
- 默认折叠（节省侧栏空间）
- 点击「CATEGORIES」展开 9 个分类
- 点击「COLLAPSE」折回单按钮

## 设计取舍

### 为什么用 shields 风格？

- ✅ **高信息密度**：左 label + 右 value 一行展示关键信息
- ✅ **视觉统一**：所有分类形状尺寸完全一致
- ✅ **专业感**：参考开源生态通用 UI（GitHub README 大量使用）
- ✅ **品牌识别强**：彩色右半一眼分辨分类

### 为什么默认折叠？

- 节省侧栏空间（默认 2 个 badge ≈ 1 个完整分类）
- 用户主动选择展开，比默认全展开更省心
- 9 个分类如果全展开会占满整个侧栏

## 验证

- 6 分类 / 19 篇文章无变化
- 9 大类 shields badge 全部正常显示
- 折叠/展开交互流畅
- localStorage 记忆有效
- GitHub Pages 部署通过
- 视觉一致性：所有 badge 同高（22px）、同字体、同圆角

## 文件清单

- 新增：`docs/.vitepress/theme/CategoryIcon.vue`
- 修改：`docs/.vitepress/theme/KnowledgeRail.vue`
- 文档：本文 + `docs/conventions/ui-design.md` + `docs/decisions/0005-shields-badge-rail.md`
