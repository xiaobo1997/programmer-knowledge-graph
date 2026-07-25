---
wordCount: 486
readMinutes: 2
---
# 文章前缀规范

> 写新文章时必读。

## 两种状态

| 前缀 | 含义 | 处理方式 |
|---|---|---|
| `[test]` | 测试占位 | 临时内容，会被未来正式文章替换 |
| 无前缀 | 正式内容 | 长期保留，AI 不要轻易改动 |

## 命名格式

```
docs/<分类>/[test]<文章标题>.md
docs/<分类>/<文章标题>.md
```

**示例：**

- `backend/[test]spring-boot-hello.md` — 后端的测试文章
- `backend/spring-ioc-deep-dive.md` — 后端的正式文章
- `devops/cicd/[test]github-actions-basics.md` — 子目录下的测试文章

## 同步显示

- `ArticleMeta.vue` 读取文件名检测 `[test]` 前缀
- 显示时给文章加一个「🧪 测试」灰色徽章
- 总目录 / 侧栏里 `[test]` 文章的标题前显示 🧪 图标
- 这样读者能一眼区分测试 vs 正式

## 什么时候用 [test]？

- ✅ **应该用**：临时记录 demo / 教程代码 / 未整理的初稿
- ✅ **应该用**：从其他仓库复制来的待整理内容
- ❌ **不应该用**：写完就是正式内容的文章
- ❌ **不应该用**：质量很差但「算了就当正式了」的文章——应该删

## 什么时候把 [test] 文章变成正式？

- 内容质量足够「长期值得保留」
- 经过自己或同行 review
- 加了合适的标题、标签、字数

**步骤：**

1. 把 `[test]` 前缀从文件名去掉
2. 跑 `node scripts/sync-toc.cjs`
3. 跑 `npm run docs:build` 验证
4. 提交并写 `docs/changes/YYYY-MM-DD-正式化-xxx.md`

## 什么时候删除 [test] 文章？

- [test] 文章质量差、没参考价值
- 内容已经被新文章覆盖
- 写新文章时用了更好的实现，原 [test] 不需要了

**步骤：**

1. 删 `docs/<分类>/[test]<文件名>.md`
2. 跑 `node scripts/sync-toc.cjs`
3. 跑 `npm run docs:build` 验证
4. 提交

## 实现细节

### 文件名检测

`scripts/sync-toc.cjs` 在扫描时会：

- 检测 `name.startsWith('[test]')`
- 在生成 `TocOverview.vue` 数据时给 `title` 加 `🧪 ` 前缀
- 在生成的 `sections.json` 中标记 `isTest: true`

### UI 提示

`ArticleMeta.vue` 显示 🧪 测试徽章在文章顶部。

---

详见 [docs/changes/2025-07-20-classification-restructuring.md](../changes/2025-07-20-classification-restructuring.md)。
