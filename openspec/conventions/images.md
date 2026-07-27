---
title: 图片规范
---

# 图片规范

> 文章里的图片怎么放、怎么处理、怎么引用。

## 存放位置

### 仓库内（默认推荐）

```
docs/
└── public/
    └── images/
        ├── article/         ← 文章配图（按分类分子目录）
        │   ├── backend/
        │   ├── devops/
        │   ├── ai/
        │   ├── architecture/
        │   └── ...
        └── global/          ← 跨文章复用的图（Logo、占位图）
```

**特点：** 跟随仓库版本控制 + 不依赖外部服务 + 永久有效

### 远程 URL（仅特殊场景）

- 引用官方文档原图
- 引用不会变的外部图床
- 必须配上 `alt` 描述 + 标明来源

## 引用语法

### 仓库内图片

```markdown
![RESTful 状态码总览](/images/article/backend/restful-status-codes.png)
```

注意路径前缀 `/images/...`（不带 `docs/public/`，VitePress 自动展开）。

### 远程图片

```markdown
![架构图](https://example.com/diagram.png)
```

### 带标题的图片

```markdown
![RESTful 状态码总览](/images/article/backend/restful-status-codes.png)
<!-- 这行作为 alt 描述，不会变成 caption -->
```

带 caption（VitePress 自动渲染）：

```markdown
![RESTful 状态码总览](/images/article/backend/restful-status-codes.png "RESTful 状态码：一张图学会 API 设计")
```

### 暗色 / 浅色双版本

VitePress 支持 `<picture>` 标签自动跟随系统主题：

```markdown
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/images/article/backend/restful-status-codes-dark.png">
  <img src="/images/article/backend/restful-status-codes-light.png" alt="RESTful 状态码">
</picture>
```

## 格式选择

| 场景 | 推荐格式 | 理由 |
|---|---|---|
| 截图（UI、终端、IDE） | **PNG** | 无损、清晰 |
| 照片、复杂插画 | **JPG** | 体积小 |
| 矢量图、图标、流程图 | **SVG** | 体积最小、可任意缩放 |
| 架构图、流程图、时序图 | **Mermaid** | 可复制、可修改、自动适配主题 |
| 动图 | **WebP** | 比 GIF 小 60%+ |

**避免：** 用 Word/PPT 直接导出图片（体积大、质量差）。

## 大小限制

- 单张图 **不超过 300 KB**
- 单篇文章图片总大小 **不超过 1 MB**
- 超大图先用 [tinypng](https://tinypng.com/) 或 [svgo](https://github.com/svg/svgo) 压缩

## 命名规范

```
{category}-{slug}.{ext}

restful-status-codes.png       ✅
devops-cicd-flow.svg           ✅
backend/分布式-id-generator.png ✅  （子目录按分类）

RESTful 状态码.png             ❌  （中文文件名 GitHub Pages 乱码）
RESTfulStatusCodes.png         ❌  （驼峰不统一）
Screenshot 2025-07-25.png      ❌  （带空格）
```

## 暗色 / 浅色适配

文章里的图片分两种：

### 1. 内容图（不依赖主题）

- 截图、终端输出、照片、矢量流程图 → **只要一个版本**
- 截图保留原样（深色背景下输出深色截图，浅色背景下输出浅色截图，按文章主题选）

### 2. 主题相关图（背景色跟随主题）

- 颜色块、UI mockup、code 高亮截图 → **要两个版本**
- 文件名后缀 `-dark.png` / `-light.png`
- 用 `<picture>` 标签自动切换

## Mermaid 优先

能用 Mermaid 画的图（Mermaid 在 VitePress 1.x 原生支持）：

- 架构图
- 流程图
- 时序图
- 类图
- 状态图
- 甘特图
- 思维导图（用 `flowchart`）

```markdown
\`\`\`mermaid
graph LR
  A[用户] --> B[API 网关]
  B --> C[服务 A]
  B --> D[服务 B]
\`\`\`
```

**好处：** 不用维护图片文件、可复制、跟随主题、可访问性更好。

## 优化 checklist

提交图片前：

- [ ] 命名符合规范（小写 + 连字符 + 分类前缀）
- [ ] 大小 < 300 KB（单张）
- [ ] 主题相关的图有 dark/light 双版本
- [ ] 有清晰的 alt 描述
- [ ] 架构类图优先用 Mermaid

## 禁止事项

- ❌ **不要**把图片提交到 `docs/{category}/` 子目录（不会被 VitePress 部署）
- ❌ **不要**用绝对路径或 `../../`（构建时会 404）
- ❌ **不要**引用会过期的图床链接（如微博图床）
- ❌ **不要**用 base64 嵌入（HTML 体积爆炸）

## 相关

- [UI 设计规范](./ui-design.md) — 图片相关的 UI 设计约束
- [示例代码链接规范](./code-example-link.md) — 截图里包含代码时的处理