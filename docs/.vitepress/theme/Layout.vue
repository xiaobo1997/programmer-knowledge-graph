<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import { nextTick, onMounted, onUnmounted, watch } from 'vue'
import ArticleMeta from './ArticleMeta.vue'
import KnowledgeRail from './KnowledgeRail.vue'
import ReadingEnhancements from './ReadingEnhancements.vue'

const route = useRoute()
let zoom: ReturnType<typeof mediumZoom> | undefined

function setupImageZoom() {
  zoom?.detach()
  zoom = mediumZoom('.vp-doc img:not(.no-zoom)', {
    background: 'var(--vp-c-bg)',
    margin: 28,
  })
}

onMounted(() => nextTick(setupImageZoom))
watch(() => route.path, () => nextTick(setupImageZoom))
onUnmounted(() => zoom?.detach())
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <ReadingEnhancements />
    </template>
    <template #sidebar-nav-before>
      <KnowledgeRail />
    </template>
    <template #doc-before>
      <div class="article-kicker">KNOWLEDGE GRAPH</div>
      <ArticleMeta />
    </template>
    <template #aside-outline-after>
      <div class="reading-tools">
        <a href="#top">↑ 返回顶部</a>
        <span>⌘ K 搜索知识图谱</span>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
