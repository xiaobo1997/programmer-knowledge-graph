---
title: 图片规范文档上线
date: 2025-07-25
status: shipped
---

# 图片规范文档上线

## 目标

之前文章里没引用过任何图片，但 `medium-zoom`（点击放大）已经集成。这次补齐图片相关的规范文档。

## 改动

### 1. 新增 `openspec/conventions/images.md`（124 行）

完整图片规范，包含：

- **存放位置**：`docs/public/images/{article|global}/`
- **引用语法**：本地 + 远程 + caption + dark/light 双版本
- **格式选择**：PNG/JPG/SVG/WebP/Mermaid 对照表
- **大小限制**：单张 ≤ 300KB，单篇文章 ≤ 1MB
- **命名规范**：`{category}-{slug}.{ext}`，小写连字符
- **暗色/浅色适配**：内容图 vs 主题相关图
- **Mermaid 优先**：架构/流程/时序图用 Mermaid（不用图片文件）
- **优化 checklist** + **禁止事项**

### 2. 更新 `openspec/conventions/README.md`

加「图片规范」链接到规范目录。

### 3. 更新 `openspec/AGENTS.md`

在「仓库边界」section 加一行：
> 文章配图：放 `docs/public/images/article/{分类}/`，命名 `{分类}-{slug}.{ext}`。架构图优先用 Mermaid。

## 不做的事

- ❌ **没有**实际加图片到文章（等具体文章需要时再加）
- ❌ **没有**集成 Mermaid plugin（VitePress 1.x 原生支持代码块语法 `mermaid`）
- ❌ **没有**改 medium-zoom 配置（已正确集成）

## 验证

- [x] `images.md` 在 VitePress build 中能正常渲染（标题 + 表格 + 列表）
- [x] 规范在 OpenSpec 目录树里正确导航

## 文件清单

```
openspec/
├── conventions/
│   ├── images.md                ← 新增
│   └── README.md                ← 加链接
└── AGENTS.md                    ← 加图片规则
```