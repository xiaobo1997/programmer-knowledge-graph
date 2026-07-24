<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { site } = useData()
function joinPath(base: string, file: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const f = file.startsWith('/') ? file : '/' + file
  return b + f
}
const base = computed(() => joinPath(site.value.base || '/', ''))

// 9 大类，按工程师工作场景划分
const sections = [
  { key: 'backend', icon: '⌬', label: '后端开发', link: '/backend' },
  { key: 'frontend', icon: '⌘', label: '前端开发', link: '/frontend' },
  { key: 'data', icon: '▥', label: '数据 & 中间件', link: '/data' },
  { key: 'devops', icon: '◉', label: 'DevOps & 云原生', link: '/devops' },
  { key: 'ai', icon: '✦', label: 'AI & 大模型', link: '/ai' },
  { key: 'architecture', icon: '⬡', label: '架构 & 性能', link: '/architecture' },
  { key: 'practice', icon: '⚙', label: '工程实践', link: '/practice' },
  { key: 'reading', icon: '☰', label: '读书笔记', link: '/reading' },
  { key: 'career', icon: '◐', label: '个人成长', link: '/career' },
]

const activeKey = computed(() => {
  const section = sections.find((s) => route.path.startsWith(`/${s.key}`))
  return section?.key ?? (route.path === '/' ? 'home' : '')
})
</script>

<template>
  <nav class="knowledge-rail" aria-label="知识分类">
    <a class="rail-home" :href="base + '/'" :class="{ active: activeKey === 'home' }" aria-label="首页">X</a>
    <a
      v-for="section in sections"
      :key="section.key"
      class="rail-item"
      :class="{ active: activeKey === section.key }"
      :href="joinPath(base, section.link)"
      :title="section.label"
    >
      <span class="rail-icon">{{ section.icon }}</span>
      <span class="rail-label">{{ section.label }}</span>
    </a>
  </nav>
</template>
