---
title: Spring Boot 起步：Hello World 与自动装配原理
author: xiaobo
level: 入门
tags: [Java, Spring Boot]
wordCount: 220
readMinutes: 1
test: true
---


# Spring Boot 起步：Hello World 与自动装配原理

> 写给刚开始接触 Spring Boot 的工程师。

## 一个最小例子

新建一个 `Application.java`：

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

启动后访问 `http://localhost:8080`，就能看到一个默认页面。整个应用不到 100 行代码。

## 自动装配原理

`@SpringBootApplication` 是三个注解的组合：

- `@SpringBootConfiguration`：声明是配置类
- `@EnableAutoConfiguration`：开启自动装配
- `@ComponentScan`：扫描包内组件

`@EnableAutoConfiguration` 内部通过 `AutoConfigurationImportSelector` 加载 `META-INF/spring.factories` 里注册的自动配置类，按 `@Conditional` 注解决定是否生效。

## 总结

Spring Boot 的核心是**约定优于配置**——你不需要写一堆 XML，启动器帮你拼好依赖，自动装配帮你跑起来常见中间件。下一步是理解 starter 机制和条件装配。

## 参考

- 官方文档：https://spring.io/projects/spring-boot
- 《Spring Boot 实战》第 4 版