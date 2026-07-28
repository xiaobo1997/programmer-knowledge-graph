<script setup lang="ts">
// Mermaid 流程图组件
// 在 Markdown 里用 ```mermaid 代码块，自动通过 markdown.containers 转成 <MermaidBlock> 标签
import { ref, onMounted, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{
  // mermaid 图表源码（由 markdown.containers 传入）
  code?: string
  // 默认 flow 主题，跟随深色模式
  theme?: string
}>()

const container = ref<HTMLElement | null>(null)
const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`

// 初始化 mermaid（跟随 VitePress 主题）
function detectTheme() {
  if (typeof document === 'undefined') return 'default'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'default'
}

async function render() {
  if (!container.value || !props.code) return
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: detectTheme(),
      securityLevel: 'loose',
      fontFamily: 'inherit',
    })
    const { svg } = await mermaid.render(id, props.code.trim())
    container.value.innerHTML = svg
  } catch (err) {
    container.value.innerHTML = `<pre style="color: #f56c6c; background: rgba(245,108,108,0.1); padding: 12px; border-radius: 6px;">${err instanceof Error ? err.message : String(err)}</pre>`
  }
}

onMounted(() => {
  render()
  // 跟随主题切换重新渲染
  const observer = new MutationObserver(render)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  // 清理 observer 在 unmount 时
  return () => observer.disconnect()
})

watch(() => props.code, render)
</script>

<template>
  <div ref="container" class="mermaid-container" />
</template>

<style scoped>
.mermaid-container {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  overflow-x: auto;
}
.mermaid-container :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>