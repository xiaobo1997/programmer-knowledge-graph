---
title: 分页插件 PaginationInnerInterceptor 源码
type: deep-dive
tags: [MyBatis-Plus, 插件机制, 分页, L2特性层]
date: 2026-09-02
wordCount: 0
readMinutes: 0
---

# 分页插件 PaginationInnerInterceptor 源码

> 物理分页怎么实现：Page 参数识别、COUNT 查询优化、方言 SQL 改写。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：逻辑分页 vs 物理分页
- （正文落盘时按规划大纲展开）
### 2. Page 参数识别
- 方法参数有 IPage/Page 才算分页；total/records 回填
### 3. COUNT 优化
- 自动 count 生成、optimizeJoin、手动关 count
### 4. 方言改写
- Dialect 抽象：MySQL LIMIT / PG LIMIT OFFSET / Oracle ROWNUM
### 5. 深翻页在机制层的样子
- LIMIT offset 大代价——留钩子给专题 B1
### 6. 反推使用
- maxLimit 保护、单页大小限制
### 7. 速记卡 + 预告
- 下一篇三个安全拦截器逐个拆
