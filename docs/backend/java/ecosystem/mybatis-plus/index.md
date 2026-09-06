---
title: MyBatis-Plus
date: 2026-09-02
aside: false
wordCount: 854
readMinutes: 3
---

# ▥ MyBatis-Plus

> MyBatis-Plus 生态系列：从「只增强不改变」的定位到生产实战。本系列是 Spring Boot 系列的兄弟系列——Spring Boot 15 只讲原生 MyBatis 接入，MyBatis-Plus 全套深度（BaseMapper / 条件构造器 / 插件机制 / SQL 注入器 / 生产实战）独立成体系（MyBatis-Plus 3.5.x 主线，底座 MyBatis 3.5.x）。

## 系列结构（L1-L4 从点到面）

| 层级 | 内容 | 规模 |
|---|---|---|
| 入门层 | [从零开始认识 MyBatis-Plus 系列](./入门层/从零开始认识MyBatisPlus系列/0_系列导读-全景)——知识面全覆盖（认知集成 / CRUD 核心 / 特色功能 / 高级机制 / 生态生产，5 组 16 篇） | 17 文件（0_导读 + 16 正文，落盘中） |
| 特性层 | 深入理解 X 源码走读——单点纵向深挖，3 子目录 8 篇：[条件构造器](./特性层/深入理解条件构造器/index) / [插件机制](./特性层/深入理解插件机制/index) / [SQL 注入器](./特性层/深入理解SQL注入器/index)（大纲已定，正文落盘中） | 3 子目录 × 8 篇 |
| 专题层 | XX 深度——多点横向组合拳，2 专题 6 篇：[生产实战深度](./专题层/MyBatisPlus生产实战深度/index) / [性能与大数据量深度](./专题层/MyBatisPlus性能与大数据量深度/index)（大纲已定，正文落盘中） | 2 专题 × 3 篇 |
| 整合层 | 数据访问层工程实践（等真实业务实践主题） | 1-2 篇（规划中） |

## 入门层规划（16 篇 · 5 组，文章陆续落盘）

### 组 A 认知与集成（2 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 1 | ORM 全景与 MyBatis-Plus 定位 | JDBC → MyBatis → MP 演进/只增强不改变/与 JPA 对比 |
| 2 | 快速上手与工程集成 | starter 引入/第一个 CRUD/yml 配置/与 MyBatis 共存 |

### 组 B CRUD 核心（4 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 3 | BaseMapper 通用 CRUD | select-insert-update-delete 全家桶/参数语义 |
| 4 | IService 与 ServiceImpl | 业务层封装/saveOrUpdate/批量操作/链式调用 |
| 5 | 条件构造器 Wrapper 体系 | QueryWrapper/UpdateWrapper/Lambda 版/防 SQL 注入 |
| 6 | 注解映射与主键策略 | @TableName/@TableId/@TableField/IdType 雪花-UUID |

### 组 C MP 特色功能（4 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 7 | 分页插件 | PaginationInnerInterceptor/Page 对象/物理分页/方言 |
| 8 | 逻辑删除 | @TableLogic/全局配置/查询自动过滤/注意点 |
| 9 | 乐观锁 | @Version/插件/重试语义 |
| 10 | 字段自动填充 | MetaObjectHandler/create_time-update_time/审计字段 |

### 组 D 高级机制（3 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 11 | 代码生成器与 MyBatisX | AutoGenerator/模板/IDEA 插件/工程规范 |
| 12 | 自定义 SQL 与 XML 混用 | @Select/XML/ew.customSqlSegment 传参 |
| 13 | SQL 注入器与自定义方法 | ISqlInjector/AbstractMethod/全局方法扩展 |

### 组 E 生态与生产（3 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 14 | 插件机制与拦截器链 | MybatisPlusInterceptor/InnerInterceptor/多租户-动态表名-防全表更新 |
| 15 | 与 MyBatis/JPA/Spring Data 选型 | 单表 CRUD vs 复杂查询/团队习惯/组合边界 |
| 16 | 生产实战与常见坑 | 批量插入性能/大分页深翻页/逻辑删除与唯一索引/与 ShardingSphere |

## 阅读路径

- 新手：从 0_系列导读-全景 开始，按 1-16 顺序读入门层（5 组顺读，知识面全覆盖）
- 进阶：按兴趣进特性层源码走读（条件构造器 / 插件机制 / SQL 注入器）
- 实战：读专题层 + 整合层（等真实业务实践主题落位）
