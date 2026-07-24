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

// 首页 + 9 大类合成一个列表（视觉统一：都是图标方块 + 文字标签）
const allItems = computed(() => [
  {
    key: 'home',
    label: '首页',
    iconKey: 'practice',
    color: '#64748b',
    accent: '#475569',
    link: '',
  },
  ...sections,
])

const activeKey = computed(() => {
  const item = allItems.value.find(
    (s) => route.path.startsWith(`/${s.key}`) || (s.key === 'home' && (route.path === '/' || route.path === '')),
  )
  return item?.key ?? ''
})

function colorWithAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// === 折叠状态：默认展开，点击 banner logo 触发全部折叠/展开 ===
const COLLAPSE_KEY = 'pkg-rail-collapsed'
const collapsed = ref(false)  // 默认展开

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(COLLAPSE_KEY)
    if (saved !== null) collapsed.value = saved === '1'
  } catch {}
}

watch(collapsed, (v) => {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(COLLAPSE_KEY, v ? '1' : '0') } catch {}
  }
})

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

watch(collapsed, (v) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COLLAPSE_KEY, v ? '1' : '0')
    } catch {}
  }
})
</script>

<template>
  <nav class="knowledge-rail" :class="{ 'knowledge-rail--collapsed': collapsed }" aria-label="知识分类">
    <!-- 一个连续列表：首页 + 9 大类，视觉统一 -->
    <a
      v-for="item in allItems"
      :key="item.key"
      class="rail-item"
      :class="{ active: activeKey === item.key, home: item.key === 'home' }"
      :href="item.key === 'home' ? base : joinPath(base, item.link)"
      :title="item.label"
      :style="{
        '--rail-color': item.color,
        '--rail-color-soft': colorWithAlpha(item.color, 0.12),
        '--rail-color-strong': item.accent,
      }"
    >
      <span class="rail-icon-box">
        <CategoryIcon :key_="item.iconKey" :size="22" />
      </span>
      <span class="rail-label">{{ item.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.knowledge-rail {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 8px;
  position: relative;
}

/* 折叠/展开按钮：右上角小箭头 */


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

.rail-item:hover {
  background-color: var(--rail-color-soft, var(--vp-c-bg-soft));
  color: var(--rail-color, var(--vp-c-text-1));
  transform: translateX(2px);
}

.rail-item.active {
  background-color: var(--rail-color-soft, var(--vp-c-bg-soft));
  color: var(--rail-color, var(--vp-c-text-1));
  font-weight: 600;
}

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

.rail-item.home .rail-icon-box {
  background-color: var(--rail-color);
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