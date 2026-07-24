<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useData } from 'vitepress'
import CategoryIcon from './CategoryIcon.vue'

const route = useRoute()
const { site } = useData()

// 拼接 base 路径，去重双斜杠
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
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// === 折叠状态：默认展开，记住在 localStorage ===
const COLLAPSE_KEY = 'pkg-rail-collapsed'
const collapsed = ref(false)

// 只在客户端加载时读 localStorage（SSR 跳过）
if (typeof window !== 'undefined') {
  try {
    collapsed.value = localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    // localStorage 不可用时保持默认
  }
}

watch(collapsed, (v) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COLLAPSE_KEY, v ? '1' : '0')
    } catch {}
  }
})

function toggleCollapse() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <nav class="knowledge-rail" :class="{ 'knowledge-rail--collapsed': collapsed }" aria-label="知识分类">
    <!-- 折叠/展开按钮：右上角 -->
    <button
      type="button"
      class="rail-collapse-toggle"
      :title="collapsed ? '展开分类列表' : '折叠分类列表'"
      :aria-label="collapsed ? '展开分类列表' : '折叠分类列表'"
      @click="toggleCollapse"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          v-if="collapsed"
          d="M4 6l4 4 4-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-else
          d="M4 10l4-4 4 4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- 首页固定显示，不折叠 -->
    <a
      class="rail-home"
      :href="base"
      :class="{ active: activeKey === 'home' }"
      aria-label="首页"
      :title="collapsed ? '首页' : ''"
    >
      <span class="rail-icon-box rail-icon-box--home">
        <CategoryIcon key_="practice" :size="22" />
      </span>
      <span class="rail-label">首页</span>
    </a>

    <!-- 9 大类：折叠时只显示图标方框，展开时显示完整 -->
    <a
      v-for="section in sections"
      :key="section.key"
      class="rail-item"
      :class="{ active: activeKey === section.key }"
      :href="joinPath(base, section.link)"
      :title="collapsed ? section.label : section.label"
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
  padding: 30px 8px 12px 8px;  /* 顶部留出折叠按钮空间 */
  position: relative;
}

/* 折叠/展开按钮：右上角小箭头 */
.rail-collapse-toggle {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.15s ease, color 0.15s ease;
  padding: 0;
}
.rail-collapse-toggle:hover {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* 折叠状态：只显示方框图标 */
.knowledge-rail--collapsed .rail-label {
  display: none;
}
.knowledge-rail--collapsed .rail-home,
.knowledge-rail--collapsed .rail-item {
  justify-content: center;
  padding: 8px 6px;
}
.knowledge-rail--collapsed .rail-icon-box {
  width: 36px;
  height: 36px;
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
  transition: width 0.2s ease, height 0.2s ease;
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
  transition: opacity 0.18s ease;
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