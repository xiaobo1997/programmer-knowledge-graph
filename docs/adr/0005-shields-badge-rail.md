---
title: 'ADR-0005: KnowledgeRail 改用 shields.io badge 风格'
date: 2025-07-25
status: accepted
wordCount: 504
readMinutes: 2
---

# ADR-0005: KnowledgeRail 改用 shields.io badge 风格

## 背景

左侧栏 KnowledgeRail 原本用「彩色方框 + 文字标签」的风格，每个分类占一个完整高度的方块（32px+）。展开 9 个分类会占满整个侧栏，不够紧凑。

## 决策

KnowledgeRail 改用 [shields.io static badge](https://shields.io/badges/static-badge) 的设计风格：
- 双段结构：左半深色 label（小写英文）+ 右半彩色 value（中文名）
- 小尺寸（22px 高）
- 圆角矩形、扁平设计

## 备选方案

### 方案 A：保持原彩色方块（已实施）

- 优点：图标大、视觉识别强
- 缺点：占空间大，9 个全展开时侧栏拥挤

### 方案 B：shields badge 风格（最终采用）

- 优点：高信息密度、统一专业、视觉简洁
- 缺点：图标变小（14px），识别度略降

### 方案 C：纯文字 link（最简）

- 优点：最省空间
- 缺点：缺少视觉层次，9 个分类难以快速扫视

## 实施细节

### CategoryIcon.vue

新增 SVG 图标组件，9 大类各一个独特图标：

| Key | 图标含义 |
|------|------|
| backend | 咖啡杯（Java） |
| frontend | 浏览器 + `</>` |
| data | 圆柱 + 立方体（DB + Redis） |
| devops | 鲸鱼（Docker） |
| ai | 神经网络节点 |
| architecture | 六边形蜂巢 |
| practice | 工具箱 |
| reading | 翻开的书 |
| career | 阶梯 + 树 |

### KnowledgeRail 布局

- **默认折叠**：HOME badge + CATEGORIES 合并按钮（1 个 badge 高度）
- **展开**：HOME + COLLAPSE + 9 个分类 badge
- 状态记忆：`localStorage.pkg-rail-expanded-sections`

### 配色

每个分类的 badge 颜色：
- 左半：`color-mix(in srgb, var(--color) 80%, #000)`（基于分类色加暗）
- 右半：分类色本身

## 后果

### 正面
- ✅ 侧栏空间节省 50%（22px vs 32px+）
- ✅ 9 个分类全展开时仍易读
- ✅ shields 风格专业统一，被开源社区广泛认可
- ✅ 与 GitHub README 生态一致

### 负面
- ❌ 图标尺寸变小，识别度略降
- ❌ 中文名 + 英文 label 双语显示可能冗余

### 风险
- 移动端 badge 太窄可能截断文字 → 用 flex: 1 + text-overflow: ellipsis 兜底

## 关联

- 实现：`docs/.vitepress/theme/CategoryIcon.vue`
- 实现：`docs/.vitepress/theme/KnowledgeRail.vue`
- 规范：`docs/conventions/ui-design.md`
- 改动记录：`docs/changes/2025-07-25-knowledge-rail-shields-style.md`
