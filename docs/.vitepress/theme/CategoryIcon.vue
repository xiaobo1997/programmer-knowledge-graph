<script setup lang="ts">
// 9 大类 SVG 图标：shields.io badge 风格
// 所有图标统一 18x18 viewBox，stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"

const ICONS: Record<string, string> = {
  backend: `
    <!-- Java 风格咖啡杯 -->
    <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
    <path d="M3 12h14" stroke-width="1" opacity="0.5" />
    <path d="M3 16h14" stroke-width="1" opacity="0.5" />
  `,
  frontend: `
    <!-- 浏览器 + </> -->
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="5" cy="7" r="0.5" fill="white" />
    <circle cx="8" cy="7" r="0.5" fill="white" />
    <path d="M9 14l-2 2 2 2" stroke-width="1.6" />
    <path d="M15 14l2 2-2 2" stroke-width="1.6" />
  `,
  data: `
    <!-- 圆柱 + 立方体 -->
    <ellipse cx="6" cy="5" rx="4" ry="2" />
    <path d="M2 5v10c0 1.1 1.8 2 4 2s4-.9 4-2V5" />
    <path d="M2 10c0 1.1 1.8 2 4 2s4-.9 4-2" />
    <path d="M14 8h8v8h-8z" stroke-linejoin="round" />
    <path d="M14 11h8" opacity="0.5" />
  `,
  devops: `
    <!-- Docker 鲸鱼 -->
    <path d="M2 14c0-2 2-3 4-3h12a4 4 0 0 1 4 4c0 2-2 3-4 3H6c-2 0-4-1-4-4z" />
    <circle cx="9" cy="11" r="0.8" fill="white" stroke="none" />
    <circle cx="12" cy="11" r="0.8" fill="white" stroke="none" />
    <circle cx="15" cy="11" r="0.8" fill="white" stroke="none" />
    <path d="M19 11l3-2M19 13l3 0M19 15l3 2" />
  `,
  ai: `
    <!-- 神经网络 -->
    <circle cx="12" cy="4" r="2" fill="white" />
    <circle cx="5" cy="13" r="2" fill="white" />
    <circle cx="12" cy="13" r="2" fill="white" />
    <circle cx="19" cy="13" r="2" fill="white" />
    <circle cx="12" cy="20" r="2" fill="white" />
    <line x1="12" y1="6" x2="6" y2="11" />
    <line x1="12" y1="6" x2="12" y2="11" />
    <line x1="12" y1="6" x2="18" y2="11" />
    <line x1="6" y1="15" x2="12" y2="18" />
    <line x1="12" y1="15" x2="12" y2="18" />
    <line x1="18" y1="15" x2="12" y2="18" />
  `,
  architecture: `
    <!-- 六边形蜂巢 -->
    <polygon points="12,3 19,7 19,15 12,19 5,15 5,7" />
    <polygon points="5,15 12,19 12,23 5,19 5,15" stroke-width="1" opacity="0.5" />
    <polygon points="19,15 12,19 12,23 19,19 19,15" stroke-width="1" opacity="0.5" />
  `,
  practice: `
    <!-- 工具箱 -->
    <rect x="3" y="9" width="18" height="11" rx="2" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    <path d="M7 13l-2 2 1.5 1.5 2-2" />
    <line x1="14" y1="12" x2="18" y2="16" />
    <line x1="13" y1="13" x2="17" y2="17" />
  `,
  reading: `
    <!-- 翻开的书 -->
    <path d="M12 6v13" />
    <path d="M2 7c0-1 1-2 3-2s4 1 7 2c3-1 5-2 7-2s3 1 3 2v11c0 1-1 2-3 2s-4-1-7-2c-3 1-5 2-7 2s-3-1-3-2V7z" />
  `,
  career: `
    <!-- 阶梯 + 树 -->
    <path d="M3 21h4v-3H3zm5 0h4v-6H8zm5 0h4v-9h-4zm5 0h4v-12h-4z" />
    <circle cx="20" cy="5" r="2" fill="white" stroke="none" />
    <line x1="20" y1="7" x2="20" y2="9" />
  `,
}

defineProps<{
  key_: string
  size?: number
}>()
</script>

<template>
  <svg
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    class="rail-svg"
    v-html="ICONS[key_] || ''"
  />
</template>

<style scoped>
.rail-svg {
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>