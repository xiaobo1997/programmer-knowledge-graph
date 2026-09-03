---
title: SQL 注入器架构与启动注册（BaseMapper 方法从哪来）
type: deep-dive
tags: [MyBatis-Plus, SQL注入器, BaseMapper, L2特性层]
date: 2026-09-02
wordCount: 0
readMinutes: 0
---

# SQL 注入器架构与启动注册（BaseMapper 方法从哪来）

> selectById(1L) 没写 SQL 却能调用——那条 SQL 何时、被谁、怎么生成：注入器 + TableInfo + MappedStatement 启动注册全流程。

> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 规划大纲

### 1. 背景：继承 BaseMapper 就有全套 CRUD
- MapperProxy 动态代理视角
### 2. 启动注册流程
- @MapperScan → SqlSessionFactory → ISqlInjector.inspect → 遍历 BaseMapper 方法
### 3. TableInfo 的角色
- 实体解析产物：表名/主键/字段/逻辑删除标记
### 4. 典型方法生成拆解
- selectById 的 SQL 模板与 MappedStatement 绑定
### 5. 为什么运行时不用再拼
- 启动期一次生成，运行期只做参数绑定
### 6. 反推使用
- 加字段要重启；自定义方法注入入口
### 7. 速记卡 + 预告
- 下一篇自定义方法扩展
