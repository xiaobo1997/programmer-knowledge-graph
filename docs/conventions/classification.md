---
wordCount: 517
readMinutes: 2
---
# 分类命名规范

> 修改/增加分类时必读。

## 当前 9 大类

| 目录 | 中文名 | 图标 |
|---|---|---|
| `backend/` | 后端开发 | ⌬ |
| `frontend/` | 前端开发 | ⌘ |
| `data/` | 数据 & 中间件 | ▥ |
| `devops/` | DevOps & 云原生 | ◉ |
| `ai/` | AI & 大模型 | ✦ |
| `architecture/` | 架构 & 性能 | ⬡ |
| `practice/` | 工程实践 | ⚙ |
| `reading/` | 读书笔记 | ☰ |
| `career/` | 个人成长 | ◐ |

## 目录命名规则

- 全部小写英文
- 单词用连字符 `-` 连接
- 不用驼峰、不用下划线

**示例：**
- ✅ `backend/jvm-tuning/`
- ❌ `backend/jvmTuning/`
- ❌ `backend/jvm_tuning/`

## 改分类时必须同步改 3 个文件

| 文件 | 改什么 |
|---|---|
| `docs/.vitepress/theme/KnowledgeRail.vue` | 顶部胶囊菜单的 sections 数组 |
| `docs/.vitepress/utils.ts` | `titleMap` 映射 |
| `scripts/sync-toc.cjs` | `titleMap` + `iconMap` + `descMap` |

**3 个文件必须同步改！** 不然会出现「胶囊显示 A，侧栏显示 B」的混乱。

## 加新分类的步骤

1. 在 `docs/` 下建新目录（英文小写，连字符）
2. 写 `docs/<新分类>/index.md`（必须，否则访问 `/<新分类>` 会 404）
3. 改上面 3 个文件
4. 跑 `node scripts/sync-toc.cjs` 看是否正确
5. 跑 `npm run docs:build` 看是否报错
6. 提交：写 `docs/changes/YYYY-MM-DD-新增-xxx-分类.md`

## 删分类的步骤

1. 删空目录下所有 `.md` 文章
2. 删 `index.md` / `README.md` 占位
3. 删 `docs/<旧分类>/` 目录
4. 改上面 3 个文件
5. 跑 build 验证
6. 写 `docs/changes/YYYY-MM-DD-删除-xxx-分类.md`

## 二级子目录

- 子目录名也要进 `titleMap`（`utils.ts` + `sync-toc.cjs`）
- 例：`devops/cicd/` → `titleMap.cicd = 'CICD 工具'`
- 不进 KnowledgeRail（顶部只显示一级分类）

## 增加分类前的判断

- ❌ **不应该分**：新内容属于现有 9 大类之一
- ❌ **不应该分**：只是单篇文章，单独建目录太浪费
- ✅ **应该分**：已经积累 3+ 篇相关文章
- ✅ **应该分**：跟现有分类语义上不重叠

## 历史变更

- 2025-07-20：从 6 类（读书笔记/全栈/DevOps/Agent/成长/技术地图）改为 9 类
- 2025-07-20：拆出「数据 & 中间件」「工程实践」两个独立分类

详见 [docs/changes/2025-07-20-classification-restructuring.md](../changes/2025-07-20-classification-restructuring.md) 和 [docs/decisions/0003-7-categories.md](../decisions/0003-7-categories.md)。
