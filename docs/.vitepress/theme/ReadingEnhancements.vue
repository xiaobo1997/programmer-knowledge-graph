<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

// ============= 1. 阅读进度条 =============
let progressBar: HTMLDivElement | null = null

function setupProgressBar() {
  // 移除旧的
  progressBar?.remove()
  progressBar = document.createElement('div')
  progressBar.className = 'reading-progress-bar'
  progressBar.innerHTML = '<div class="reading-progress-fill"></div>'
  document.body.appendChild(progressBar)
  updateProgress()
}

function updateProgress() {
  if (!progressBar) return
  const doc = document.documentElement
  const scrollTop = doc.scrollTop || document.body.scrollTop
  const scrollHeight = doc.scrollHeight - doc.clientHeight
  const ratio = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  const fill = progressBar.querySelector('.reading-progress-fill') as HTMLDivElement | null
  if (fill) fill.style.width = `${Math.min(100, Math.max(0, ratio))}%`
}

let rafId: number | null = null
function onScroll() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    updateProgress()
    rafId = null
  })
}

// ============= 2. TOC 自动滚动跟随 + 当前章节高亮 =============
let tocCleanup: (() => void) | null = null

function setupTocSpy() {
  const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.VPDocOutlineItem a.outline-link'))
  if (tocLinks.length === 0) return

  // 把所有 heading 找出来，跟 tocLinks 一一对应（VitePress toc link 顺序 = heading 顺序）
  const headings = Array.from(
    document.querySelectorAll<HTMLHeadingElement>('.vp-doc h2, .vp-doc h3'),
  )
  // 只看 outline 里有的 h2/h3
  const headingMap = new Map<string, HTMLHeadingElement>()
  for (const h of headings) {
    const id = h.id
    if (id) headingMap.set(id, h)
  }

  function setActive(activeId: string | null) {
    for (const link of tocLinks) {
      const href = link.getAttribute('href') || ''
      const id = decodeURIComponent(href.replace(/^#/, ''))
      const item = link.parentElement
      if (activeId && id === activeId) {
        item?.classList.add('is-active-section')
      } else {
        item?.classList.remove('is-active-section')
      }
    }
  }

  function findActiveHeading() {
    const triggerLine = window.innerHeight * 0.18 // 视窗上 18% 位置
    let active: HTMLHeadingElement | null = null
    for (const h of headings) {
      const rect = h.getBoundingClientRect()
      if (rect.top <= triggerLine) active = h
      else break
    }
    return active
  }

  function onTocScroll() {
    const a = findActiveHeading()
    setActive(a ? a.id : null)
  }

  function scrollTocToActive() {
    const activeLink = document.querySelector<HTMLAnchorElement>('.VPDocOutlineItem.is-active-section a.outline-link')
    if (!activeLink) return
    const tocContainer = activeLink.closest('.VPDocOutline') as HTMLElement | null
    if (!tocContainer) return
    const linkRect = activeLink.getBoundingClientRect()
    const tocRect = tocContainer.getBoundingClientRect()
    if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
      const offset = activeLink.offsetTop - tocContainer.offsetTop - tocContainer.clientHeight / 3
      tocContainer.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' })
    }
  }

  let raf: number | null = null
  function handler() {
    if (raf !== null) return
    raf = requestAnimationFrame(() => {
      onTocScroll()
      scrollTocToActive()
      raf = null
    })
  }

  window.addEventListener('scroll', handler, { passive: true })
  // 初始执行一次
  setTimeout(() => {
    onTocScroll()
    scrollTocToActive()
  }, 100)

  return () => {
    window.removeEventListener('scroll', handler)
    for (const link of tocLinks) {
      link.parentElement?.classList.remove('is-active-section')
    }
  }
}

// ============= 3. 复制代码按钮 toast =============
let copyCleanup: (() => void) | null = null

function setupCopyToast() {
  function showToast(message: string) {
    const old = document.querySelector('.copy-toast')
    old?.remove()
    const toast = document.createElement('div')
    toast.className = 'copy-toast'
    toast.textContent = message
    document.body.appendChild(toast)
    requestAnimationFrame(() => toast.classList.add('show'))
    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => toast.remove(), 250)
    }, 1800)
  }

  function onClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null
    if (!target) return
    const btn = target.closest('.vp-doc button') as HTMLButtonElement | null
    if (!btn) return
    const text = btn.textContent?.trim() || ''
    if (text === 'Copy' || text === 'Copied' || text === '复制' || text === '已复制' || text === 'Copy Code' || /^[A-Za-z]*Copy[A-Za-z\s]*$/i.test(text)) {
      // VitePress 自带的 copy 按钮
      const codeEl = btn.parentElement?.nextElementSibling as HTMLElement | null
      const code = codeEl?.querySelector('code')?.innerText
      if (code) {
        showToast('已复制代码')
      }
    }
  }

  document.addEventListener('click', onClick, true)

  return () => document.removeEventListener('click', onClick, true)
}

onMounted(() => {
  setupProgressBar()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  // 等 markdown 渲染完再挂 toc 和 copy
  setTimeout(() => {
    tocCleanup = setupTocSpy()
    copyCleanup = setupCopyToast()
  }, 50)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  tocCleanup?.()
  copyCleanup?.()
  progressBar?.remove()
})
</script>

<template>
  <span class="sr-only">阅读进度、目录跟随、复制提示</span>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>