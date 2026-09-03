---
title: "深入理解Web MVC（源码走读）"
date: 2026-09-03
aside: false
wordCount: 0
readMinutes: 0
---

# 深入理解Web MVC（源码走读）

> doDispatch 的分发决策、参数解析器链、异常处理器的兜底——MVC 主链路源码走读。
>
> **核心观点：** 一次请求在 DispatcherServlet 中的旅程：HandlerMapping 找方法、HandlerAdapter 调方法、异常解析器兜底。

## 一、本子系列在 4 层架构中的位置

| 层 | 定位 | 本子系列位置 |
|---|---|---|
| L1 入门层 | 概念扫盲 + 会用 | [入门 9 / 10 / 11 / 12](../../入门层/从零开始认识SpringBoot系列/0_系列导读-全景) |
| **L2 特性层** ✅ | 单点纵向深挖 | **本子系列（篇目待定稿）** |
| L4 整合层 | 跨专题收束 | [整合层（规划中）](../../整合层/index) |

## 二、规划方向（篇目待定稿）

> 大纲已确认本子系列的方向与数量，篇名与占位文件在定稿后补齐（不虚构篇名）。

| 方向 | 覆盖内容 |
|---|---|
| DispatcherServlet 分发与参数解析源码 | doDispatch 全流程 / HandlerMethodArgumentResolver 链 |
| 拦截器与异常处理源码 | HandlerInterceptor 执行点 / ExceptionHandlerExceptionResolver |

**主线：** doDispatch → getHandler → invokeHandlerMethod → HandlerExceptionResolver

## 三、阅读建议

- 前置：入门 9-12（Web MVC 四篇）
- 顺序：按方向编号顺序读，每个方向独立成篇
- 对照源码：Spring Boot / Spring Framework 官方文档（3.5 主线 + 4.x 差异标注）
- 关联：正文落盘前，先在本目录写单篇写作大纲（对照源码核类名/行为）
