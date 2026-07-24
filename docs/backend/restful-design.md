---
title: RESTful API 设计：九个最佳实践
author: xiaobo
level: 进阶
tags: [API, REST, 设计]
wordCount: 397
readMinutes: 1
test: true
---


# RESTful API 设计：九个最佳实践

> 接口比实现更难改。这份清单帮你避开常见的坑。

## 1. 用名词而不是动词

```
GET    /api/users        ✅
GET    /api/getUsers     ❌
```

动词在 HTTP method 里；URL 里只有资源。

## 2. 复数而不是单数

```
GET    /api/users/123    ✅
GET    /api/user/123     ❌
```

集合资源用复数，单条资源在路径里加 ID。

## 3. 用 HTTP 状态码表达语义

| 场景 | 状态码 |
|---|---|
| 创建成功 | 201 |
| 删除成功（无 body） | 204 |
| 参数错误 | 400 |
| 未认证 | 401 |
| 无权限 | 403 |
| 资源不存在 | 404 |
| 冲突（如重复提交） | 409 |
| 服务异常 | 500 |

## 4. 版本化放在 URL 里

```
/api/v1/users
/api/v2/users
```

路径版本最简单，破坏性变更时整体切。

## 5. 分页参数统一

```
GET /api/users?page=1&size=20&sort=createdAt,desc
```

永远返回总数 + 总页数，前端好渲染。

## 6. 错误响应统一格式

```json
{
  "code": "USER_NOT_FOUND",
  "message": "用户不存在",
  "details": { "userId": 123 }
}
```

错误码是字符串，前端可以本地化。

## 7. 用过滤参数而不是路径

```
GET /api/orders?status=PAID&createdAtFrom=2026-01-01
```

路径用来定位资源，过滤条件放在 query。

## 8. 重要字段加 ETag

```http
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

减少网络流量，缓存友好。

## 9. 限流和幂等

- **限流**：返回 `429 Too Many Requests`，带 `Retry-After` 头
- **幂等**：写接口支持 `Idempotency-Key` 头，防止重复扣款

## 总结

API 设计是**团队的合约**。一旦发布，破坏性变更成本极高。这九条不是全部，但能让你绕开大部分常见坑。

## 参考

- Microsoft API Design Guidelines
- Google API Improvement Proposals