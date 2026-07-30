<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import CategoryIcon from './CategoryIcon.vue'

const COLOR_MAP: Record<string, string> = {
  backend: '#f97316',
  frontend: '#06b6d4',
  data: '#eab308',
  devops: '#0ea5e9',
  ai: '#a855f7',
  architecture: '#14b8a6',
  practice: '#64748b',
  reading: '#f59e0b',
  career: '#ec4899',
}

interface Article {
  file: string
  title: string
  wordCount: number
  readMinutes: number
  excerpt: string
  tags?: string[]
}

interface Section {
  key: string
  icon: string
  label: string
  description: string
  articles: Article[]
}

const props = defineProps<{
  filter?: string
}>()

const { site } = useData()
function joinPath(base: string, file: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const f = file.startsWith('/') ? file : '/' + file
  return b + f
}
const base = computed(() => joinPath(site.value.base || '/', ''))

const sections: Section[] = [
  {
    key: 'ai',
    icon: '✦',
    label: "AI & 大模型",
    description: "LLM、Agent、RAG、向量数据库、Prompt 工程。",
    articles: [
      {
        file: "/ai/llm-agent/1_intro",
        title: "🧪 LLM Agent 入门：什么是 Agent",
        wordCount: 359,
        readMinutes: 1,
        excerpt: "Agent 不是更聪明的聊天机器人，而是能行动的智能体。 一个 LLM Agent 由三部分组成： 1. 大脑：LLM，负责推理和决策 2. 工具：外部函数/A…",
        tags: ["Agent","LLM"],
      },
      {
        file: "/ai/rag/1_explained",
        title: "🧪 RAG 检索增强生成：让 LLM 用上私有知识",
        wordCount: 462,
        readMinutes: 1,
        excerpt: "RAG 解决的核心问题：让 LLM 回答它训练时没见过的信息。  LLM 训练数据有截止时间  LLM 不懂你的公司内部文档  LLM 可能产生幻觉（编造答案）…",
        tags: ["RAG","LLM","向量数据库"],
      },
    ],
  },
  {
    key: 'architecture',
    icon: '⬡',
    label: "架构 & 性能",
    description: "系统设计、高并发、容量规划、稳定性工程。",
    articles: [
      {
        file: "/architecture/backend-roadmap/1_3-to-5-year",
        title: "🧪 后端工程师技术地图：3 年到 5 年路线",
        wordCount: 606,
        readMinutes: 2,
        excerpt: "这张图告诉你每个阶段该学什么、做到什么程度。  一门主流语言（Java / Go / Python）  数据结构与算法基础  SQL 与关系数据库  HTTP/…",
        tags: ["路线","后端","职业"],
      },
      {
        file: "/architecture/cloud-native/1_path",
        title: "🧪 云原生工程师学习路径",
        wordCount: 403,
        readMinutes: 1,
        excerpt: "这条路径帮你从\"会用 Docker\"过渡到\"能在生产环境用 K8s\"。  Docker 命令、Dockerfile 编写  Docker Compose 多容器…",
        tags: ["云原生","K8s","路线"],
      },
    ],
  },
  {
    key: 'backend',
    icon: '⌬',
    label: "后端开发",
    description: "Java/Go/Python、数据库、消息队列、分布式、JVM 调优。",
    articles: [
      {
        file: "/backend/rest/1_restful-design",
        title: "🧪 RESTful API 设计：九个最佳实践",
        wordCount: 397,
        readMinutes: 1,
        excerpt: "接口比实现更难改。这份清单帮你避开常见的坑。 动词在 HTTP method 里；URL 里只有资源。 集合资源用复数，单条资源在路径里加 ID。 | 场景 |…",
        tags: ["API","REST","设计"],
      },
      {
        file: "/backend/spring-boot/1_hello-world",
        title: "🧪 Spring Boot 起步：Hello World 与自动装配原理",
        wordCount: 220,
        readMinutes: 1,
        excerpt: "写给刚开始接触 Spring Boot 的工程师。 新建一个 Application.java： 启动后访问 http://localhost:8080，就能看…",
        tags: ["Java","Spring Boot"],
      },
      {
        file: "/backend/java/java17特性/1.17的亮点",
        title: "1.17 的亮点：Java 17 五大新特性速览",
        wordCount: 991,
        readMinutes: 3,
        excerpt: "5 个新特性 + 1 张图 + 10 行代码，5 分钟搞懂 Java 17 为什么值得升级。  这是 Java 17 新特性系列第 1 篇：亮点速览。 Java…",
        tags: ["后端","Java","LTS","新特性","速览"],
      },
    ],
  },
  {
    key: 'biz',
    icon: '◈',
    label: "业务知识",
    description: "互联网金融、支付体系、跨境收单等业务领域的全维度认知。",
    articles: [
      {
        file: "/biz/跨境支付收单/10_端到端实战-境外卡全链路",
        title: "端到端实战：境外 VISA 卡在中国商户的全链路走查",
        wordCount: 721,
        readMinutes: 2,
        excerpt: "一句话定义：用一个真实场景走通跨境收单的全链路——新加坡用户用 VISA 卡买 100 SGD 的 SaaS 软件，钱怎么一步步到深圳商户的账上。 | 步骤 |…",
        tags: ["跨境支付","端到端","实战","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/8_多币种账户体系-设计原理",
        title: "多币种账户体系：从模型到状态机的设计原理",
        wordCount: 513,
        readMinutes: 2,
        excerpt: "一句话定义：跨境收单的账户体系 = 每个商户有多个币种子账户 + 一个分润账户 + 一个保证金账户。核心挑战不是存钱，而是汇率波动时怎么记账和怎么对账。 | 策…",
        tags: ["跨境支付","账户","多币种","数据模型","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/7_跨境对账与结算-架构设计",
        title: "跨境对账与结算：三方模型、换汇与差异处理",
        wordCount: 1021,
        readMinutes: 3,
        excerpt: "一句话定义：跨境对账 = 收单机构 vs 卡组织 vs 收单行 三方逐笔核对。任何一方对不平都不能结算。跨境结算比国内多两件事：换汇和外管申报。 | 维度 | …",
        tags: ["跨境支付","对账","结算","换汇","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/9_风控与合规-跨境监管框架",
        title: "跨境风控与合规：3DS、拒付率、反洗钱与制裁筛查",
        wordCount: 756,
        readMinutes: 2,
        excerpt: "一句话定义：跨境风控 = 3DS 认证（事前）+ 实时风控（事中）+ 拒付处理（事后）。合规 = AML/KYC + 制裁名单筛查 + 外管申报。风控太松 → …",
        tags: ["跨境支付","风控","3DS","拒付","AML","合规","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/2_参与方全景-9类角色拆解",
        title: "跨境收单的 9 类参与者：谁在赚钱，谁在扛风险",
        wordCount: 1879,
        readMinutes: 6,
        excerpt: "一句话定义：跨境收单不是两个人（用户和商户）的事。一笔 VISA 卡交易跨越 3 个国家、经过 6 个机构、涉及 9 类参与者。搞懂每个角色干什么、赚什么钱、扛…",
        tags: ["跨境支付","收单","角色","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/4_业务模式-费率与分润深度",
        title: "跨境收单业务模式：聚合 vs 直连，费率与分润深度拆解",
        wordCount: 1390,
        readMinutes: 4,
        excerpt: "一句话定义：跨境收单有三种主流模式——聚合收单（如 Stripe）、直连卡组织（如直接签约 VISA）、本地收单（在当地有牌照）。选哪种取决于你的交易量、技术能…",
        tags: ["跨境支付","收单","业务模式","费率","分润","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/12_支付方式与交易类型矩阵",
        title: "跨境支付能力全景：7 种支付方式 × 10 种交易类型",
        wordCount: 784,
        readMinutes: 5,
        excerpt: "一句话定义：跨境支付不止 VISA 卡。7 种支付方式（钱包/卡/网银/BNPL/现金/转账/加密）× 3 种场景（线上/线下/O2O）× 10 种交易类型（P…",
        tags: ["跨境支付","支付方式","能力矩阵","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/1_概述-10分钟入门",
        title: "跨境支付收单：技术人 10 分钟入门",
        wordCount: 1348,
        readMinutes: 4,
        excerpt: "一句话定义：跨境支付收单 = 让境外消费者用他们习惯的支付方式（VISA、Mastercard、本地钱包），在中国商户的网站或 App 上付款，钱最后换成人民币…",
        tags: ["跨境支付","收单","业务知识"],
      },
      {
        file: "/biz/国内支付/1_清结算体系",
        title: "清结算体系：一笔支付钱的\"后半场",
        wordCount: 3473,
        readMinutes: 11,
        excerpt: "一句话定义：清算是算账——谁该给谁多少钱；结算是转账——把钱真正打过去。清结算是支付交易的\"后半场\"，用户无感知，但占支付机构 80% 的运营成本。 你微信扫码…",
        tags: ["支付","清结算","国内支付","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/11_全局架构设计-跨境收单系统全景",
        title: "全局架构设计：跨境收单系统全景与从零搭建决策清单",
        wordCount: 923,
        readMinutes: 3,
        excerpt: "一句话定义：跨境收单系统 = 接入层 + 交易层 + 通道层 + 风控层 + 结算层 + 商户层。每层独立演进、独立部署、独立故障隔离。从零搭建的核心决策：直连…",
        tags: ["跨境支付","架构设计","系统设计","技术架构","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/5_收单系统架构-模块与部署",
        title: "收单系统架构：从功能模块到部署拓扑",
        wordCount: 1336,
        readMinutes: 4,
        excerpt: "一句话定义：收单系统不是一块巨石。它至少分 6 层——接入层、交易层、通道层、风控层、结算层、商户层。每一层独立演进、独立故障隔离。 | 组件 | 职责 | 技…",
        tags: ["跨境支付","收单","系统架构","技术架构","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/6_通道管理与路由-深度",
        title: "通道管理与路由：从原理到实践的深度拆解",
        wordCount: 1142,
        readMinutes: 4,
        excerpt: "一句话定义：通道 = 收单系统对接的「具体支付路径」。选错通道 = 多花钱、少覆盖、高故障率。通道管理 = 接入 → 测试 → 上线 → 监控 → 降级 → 下…",
        tags: ["跨境支付","通道","路由","业务知识"],
      },
      {
        file: "/biz/跨境支付收单/3_外卡支付链路-从授权到结算",
        title: "外卡支付全流程：一笔 VISA 卡的钱怎么到你账上",
        wordCount: 1493,
        readMinutes: 5,
        excerpt: "一句话定义：外卡支付 = 境外消费者用 VISA/Mastercard 在中国商户网站付款，钱经过 6 个机构、换一次汇，T+3~T+7 到商户账上。 很多人以…",
        tags: ["跨境支付","收单","交易流程","业务知识"],
      },
    ],
  },
  {
    key: 'career',
    icon: '◐',
    label: "个人成长",
    description: "软技能、Career、面试、薪资谈判、心理建设。",
    articles: [
      {
        file: "/career/tech-lead/1_transition",
        title: "🧪 技术管理转型：从骨干到 TL",
        wordCount: 486,
        readMinutes: 2,
        excerpt: "团队里技术最好的那个人，不一定是最好的 TL。 | 角色 | 核心目标 | 时间分配 | |||| | 骨干工程师 | 写好代码 | 90% 在写代码 | | …",
        tags: ["管理","转型"],
      },
      {
        file: "/career/薪资谈判/1_negotiation",
        title: "🧪 谈薪时机：什么时候开口",
        wordCount: 502,
        readMinutes: 2,
        excerpt: "谈薪不是\"讨价还价\"，而是用对方听得懂的语言表达你的价值。 不要在对方已经决定给你 offer 之前谈薪。筹码 = 对方已经选你但还没发 offer。 不要说\"…",
        tags: ["薪资","Offer"],
      },
    ],
  },
  {
    key: 'data',
    icon: '▥',
    label: "数据 & 中间件",
    description: "MySQL、Redis、Elasticsearch、消息队列、缓存设计。",
    articles: [
      {
        file: "/data/rocketmq/事务消息/1_transactional-message",
        title: "RocketMQ 事务消息：分布式事务的工程实践",
        wordCount: 2753,
        readMinutes: 9,
        excerpt: "在「写业务单 + 通知下游」必须强一致的链路里，事务消息是工程上最常用的解法。  这篇文章讲清楚 RocketMQ 事务消息怎么解决这个问题，包括原理、实战、踩…",
        tags: ["数据 & 中间件","分布式事务","RocketMQ","消息中间件"],
      },
    ],
  },
  {
    key: 'devops',
    icon: '◉',
    label: "DevOps & 云原生",
    description: "Linux、Docker、Kubernetes、CICD、监控、应急响应等工程交付。",
    articles: [
      {
        file: "/devops/docker/1_getting-started",
        title: "🧪 Docker 入门：镜像、容器、镜像仓库",
        wordCount: 333,
        readMinutes: 1,
        excerpt: "三句话记住：镜像是模板，容器是实例，仓库是分发。  镜像 (Image)：只读的文件系统快照 + 元数据  容器 (Container)：镜像的运行实例，有自己…",
        tags: ["Docker","容器"],
      },
      {
        file: "/devops/cicd/github-actions/2_basics",
        title: "🧪 GitHub Actions 基础：5 个核心概念",
        wordCount: 172,
        readMinutes: 1,
        excerpt: "给第一次写 workflow 的人的速通教程。 定义在 .github/workflows/.yml，每个文件是一个 workflow。 触发 workflow…",
        tags: ["CICD","GitHub Actions"],
      },
      {
        file: "/devops/cicd/advanced/actions-matrix",
        title: "🧪 GitHub Actions 矩阵构建：多环境并行跑",
        wordCount: 251,
        readMinutes: 1,
        excerpt: "用 matrix 一次跑多个环境 / 多个版本 / 多个操作系统。 这个配置会跑 3 × 2 = 6 个 job：3 个 Node 版本 × 2 个操作系统。 …",
        tags: ["CICD","GitHub Actions","矩阵"],
      },
      {
        file: "/devops/cicd/advanced/reusable-workflows",
        title: "🧪 GitHub Actions 可复用 workflow",
        wordCount: 281,
        readMinutes: 1,
        excerpt: "用 workflowcall 把通用流水线抽出来，多仓库共享。 你有 5 个仓库都用同一种「install → test → build → deploy」流程…",
        tags: ["CICD","GitHub Actions","DRY"],
      },
      {
        file: "/devops/cicd/github-actions/1_overview",
        title: "🧪 GitHub Actions 入门：把仓库变成自动发布系统",
        wordCount: 1292,
        readMinutes: 4,
        excerpt: "写给第一次想给仓库加自动化发布的工程师。一文搞清楚「push 后站点怎么自动更新」。 没有 CICD 的时候，每改一点东西你要： 1. 在本地 build 2.…",
        tags: ["CICD","GitHub Actions","DevOps"],
      },
      {
        file: "/devops/cicd/github-actions/3_vs",
        title: "🧪 GitLab CI vs GitHub Actions：怎么选",
        wordCount: 249,
        readMinutes: 1,
        excerpt: "两个主流 CICD 工具的对比，帮你做技术选型。 | 维度 | GitHub Actions | GitLab CI | |||| | 与代码托管集成 | Gi…",
        tags: ["CICD","GitLab","GitHub Actions","对比"],
      },
      {
        file: "/devops/kubernetes/1_basics",
        title: "🧪 Kubernetes 核心概念：一文读懂 Pod / Service / Deployment",
        wordCount: 322,
        readMinutes: 1,
        excerpt: "K8s 不只是容器调度器，是一整套声明式运维系统。 K8s 调度的最小单位，可以包含 1 个或多个容器： 声明期望状态，K8s 自动维护： 把一组 Pod 暴露…",
        tags: ["Kubernetes","云原生"],
      },
    ],
  },
  {
    key: 'reading',
    icon: '☰',
    label: "读书笔记",
    description: "整本书学习心得、跨领域阅读。",
    articles: [
      {
        file: "/reading/凤凰架构/1_笔记",
        title: "🧪 《凤凰架构》读书笔记",
        wordCount: 1787,
        readMinutes: 6,
        excerpt: "一本围绕\"如何构建一套可靠的分布式大型软件系统\"开源架构书，作者从事企业级架构研发。原文以 GitHub Pages + TravisCI 持续同步发布，免费、…",
        tags: ["架构","分布式","云原生"],
      },
    ],
  },
]

const activeKey = ref<string>(props.filter || 'all')

const visibleSections = computed<Section[]>(() => {
  if (activeKey.value === 'all') return sections
  return sections.filter((s) => s.key === activeKey.value)
})

const showFilters = computed(() => !props.filter)

const totalArticles = computed(() => sections.reduce((s, x) => s + x.articles.length, 0))
const totalWords = computed(() => sections.reduce((s, x) => s + x.articles.reduce((a, b) => a + b.wordCount, 0), 0))
const totalMinutes = computed(() => sections.reduce((s, x) => s + x.articles.reduce((a, b) => a + b.readMinutes, 0), 0))

function setActive(key: string) {
  activeKey.value = key
}
</script>

<template>
  <div class="toc-page">
    <div class="toc-stats">
      <span><strong>{{ sections.length }}</strong> 个分类</span>
      <span><strong>{{ totalArticles }}</strong> 篇文章</span>
      <span><strong>{{ totalWords.toLocaleString() }}</strong> 字</span>
      <span>预计阅读 <strong>{{ totalMinutes }}</strong> 分钟</span>
    </div>

    <div v-if="showFilters" class="toc-filters">
      <button
        type="button"
        class="toc-filter"
        :class="{ active: activeKey === 'all' }"
        @click="setActive('all')"
      >
        全部
      </button>
      <button
        v-for="s in sections"
        :key="s.key"
        type="button"
        class="toc-filter"
        :class="{ active: activeKey === s.key }"
        :style="{ '--toc-color': COLOR_MAP[s.key] || '#10b981' }"
        @click="setActive(s.key)"
      >
        <span class="filter-icon">{{ s.icon }}</span>
        <span>{{ s.label }}</span>
        <span class="filter-count">{{ s.articles.length }}</span>
      </button>
    </div>

    <div v-for="s in visibleSections" :key="s.key" class="toc-section">
      <div class="toc-section-header">
        <h2 class="toc-section-title">
          <span class="toc-section-icon">{{ s.icon }}</span>
          <span>{{ s.label }}</span>
          <span class="toc-section-count">{{ s.articles.length }} 篇</span>
        </h2>
        <p class="toc-section-desc">{{ s.description }}</p>
      </div>
      <ul class="toc-articles">
        <li v-for="a in s.articles" :key="a.file" class="toc-article">
          <a :href="joinPath(base, a.file)" class="toc-article-title">{{ a.title }}</a>
          <div class="toc-article-meta">
            <span>⏱ {{ a.readMinutes }} 分钟</span>
            <span class="dot">·</span>
            <span>{{ a.wordCount.toLocaleString() }} 字</span>
          </div>
          <p v-if="a.excerpt" class="toc-article-excerpt">{{ a.excerpt }}</p>
        </li>
      </ul>
    </div>

    <div v-if="visibleSections.length === 0" class="toc-empty">
      该分类暂无内容。
    </div>
  </div>
</template>

<style scoped>
.toc-page {
  margin: 8px 0 32px;
}
.toc-stats {
  margin: 16px 0 24px;
  padding: 14px 18px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.toc-stats strong {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.toc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 24px;
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.toc-filter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
}
.toc-filter:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.toc-filter.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
}
.filter-icon {
  font-size: 14px;
}
.filter-count {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}
.toc-filter.active .filter-count {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}
.toc-section {
  margin: 32px 0;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--vp-c-divider);
}
.toc-section:last-child {
  border-bottom: none;
}
.toc-section-header {
  margin-bottom: 12px;
}
.toc-section-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}
.toc-section-icon {
  font-size: 22px;
  color: var(--vp-c-brand-1);
}
.toc-section-count {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-weight: 400;
  margin-left: 4px;
}
.toc-section-desc {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.toc-articles {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}
.toc-article {
  padding: 12px 0;
  border-top: 1px solid var(--vp-c-divider);
}
.toc-article:first-child {
  border-top: none;
}
.toc-article-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.toc-article-title:hover {
  text-decoration: underline;
}
.toc-article-meta {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  display: flex;
  gap: 6px;
  align-items: center;
}
.toc-article-meta .dot {
  color: var(--vp-c-text-3);
}
.toc-article-excerpt {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
.toc-empty {
  text-align: center;
  padding: 48px 0;
  color: var(--vp-c-text-2);
}
</style>