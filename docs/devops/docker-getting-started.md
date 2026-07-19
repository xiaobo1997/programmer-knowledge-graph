---
title: Docker 入门：镜像、容器、镜像仓库
author: xiaobo
level: 入门
tags: [Docker, 容器]
wordCount: 333
readMinutes: 1
---

# Docker 入门：镜像、容器、镜像仓库

> 三句话记住：镜像是模板，容器是实例，仓库是分发。

## 核心概念

- **镜像 (Image)**：只读的文件系统快照 + 元数据
- **容器 (Container)**：镜像的运行实例，有自己的可写层
- **仓库 (Registry)**：存储和分发镜像的服务（Docker Hub / 阿里云 ACR / Harbor）

## 最小 Dockerfile

```dockerfile
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

构建 + 运行：

```bash
docker build -t myapp:1.0 .
docker run -p 8080:8080 myapp:1.0
```

## 常用命令速查

```bash
docker ps                  # 列出运行中的容器
docker ps -a               # 列出所有容器（包括已停止）
docker images              # 列出本地镜像
docker logs <container>    # 查看日志
docker exec -it <c> sh     # 进入容器
docker rm -f <c>           # 强制删除
docker system prune -a     # 清理无用资源
```

## 数据持久化

容器是临时的，重要数据必须挂载卷：

```bash
docker run -v /host/data:/container/data myapp
```

或用命名卷：

```bash
docker volume create mydata
docker run -v mydata:/container/data myapp
```

## 网络模式

- `bridge`：默认，容器间通过 IP 互通
- `host`：共用宿主机网络
- `none`：无网络

## 总结

Docker 解决的核心问题是**环境一致性**——开发、测试、生产用同一份镜像。下一步可以学 Docker Compose 多容器编排。

## 参考

- 官方文档：https://docs.docker.com
- 《Docker 实战》第 2 版