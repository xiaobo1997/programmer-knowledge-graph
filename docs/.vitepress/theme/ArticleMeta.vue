<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const wordCount = computed(() => {
  const v = (frontmatter.value as { wordCount?: number }).wordCount
  return typeof v === 'number' ? v : null
})

const readMinutes = computed(() => {
  const v = (frontmatter.value as { readMinutes?: number }).readMinutes
  return typeof v === 'number' ? v : null
})

const updatedAt = computed(() => {
  return (page.value as { updated?: number }).updated ?? null
})

const tags = computed<string[]>(() => {
  const fm = frontmatter.value as { tags?: string[]; level?: string }
  const out: string[] = []
  if (Array.isArray(fm.tags)) out.push(...fm.tags.map(String))
  if (fm.level) out.push(String(fm.level))
  return out
})

const minutesText = computed(() => (readMinutes.value ? `${Math.max(1, Math.round(readMinutes.value))} 分钟` : '—'))
const wordsText = computed(() => (wordCount.value ? `${wordCount.value.toLocaleString()} 字` : '—'))
const updatedText = computed(() => {
  if (!updatedAt.value) return ''
  const d = new Date(updatedAt.value)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
</script>

<template>
  <div class="article-meta">
    <span class="meta-item">⏱ 预计阅读 {{ minutesText }}</span>
    <span class="meta-sep" />
    <span class="meta-item">✎ {{ wordsText }}</span>
    <span v-if="updatedAt" class="meta-sep" />
    <span v-if="updatedAt" class="meta-item">📅 {{ updatedText }}</span>
    <template v-for="t in tags" :key="t">
      <span class="meta-sep" />
      <span class="meta-tag">{{ t }}</span>
    </template>
  </div>
</template>

<style scoped>
.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  margin: 18px 0 26px;
  padding: 12px 18px;
  border: 1px solid #e3e9e5;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8faf8 0%, #ffffff 100%);
  font-size: 12.5px;
  color: #5e6c64;
  line-height: 1.6;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  letter-spacing: 0.01em;
}
.meta-sep {
  width: 1px;
  height: 12px;
  background: #d6dfda;
  display: inline-block;
}
.meta-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 999px;
  background: #e6f8ef;
  color: #0b7d53;
  font-size: 11.5px;
  font-weight: 600;
}
@media (max-width: 640px) {
  .article-meta { font-size: 11.5px; gap: 3px 10px; padding: 10px 14px; }
  .meta-sep { display: none; }
}
</style>
