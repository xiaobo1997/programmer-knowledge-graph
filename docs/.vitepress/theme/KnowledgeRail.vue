<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'
import CategoryIcon from './CategoryIcon.vue'

const route = useRoute()
const { site } = useData()

// 用 VitePress 的 withBase 处理 base 路径（GitHub Pages 部署需要）
// 拼接时去重双斜杠：base 末尾 + file 开头
function joinPath(base: string, file: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const f = file.startsWith('/') ? file : '/' + file
  return b + f
}
const base = computed(() => joinPath(site.value.base || '/', ''))

// 9 大类：每类一个独特颜色 + 方框底色 + SVG 图标
const sections = [
  { key: 'backend', label: '后端开发', color: '#f97316', accent: '#ea580c', link: '/backend' },
  { key: 'frontend', label: '前端开发', color: '#06b6d4', accent: '#0891b2', link: '/frontend' },
  { key: 'data', label: '数据 & 中间件', color: '#eab308', accent: '#ca8a04', link: '/data' },
  { key: 'devops', label: 'DevOps & 云原生', color: '#0ea5e9', accent: '#0284c7', link: '/devops' },
  { key: 'ai', label: 'AI & 大模型', color: '#a855f7', accent: '#9333ea', link: '/ai' },
  { key: 'architecture', label: '架构 & 性能', color: '#14b8a6', accent: '#0d9488', link: '/architecture' },
  { key: 'practice', label: '工程实践', color: '#64748b', accent: '#475569', link: '/practice' },
  { key: 'reading', label: '读书笔记', color: '#f59e0b', accent: '#d97706', link: '/reading' },
  { key: 'career', label: '个人成长', color: '#ec4899', accent: '#db2777', link: '/career' },
]

const activeKey = computed(() => {
  const section = sections.find((s) => route.path.startsWith(`/${s.key}`))
  return section?.key ?? (route.path === '/' ? 'home' : '')
})

function colorWithAlpha(hex: string, alpha: number) {
  // #rrggbb → rgba(r, g, b, alpha)
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<template>
  <nav class="knowledge-rail" aria-label="知识分类">
    <a
      class="rail-home"
      :href="base + '/'"
      :class="{ active: activeKey === 'home' }"
      aria-label="首页"
    >
      <span class="rail-icon-box rail-icon-box--home">
        <CategoryIcon key_="practice" :size="22" />
      </span>
      <span class="rail-label">首页</span>
    </a>

    <a
      v-for="section in sections"
      :key="section.key"
      class="rail-item"
      :class="{ active: activeKey === section.key }"
      :href="joinPath(base, section.link)"
      :title="section.label"
      :style="{
        '--rail-color': section.color,
        '--rail-color-soft': colorWithAlpha(section.color, 0.12),
        '--rail-color-strong': section.accent,
      }"
    >
      <span class="rail-icon-box">
        <CategoryIcon :key_="section.key" :size="22" />
      </span>
      <span class="rail-label">{{ section.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.knowledge-rail {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 8px;
}

.rail-home,
.rail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
  position: relative;
  font-size: 14px;
}

.rail-home:hover,
.rail-item:hover {
  background-color: var(--rail-color-soft, var(--vp-c-bg-soft));
  color: var(--rail-color, var(--vp-c-text-1));
  transform: translateX(2px);
}

.rail-home.active,
.rail-item.active {
  background-color: var(--rail-color-soft, var(--vp-c-bg-soft));
  color: var(--rail-color, var(--vp-c-text-1));
  font-weight: 600;
}

.rail-home.active::before,
.rail-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background-color: var(--rail-color, var(--vp-c-brand-1));
  border-radius: 2px;
}

/* 方框图标：彩色背景 + 白色 SVG */
.rail-icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--rail-color, var(--vp-c-brand-1));
  flex-shrink: 0;
  color: white;
}

.rail-icon-box--home {
  background-color: var(--vp-c-text-2);
}

.rail-icon-box :deep(svg) {
  stroke: white !important;
}

.rail-label {
  flex: 1;
  font-weight: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .rail-label {
    display: none;
  }
  .rail-icon-box {
    width: 36px;
    height: 36px;
  }
  .knowledge-rail {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>