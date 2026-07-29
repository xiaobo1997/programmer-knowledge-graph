<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

// 9 大类：shields.io badge 配色风格
// 9 大类：shields.io badge 配色风格
const sections = [
  { key: 'backend',      label: 'backend',   name: '后端开发',     color: '#f97316', text: '#fff' },
  { key: 'frontend',     label: 'frontend',  name: '前端开发',     color: '#06b6d4', text: '#fff' },
  { key: 'data',         label: 'data',      name: '数据 & 中间件', color: '#eab308', text: '#fff' },
  { key: 'devops',       label: 'devops',    name: 'DevOps',     color: '#0ea5e9', text: '#fff' },
  { key: 'ai',           label: 'ai',        name: 'AI & 大模型', color: '#a855f7', text: '#fff' },
  { key: 'architecture', label: 'arch',      name: '架构 & 性能', color: '#14b8a6', text: '#fff' },
  { key: 'practice',     label: 'practice',  name: '工程实践',     color: '#64748b', text: '#fff' },
  { key: 'reading',      label: 'reading',   name: '读书笔记',     color: '#f59e0b', text: '#fff' },
  { key: 'career',       label: 'career',    name: '个人成长',     color: '#ec4899', text: '#fff' },
  { key: 'biz',          label: 'biz',       name: '业务知识',     color: '#10b981', text: '#fff' },
]

const activeKey = computed(() => {
  const section = sections.find((s) => route.path.startsWith(`/${s.key}`))
  return section?.key ?? (route.path === '/' ? 'home' : '')
})

// 默认折叠：1 个合并按钮，点开成 9 个分类 badge
const COLLAPSE_KEY = 'pkg-rail-expanded-sections'
const expanded = ref(false)

if (typeof window !== 'undefined') {
  try {
    expanded.value = localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {}
}

watch(expanded, (v) => {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(COLLAPSE_KEY, v ? '1' : '0') } catch {}
  }
})

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <nav class="knowledge-rail" :class="{ 'knowledge-rail--expanded': expanded }" aria-label="知识分类">
    <!-- 首页：shields 风格 badge -->
    <a
      class="rail-badge rail-badge--home"
      :href="base"
      :class="{ active: activeKey === 'home' }"
      aria-label="首页"
    >
      <span class="rail-badge__left">
        <CategoryIcon key_="practice" :size="14" />
        <span>HOME</span>
      </span>
      <span class="rail-badge__right">首页</span>
    </a>

    <!-- 折叠状态：1 个合并按钮 -->
    <button
      v-if="!expanded"
      type="button"
      class="rail-badge rail-badge--toggle"
      aria-label="展开 9 大分类"
      @click="toggle"
    >
      <span class="rail-badge__left">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span>CATEGORIES</span>
      </span>
      <span class="rail-badge__right">
        9 大分类
        <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true" style="margin-left: 4px;">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>

    <!-- 展开状态：9 个分类 badge + 收起按钮 -->
    <template v-else>
      <button
        type="button"
        class="rail-badge rail-badge--toggle rail-badge--collapse"
        aria-label="折叠分类列表"
        @click="toggle"
      >
        <span class="rail-badge__left">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4l8 8M12 4l-8 8" transform="translate(4 8)" />
          </svg>
          <span>COLLAPSE</span>
        </span>
        <span class="rail-badge__right">
          收起
          <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true" style="margin-left: 4px;">
            <path d="M4 10l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>

      <a
        v-for="section in sections"
        :key="section.key"
        class="rail-badge"
        :class="{ active: activeKey === section.key }"
        :href="joinPath(base, `/${section.key}`)"
        :title="section.name"
        :style="{
          '--badge-color': section.color,
          '--badge-text': section.text,
        }"
      >
        <span class="rail-badge__left">
          <CategoryIcon :key_="section.key" :size="14" />
          <span>{{ section.label }}</span>
        </span>
        <span class="rail-badge__right">{{ section.name }}</span>
      </a>
    </template>
  </nav>
</template>

<style scoped>
.knowledge-rail {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 8px;
}

/* === shields.io 风格 badge === */
.rail-badge {
  display: flex;
  align-items: stretch;
  text-decoration: none;
  border-radius: 6px;
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  height: 22px;
  width: 100%;
}

.rail-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.rail-badge.active {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

/* 左半：深色 label */
.rail-badge__left {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: #2d3748;  /* 默认深色 */
  color: #ffffff;
  padding: 0 6px;
  white-space: nowrap;
  font-size: 10px;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}

/* 右半：彩色 value */
.rail-badge__right {
  display: flex;
  align-items: center;
  background-color: var(--badge-color, var(--vp-c-brand-1));
  color: var(--badge-text, #fff);
  padding: 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  font-size: 11px;
}

/* 让每个分类 badge 的左半染色 */
.rail-badge:not(.rail-badge--home):not(.rail-badge--toggle) .rail-badge__left {
  background-color: color-mix(in srgb, var(--badge-color) 80%, #000);
}

.rail-badge__left :deep(svg) {
  stroke: white !important;
  stroke-width: 2;
}

/* 首页 badge：灰色调 */
.rail-badge--home .rail-badge__left {
  background-color: #4a5568;
}
.rail-badge--home .rail-badge__right {
  background-color: #718096;
}

/* 合并按钮 */
.rail-badge--toggle .rail-badge__left {
  background-color: #4a5568;
}
.rail-badge--toggle .rail-badge__right {
  background-color: #2d3748;
}
.rail-badge--collapse .rail-badge__left {
  background-color: #718096;
}

@media (max-width: 768px) {
  .rail-badge {
    height: auto;
    flex-direction: column;
  }
  .rail-badge__left,
  .rail-badge__right {
    padding: 4px 8px;
    width: 100%;
    justify-content: flex-start;
  }
}
</style>