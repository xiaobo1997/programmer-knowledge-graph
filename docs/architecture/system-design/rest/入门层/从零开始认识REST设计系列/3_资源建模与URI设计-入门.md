---
title: 资源建模与 URI 设计
date: 2026-09-06
type: deep-dive
tags: [架构, REST, 规划中]
wordCount: 260
readMinutes: 1
---

# 资源建模与 URI 设计

> 名词化资源 / 层级关系 / 过滤分页排序约定——资源思维的落地。
>
> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 资源思维落地

- 问「操作的是什么东西」：用户列表是资源（/users），动作由方法表达
- 资源用名词复数：/users /orders /merchant-accounts
- 同一资源不同方法 = 不同操作：GET /users 列表 vs POST /users 创建

## 层级与关系建模

- 从属关系用嵌套：/merchants/{id}/orders（商户下的订单）
- 嵌套不宜超过两层，深层关系用顶层资源 + 过滤参数
- 非 CRUD 动作的处理：转账不是「创建转账资源」就是动作子资源（POST /accounts/{id}/transfers）

## 过滤分页排序约定

- 过滤：?status=paid&dateFrom=xx（查询参数）
- 分页：page/size 或 cursor（大数据量游标分页）
- 排序：?sort=-createdAt,amount（- 表示降序）；约定一致性比具体形式重要

（正文落盘时按规划大纲展开，骨架占位不影响站点构建）
