---
title: 错误设计与 OpenAPI 规范
date: 2026-09-06
type: deep-dive
tags: [架构, REST, 规划中]
wordCount: 281
readMinutes: 1
---

# 错误设计与 OpenAPI 规范

> RFC 9457 问题细节 / 错误码体系 / OpenAPI 文档化——让消费方「不用问人」。
>
> 本文为系列规划大纲页：篇目结构已定，正文按下方骨架落盘。

## 错误响应的设计目标

- 消费方能程序化处理：机器可读的错误标识（不只人可读的 message）
- 排查有线索：traceId/时间戳/文档链接
- 标准：RFC 9457 Problem Details（type/title/status/detail/instance）

## 错误码体系

- 分层：HTTP 状态码（传输层）+ 业务错误码（body 内，格式如 ORDER_NOT_FOUND）
- 错误码治理：命名空间按域划分、集中注册、避免魔法数字
- 与状态码的映射纪律：409 对应冲突类业务错、422 对应校验失败——不要全塞 400

## OpenAPI 文档化

- OpenAPI 3.x：契约先行（先写 spec 再实现）vs 代码生成注解
- 文档即契约：示例、错误码全集、鉴权方式都在 spec 里
- Mock 与 SDK 生成：契约驱动的协作流程（前端不用等后端）

（正文落盘时按规划大纲展开，骨架占位不影响站点构建）
