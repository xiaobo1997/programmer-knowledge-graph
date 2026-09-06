---
title: Spring Boot
date: 2026-09-02
aside: false
wordCount: 1089
readMinutes: 3
---

# ▥ Spring Boot

> Spring Boot 生态系列：从自动装配原理到生产就绪。本系列是 Java 语言系列的生态延伸（Spring Boot 3.5.x 主线 + 4.x 演进），覆盖 IoC 容器 / AOP / Web MVC / 数据访问 / 事务 / 配置 / 测试 / 监控部署完整知识面。

## 系列结构（L1-L4 从点到面）

| 层级 | 内容 | 规模 |
|---|---|---|
| 入门层 | [从零开始认识 Spring Boot 系列](./入门层/从零开始认识SpringBoot系列/0_系列导读-全景)——知识面全覆盖（认知全景 / IoC 容器 / AOP 事件 / Web 层 / 数据访问 / 配置场景 / 测试生产，7 组 23 篇） | 24 文件（0_导读 + 23 正文） |
| 特性层 | [深入理解 X 源码走读系列](./特性层/深入理解自动装配与启动流程/index)——单点纵向深挖（[自动装配与启动流程](./特性层/深入理解自动装配与启动流程/index) / [IoC 容器](./特性层/深入理解IoC容器/index) / [AOP 与代理](./特性层/深入理解AOP与代理/index) / [Web MVC](./特性层/深入理解WebMVC/index)，各 2-3 篇，篇目待定稿） | 4 个子目录 |
| 专题层 | [XX 深度](./专题层/SpringBoot工程实战深度/index)——多点横向组合拳（[工程实战](./专题层/SpringBoot工程实战深度/index) / [数据与事务](./专题层/SpringBoot数据与事务深度/index) / [生产排障](./专题层/SpringBoot生产排障深度/index)，各 3 篇，篇目待定稿） | 3 个专题 |
| 整合层 | [跨专题收束（主题待定，等真实实践）](./整合层/index) | 0 篇（规划中） |

## 入门层规划（23 篇 · 7 组，文章陆续落盘）

### 组 A 认知与全景（2 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 1 | Spring 生态与 Spring Boot 全景 | 生态版图/为什么 Boot/IoC 定位/Boot 3.5 vs 4.x |
| 2 | 第一个应用与工程结构 | 快速上手/标准目录/pom starter/启动流程初识 |

### 组 B IoC 容器核心（4 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 3 | IoC 容器与 Bean 生命周期 | 容器概念/Bean 定义方式/生命周期钩子 |
| 4 | 依赖注入详解 | @Autowired vs @Resource/三种注入方式/选型 |
| 5 | Bean 作用域与循环依赖 | singleton-prototype/三级缓存/解决与规避 |
| 6 | 条件装配与 starter 机制 | @Conditional 家族/自动装配/自定义 starter |

### 组 C AOP 与事件（2 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 7 | AOP 切面编程 | 切点表达式/通知类型/动态代理选择/切面顺序 |
| 8 | 事件机制与解耦 | ApplicationEvent/同步异步监听/事务事件 |

### 组 D Web 层（4 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 9 | Web MVC 请求链路 | DispatcherServlet/HandlerMapping/HandlerAdapter |
| 10 | 参数绑定与校验 | @PathVariable/@RequestBody/Jackson/Bean Validation |
| 11 | 过滤器拦截器与 CORS | Filter vs Interceptor/跨域配置 |
| 12 | 统一异常处理与响应封装 | @RestControllerAdvice/错误码体系 |

### 组 E 数据访问（4 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 13 | 数据源与 JDBC 基础 | 数据源配置/HikariCP/JdbcTemplate |
| 14 | 事务管理 | @Transactional/传播行为/隔离级别/失效场景 |
| 15 | MyBatis 集成 | Mapper/动态 SQL/MyBatis-Plus |
| 16 | 多数据源与读写分离 | AbstractRoutingDataSource/动态数据源/事务边界 |

### 组 F 配置与场景（3 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 17 | 配置体系与外部化配置 | application.yml/配置优先级/@ConfigurationProperties |
| 18 | Profile 多环境 | dev-test-prod/分组/切换打包 |
| 19 | 异步定时与缓存集成 | @Async/@Scheduled/@Cacheable（衔接 Java + Redis） |

### 组 G 测试与生产（4 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 20 | 测试实践 | @SpringBootTest/切片测试/MockMvc |
| 21 | 日志体系 | logback/级别/异步日志/traceId |
| 22 | Actuator 监控与生产就绪 | 端点/健康检查/metrics/优雅停机 |
| 23 | 部署与容器化 | jar/外部化配置/Dockerfile |

## 阅读路径

- 新手：从 [0_系列导读-全景](./入门层/从零开始认识SpringBoot系列/0_系列导读-全景) 开始，按 1-23 顺序读入门层（7 组顺读，知识面全覆盖）
- 进阶：按兴趣进 [特性层](./特性层/深入理解自动装配与启动流程/index) 源码走读（自动装配/IoC/AOP/Web MVC）
- 实战：读 [专题层](./专题层/SpringBoot工程实战深度/index)（工程实战真实）；整合层主题待定，等真实业务实践落位
