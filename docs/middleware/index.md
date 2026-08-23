---
title: 中间件
aside: false
wordCount: 130
readMinutes: 1
---

<script setup lang="ts">
import TocOverview from '../.vitepress/theme/TocOverview.vue'
</script>

# ▣ 中间件

> 消息队列（RocketMQ、Kafka）、缓存（Redis）、反向代理（Nginx、LVS）等通用基础设施中间件。

<TocOverview filter="middleware" />

## 沉淀原则

- 写「值得保留的认知」，不写 1+1=2
- 一个中间件一个子目录，命名用英文小写（如 `rocketmq/`、`redis/`）
- 判定标准：不承载业务主数据（消息是流动的、缓存可重建）→ 归本分类；承载业务主数据（MySQL、ES）→ 归 `data/`
- 服务治理类组件（注册中心、网关）归 `architecture/service-governance/`
