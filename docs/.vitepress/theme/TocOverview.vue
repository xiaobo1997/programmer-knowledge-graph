<script setup lang="ts">
import { computed, ref } from 'vue'

interface Article {
  file: string
  title: string
  wordCount: number
  readMinutes: number
  excerpt: string
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

const sections: Section[] = [
  {
    key: 'agent',
    icon: '✦',
    label: 'Agent / AI',
    description: 'LLM Agent、Tool Use、RAG、记忆与多步推理。',
    articles: [
      {
        file: '/agent/llm-agent-intro',
        title: 'LLM Agent 入门：什么是 Agent',
        wordCount: 359,
        readMinutes: 1,
        excerpt: '一个 LLM Agent 由三部分组成：'
      },
      {
        file: '/agent/rag-explained',
        title: 'RAG 检索增强生成：让 LLM 用上私有知识',
        wordCount: 462,
        readMinutes: 1,
        excerpt: 'Embedding（向量化）'
      }
    ]
  },
  {
    key: 'career',
    icon: '◉',
    label: '个人成长',
    description: '软技能、职业规划、薪资谈判、效率工具与心理建设。',
    articles: [
      {
        file: '/career/tech-lead-transition',
        title: '技术管理转型：从骨干到 TL',
        wordCount: 486,
        readMinutes: 2,
        excerpt: '转型最痛的不是技术不够，而是身份认同：以前用代码衡量自己，现在用团队业绩衡量自己。'
      },
      {
        file: '/career/salary-negotiation',
        title: '谈薪时机：什么时候开口',
        wordCount: 502,
        readMinutes: 2,
        excerpt: '不要在对方已经决定给你 offer 之前谈薪。筹码 = 对方已经选你但还没发 offer。'
      }
    ]
  },
  {
    key: 'devops',
    icon: '◈',
    label: 'DevOps',
    description: 'Linux、Docker、Kubernetes、CICD、监控、应急响应等工程交付。',
    articles: [
      {
        file: '/devops/docker-getting-started',
        title: 'Docker 入门：镜像、容器、镜像仓库',
        wordCount: 333,
        readMinutes: 1,
        excerpt: 'FROM eclipse-temurin:17-jre-alpine'
      },
      {
        file: '/devops/github-actions-cicd',
        title: 'GitHub Actions 入门：把仓库变成自动发布系统',
        wordCount: 1368,
        readMinutes: 6,
        excerpt: '没有 CICD 的时候，每改一点东西你要：'
      },
      {
        file: '/devops/kubernetes-basics',
        title: 'Kubernetes 核心概念：一文读懂 Pod / Service / Deployment',
        wordCount: 322,
        readMinutes: 1,
        excerpt: 'K8s 调度的最小单位，可以包含 1 个或多个容器：'
      }
    ]
  },
  {
    key: 'fullstack',
    icon: '⌘',
    label: '全栈学习',
    description: '前端、后端、跨端、网络、性能调优等横向技能。',
    articles: [
      {
        file: '/fullstack/restful-design',
        title: 'RESTful API 设计：九个最佳实践',
        wordCount: 397,
        readMinutes: 1,
        excerpt: 'GET    /api/users        ✅'
      },
      {
        file: '/fullstack/spring-boot-hello',
        title: 'Spring Boot 起步：Hello World 与自动装配原理',
        wordCount: 220,
        readMinutes: 1,
        excerpt: '新建一个 Application.java：'
      }
    ]
  },
  {
    key: 'reading-notes',
    icon: '▤',
    label: '读书笔记',
    description: '每一本书的核心观点、个人思考、行动清单与工程连接。',
    articles: [
      {
        file: '/reading-notes/凤凰架构',
        title: '《凤凰架构》读书笔记',
        wordCount: 1787,
        readMinutes: 6,
        excerpt: '本文只做摘要与个人沉淀，不复制官网正文。读完作者原文请直接访问官网。'
      }
    ]
  },
  {
    key: 'roadmap',
    icon: '⬡',
    label: '技术地图',
    description: '各领域学习路径、依赖关系与里程碑。',
    articles: [
      {
        file: '/roadmap/backend-roadmap-3-to-5',
        title: '后端工程师技术地图：3 年到 5 年路线',
        wordCount: 606,
        readMinutes: 2,
        excerpt: '可选方向：'
      },
      {
        file: '/roadmap/cloud-native-path',
        title: '云原生工程师学习路径',
        wordCount: 403,
        readMinutes: 1,
        excerpt: '云原生是一个生态而不是单一技术。学完上面 6 个阶段，你在任何一家公司都能聊得开、做得动。'
      }
    ]
  }
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
          <a :href="a.file" class="toc-article-title">{{ a.title }}</a>
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