<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

interface Article {
  file: string
  title: string
  wordCount: number
  readMinutes: number
  excerpt: string
  tags?: string[]
}

interface Section {
  key: string
  icon: string
  label: string
  description: string
  articles: Article[]
}

const props = defineProps<{
  sections: Section[]
}>()

const route = useRoute()
const { frontmatter, site } = useData()

// 用 VitePress 的 withBase 处理 base 路径（GitHub Pages 部署需要）
// 拼接时去重双斜杠：base 末尾 + file 开头
function joinPath(base: string, file: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const f = file.startsWith('/') ? file : '/' + file
  return b + f
}
const base = computed(() => joinPath(site.value.base || '/', ''))

// 当前文章的标签 + 所在分类
const currentTags = computed<string[]>(() => {
  return (frontmatter.value.tags as string[] | undefined) || []
})

const currentPath = computed(() => route.path)
const currentFile = computed(() => currentPath.value.replace(/^\//, ''))

// 找出当前文章所在 section
const currentSection = computed<Section | undefined>(() => {
  for (const s of props.sections) {
    for (const a of s.articles) {
      if (a.file === '/' + currentFile.value) return s
    }
  }
  return undefined
})

// 找相关文章：先按标签评分（每命中一个 +2），再按同分类（+1），最多 5 篇
const relatedArticles = computed<Array<{ article: Article; section: Section; score: number }>>(() => {
  const scored: Array<{ article: Article; section: Section; score: number }> = []
  const currentTagsLower = currentTags.value.map((t) => t.toLowerCase())
  const currentSectionKey = currentSection.value?.key

  for (const s of props.sections) {
    for (const a of s.articles) {
      // 跳过当前文章
      if (a.file === '/' + currentFile.value) continue

      let score = 0
      const aTags = (a.tags || []).map((t) => t.toLowerCase())
      // 标签命中得分
      for (const t of currentTagsLower) {
        if (aTags.includes(t)) score += 2
      }
      // 同分类得分
      if (currentSectionKey && s.key === currentSectionKey) score += 1

      if (score > 0) scored.push({ article: a, section: s, score })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 5)
})

const hasRelated = computed(() => relatedArticles.value.length > 0)
</script>

<template>
  <section v-if="hasRelated" class="related-readings">
    <h2 class="related-title">
      <span class="related-icon">↪</span>
      相关阅读
    </h2>
    <ul class="related-list">
      <li
        v-for="r in relatedArticles"
        :key="r.article.file"
        class="related-item"
        :data-section="r.section.key"
      >
        <a :href="joinPath(base, r.article.file)" class="related-link">
          <span class="related-section-icon">{{ r.section.icon }}</span>
          <span class="related-item-content">
            <span class="related-item-title">{{ r.article.title }}</span>
            <span class="related-item-meta">
              <span class="related-item-section">{{ r.section.label }}</span>
              <span class="related-item-time">{{ r.article.readMinutes }} 分钟 · {{ r.article.wordCount }} 字</span>
            </span>
          </span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.related-readings {
  margin-top: 56px;
  padding: 28px 24px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.related-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.related-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 16px;
  font-weight: 700;
}

.related-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.related-item {
  margin: 0;
}

.related-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--vp-c-bg);
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.related-link:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(3px);
  box-shadow: 0 6px 18px rgba(23, 59, 44, 0.08);
}

.related-section-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  font-size: 17px;
}

.related-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.related-item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.related-item-section {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.related-item-time {
  color: var(--vp-c-text-3);
}
</style>