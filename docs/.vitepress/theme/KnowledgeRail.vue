<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useData } from 'vitepress'
import CategoryIcon from './CategoryIcon.vue'

const route = useRoute()
const { site } = useData()

function joinPath(base: string, file: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const f = file.startsWith('/') ? file : '/' + file
  return b + f
}
const base = computed(() => joinPath(site.value.base || '/', ''))

// 9 大类：颜色 + 图标 + 链接
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
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 默认折叠（1 个合并按钮），点击展开成 9 个方块
// 状态用 localStorage 记住
const COLLAPSE_KEY = 'pkg-rail-expanded-sections'
const expanded = ref(false)

if (typeof window !== 'undefined') {
  try {
    expanded.value = localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {}
}

import { watch } from 'vue'
watch(expanded, (v) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COLLAPSE_KEY, v ? '1' : '0')
    } catch {}
  }
})

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <nav class="knowledge-rail" :class="{ 'knowledge-rail--expanded': expanded }" aria-label="知识分类">
    <!-- 首页按钮（固定） -->
    <a
      class="rail-home"
      :href="base"
      :class="{ active: activeKey === 'home' }"
      aria-label="首页"
    >
      <span class="rail-icon-box rail-icon-box--home">
        <CategoryIcon key_="practice" :size="20" />
      </span>
      <span class="rail-label">首页</span>
    </a>

    <!-- 折叠状态：1 个大按钮，点击展开 -->
    <button
      v-if="!expanded"
      type="button"
      class="rail-toggle-btn"
      aria-label="展开 9 大分类"
      @click="toggle"
    >
      <span class="rail-icon-box">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </span>
      <span class="rail-label">9 大分类</span>
      <span class="rail-chevron">
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>

    <!-- 展开状态：9 个分类方块 + 折叠按钮 -->
    <template v-else>
      <button
        type="button"
        class="rail-collapse-btn"
        aria-label="折叠分类列表"
        @click="toggle"
      >
        <span class="rail-icon-box rail-icon-box--collapse">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </span>
        <span class="rail-label">收起分类</span>
      </button>
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
          <CategoryIcon :key_="section.key" :size="20" />
        </span>
        <span class="rail-label">{{ section.label }}</span>
      </a>
    </template>
  </nav>
</template>

<style scoped>
.knowledge-rail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 8px;
}

.rail-home,
.rail-toggle-btn,
.rail-collapse-btn,
.rail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
  font: inherit;
  font-size: 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.rail-home:hover,
.rail-toggle-btn:hover,
.rail-collapse-btn:hover,
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

.rail-icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background-color: var(--rail-color, var(--vp-c-brand-1));
  flex-shrink: 0;
  color: white;
}
.rail-icon-box--home {
  background-color: #64748b;
}
.rail-icon-box--collapse {
  background-color: #94a3b8;
}
.rail-icon-box :deep(svg) {
  stroke: white !important;
}

.rail-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rail-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
}

/* 折叠按钮特殊样式：稍大 */
.rail-toggle-btn {
  font-weight: 500;
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