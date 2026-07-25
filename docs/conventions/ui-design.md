---
title: UI 设计规范
wordCount: 537
readMinutes: 2
---

# UI 设计规范

> 仓库 UI 设计的一致性约定。当新设计有冲突时优先更新本文件。

## 设计参考

- **shields.io static badge** — 双段结构（小写英文 label + 彩色 value）
- **GitHub README** — 信息密度 + 视觉统一

## 核心原则

### 1. 高信息密度

每个 UI 元素承载 2 个信息（如 badge 左 label + 右 value），不浪费空间。

### 2. 视觉统一

- 同类元素形状尺寸完全一致
- 同类元素使用相同字体、圆角、内边距
- 不为单个元素特殊定制

### 3. 配色规范

9 大类分类颜色（保持稳定，不要轻易改）：

| Key | 颜色 | 用途 |
|------|------|------|
| backend | `#f97316` (orange-500) | Java/Server |
| frontend | `#06b6d4` (cyan-500) | Web |
| data | `#eab308` (yellow-500) | DB |
| devops | `#0ea5e9` (sky-500) | Docker |
| ai | `#a855f7` (purple-500) | LLM |
| architecture | `#14b8a6` (teal-500) | System |
| practice | `#64748b` (slate-500) | Tools |
| reading | `#f59e0b` (amber-500) | Books |
| career | `#ec4899` (pink-500) | Growth |
| home | `#4a5568` (slate-600) | Index |

## UI 组件规范

### Badge（shields 风格）

**结构：**
```html
<a class="rail-badge">
  <span class="rail-badge__left">[图标] [小写英文]</span>
  <span class="rail-badge__right">[中文 value]</span>
</a>
```

**尺寸：**
- 高度：22px
- 圆角：6px
- 字号：左 10px / 右 11px
- 字重：600（半粗体）
- 字间距：左 0.3px

**颜色：**
- 左半：`color-mix(in srgb, var(--badge-color) 80%, #000)`（基于分类色加暗 20%）
- 右半：`var(--badge-color)`（分类色本身）
- 文字：白色

**状态：**
- hover：`translateY(-1px)` + 阴影
- active：2px outline 强调

### 图标（CategoryIcon.vue）

- viewBox：`0 0 24 24`
- 笔画：白色 stroke
- 笔画宽度：2
- 圆角端点：round
- 默认尺寸：14px（badge 内）、18px（独立使用）

### 折叠/展开交互

- 状态用 `localStorage` 记住：`pkg-rail-expanded-sections`
- 默认折叠（节省空间）
- 切换有过渡动画（0.15s ease）

## 禁止

- ❌ 不要为单个分类使用特殊颜色
- ❌ 不要在不同位置用不同的 icon 尺寸
- ❌ 不要在 badge 内用大写英文（保持小写 shields 风格）
- ❌ 不要在 KnowledgeRail 里显示超过 9 个分类（除非新增第 10 类并加 convention 记录）

## 调整流程

1. 先看 shields.io / GitHub 主流设计，找参考
2. 改 ui-design.md 描述新规范
3. 实现 + 截图对比
4. 验证移动端响应式
5. commit + push
