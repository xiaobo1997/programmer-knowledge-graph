<script setup lang="ts">
// Mermaid 流程图组件
// - Markdown 里 ```mermaid 代码块通过 fence 规则转成 <MermaidBlock>
// - 点击 SVG 可以全屏放大查看（暗黑模式自动跟随）
import { ref, onMounted, onUnmounted, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{
  code?: string
}>()

const container = ref<HTMLElement | null>(null)
const svgContent = ref('')  // 响应式 SVG 内容，供全屏 overlay 使用
const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`

// 全屏放大状态
const isZoomed = ref(false)
const overlayRef = ref<HTMLElement | null>(null)

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
    // 全屏 overlay 用的 SVG：去掉内联 max-width 和 width="100%"，避免 flex 容器里塌缩
    svgContent.value = svg
      .replace(/max-width:\s*[^;"]+;?/gi, '')
      .replace(/\bwidth="100%"/gi, '')
  } catch (err) {
    container.value.innerHTML = `<pre style="color: #f56c6c; background: rgba(245,108,108,0.1); padding: 12px; border-radius: 6px;">${err instanceof Error ? err.message : String(err)}</pre>`
    svgContent.value = ''
  }
}

// 点击放大
function zoomIn() {
  isZoomed.value = true
}

function zoomOut() {
  isZoomed.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') zoomOut()
}

onMounted(() => {
  render()
  const observer = new MutationObserver(render)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
})

onUnmounted(() => {
  isZoomed.value = false
})

watch(() => props.code, render)
</script>

<template>
  <div
    ref="container"
    class="mermaid-container"
    :class="{ 'mermaid-clickable': !isZoomed }"
    @click="zoomIn"
  />
  <!-- 全屏遮罩 -->
  <Teleport to="body">
    <div
      v-if="isZoomed"
      ref="overlayRef"
      class="mermaid-overlay"
      @click.self="zoomOut"
      @keydown="onKeydown"
    >
      <button class="mermaid-close" @click="zoomOut" title="关闭 (Esc)">✕</button>
      <div class="mermaid-overlay-inner" v-html="svgContent" />
    </div>
  </Teleport>
</template>

<style scoped>
.mermaid-container {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  overflow-x: auto;
  cursor: zoom-in;
}
.mermaid-container :deep(svg) {
  max-width: 100%;
  height: auto;
}

/* 全屏遮罩 */
.mermaid-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.mermaid-overlay-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95vw;
  height: 95vh;
}
.mermaid-overlay-inner :deep(svg) {
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
}
html.dark .mermaid-overlay-inner :deep(svg) {
  background: #1a1a2e;
}

.mermaid-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.mermaid-close:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>