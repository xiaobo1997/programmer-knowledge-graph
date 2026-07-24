<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'

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
        file: "/ai/llm-agent-intro",
        title: "🧪 LLM Agent 入门：什么是 Agent",
        wordCount: 359,
        readMinutes: 1,
        excerpt: "Agent 不是更聪明的聊天机器人，而是能行动的智能体。 一个 LLM Agent 由三部分组成： 1. 大脑：LLM，负责推理和决策 2. 工具：外部函数/A…",
        tags: ["Agent","LLM"],
      },
      {
        file: "/ai/rag-explained",
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
        file: "/architecture/backend-roadmap-3-to-5",
        title: "🧪 后端工程师技术地图：3 年到 5 年路线",
        wordCount: 606,
        readMinutes: 2,
        excerpt: "这张图告诉你每个阶段该学什么、做到什么程度。  一门主流语言（Java / Go / Python）  数据结构与算法基础  SQL 与关系数据库  HTTP/…",
        tags: ["路线","后端","职业"],
      },
      {
        file: "/architecture/cloud-native-path",
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
        file: "/backend/restful-design",
        title: "🧪 RESTful API 设计：九个最佳实践",
        wordCount: 397,
        readMinutes: 1,
        excerpt: "接口比实现更难改。这份清单帮你避开常见的坑。 动词在 HTTP method 里；URL 里只有资源。 集合资源用复数，单条资源在路径里加 ID。 | 场景 |…",
        tags: ["API","REST","设计"],
      },
      {
        file: "/backend/spring-boot-hello",
        title: "🧪 Spring Boot 起步：Hello World 与自动装配原理",
        wordCount: 220,
        readMinutes: 1,
        excerpt: "写给刚开始接触 Spring Boot 的工程师。 新建一个 Application.java： 启动后访问 http://localhost:8080，就能看…",
        tags: ["Java","Spring Boot"],
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
        file: "/career/tech-lead-transition",
        title: "🧪 技术管理转型：从骨干到 TL",
        wordCount: 486,
        readMinutes: 2,
        excerpt: "团队里技术最好的那个人，不一定是最好的 TL。 | 角色 | 核心目标 | 时间分配 | |||| | 骨干工程师 | 写好代码 | 90% 在写代码 | | …",
        tags: ["管理","转型"],
      },
      {
        file: "/career/salary-negotiation",
        title: "🧪 谈薪时机：什么时候开口",
        wordCount: 502,
        readMinutes: 2,
        excerpt: "谈薪不是\"讨价还价\"，而是用对方听得懂的语言表达你的价值。 不要在对方已经决定给你 offer 之前谈薪。筹码 = 对方已经选你但还没发 offer。 不要说\"…",
        tags: ["薪资","Offer"],
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
        file: "/devops/docker-getting-started",
        title: "🧪 Docker 入门：镜像、容器、镜像仓库",
        wordCount: 333,
        readMinutes: 1,
        excerpt: "三句话记住：镜像是模板，容器是实例，仓库是分发。  镜像 (Image)：只读的文件系统快照 + 元数据  容器 (Container)：镜像的运行实例，有自己…",
        tags: ["Docker","容器"],
      },
      {
        file: "/devops/cicd/github-actions-basics",
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
        file: "/devops/github-actions-cicd",
        title: "🧪 GitHub Actions 入门：把仓库变成自动发布系统",
        wordCount: 1292,
        readMinutes: 4,
        excerpt: "写给第一次想给仓库加自动化发布的工程师。一文搞清楚「push 后站点怎么自动更新」。 没有 CICD 的时候，每改一点东西你要： 1. 在本地 build 2.…",
        tags: ["CICD","GitHub Actions","DevOps"],
      },
      {
        file: "/devops/cicd/gitlab-vs-github-actions",
        title: "🧪 GitLab CI vs GitHub Actions：怎么选",
        wordCount: 249,
        readMinutes: 1,
        excerpt: "两个主流 CICD 工具的对比，帮你做技术选型。 | 维度 | GitHub Actions | GitLab CI | |||| | 与代码托管集成 | Gi…",
        tags: ["CICD","GitLab","GitHub Actions","对比"],
      },
      {
        file: "/devops/kubernetes-basics",
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
        file: "/reading/凤凰架构",
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