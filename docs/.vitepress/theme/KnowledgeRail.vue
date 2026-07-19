<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const sections = [
  { key: 'reading-notes', icon: '▤', label: '读书笔记', link: '/reading-notes' },
  { key: 'fullstack', icon: '⌘', label: '全栈学习', link: '/fullstack' },
  { key: 'devops', icon: '◈', label: 'DevOps', link: '/devops' },
  { key: 'agent', icon: '✦', label: 'Agent / AI', link: '/agent' },
  { key: 'career', icon: '◉', label: '个人成长', link: '/career' },
  { key: 'roadmap', icon: '⬡', label: '技术地图', link: '/roadmap' },
]

const activeKey = computed(() => {
  const section = sections.find((s) => route.path.startsWith(`/${s.key}`))
  return section?.key ?? (route.path === '/' ? 'home' : '')
})
</script>

<template>
  <nav class="knowledge-rail" aria-label="知识分类">
    <a class="rail-home" href="/" :class="{ active: activeKey === 'home' }" aria-label="首页">X</a>
    <a
      v-for="section in sections"
      :key="section.key"
      class="rail-item"
      :class="{ active: activeKey === section.key }"
      :href="section.link"
      :title="section.label"
    >
      <span class="rail-icon">{{ section.icon }}</span>
      <span class="rail-label">{{ section.label }}</span>
    </a>
  </nav>
</template>
