import { readdirSync, statSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

const excludeFiles = new Set(['index.md'])
const excludeDirs = new Set(['.vitepress', 'node_modules', 'public', 'superpowers'])
const collator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'base' })

// 目录名 → 显示名映射
const titleMap: Record<string, string> = {
  'reading-notes': '读书笔记',
  'fullstack': '全栈学习',
  'devops': 'DevOps',
  'agent': 'Agent 开发',
  'roadmap': '技术地图',
}

type SidebarItem = {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

function sortNames(names: string[]) {
  return names.sort((a, b) => collator.compare(a, b))
}

function displayTitle(name: string) {
  if (titleMap[name]) return titleMap[name]
  return name
    .replace(/^\d+(?:[.-]\d+)*[.-]?\s*/, '')
    .replace(/-新版$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
}

function scanDirectory(dirPath: string, docsPath: string): SidebarItem[] {
  const entries = sortNames(readdirSync(dirPath))
  const items: SidebarItem[] = []

  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stat = statSync(fullPath)
    if (stat.isFile() && extname(entry) === '.md' && !excludeFiles.has(entry)) {
      const relativePath = relative(docsPath, fullPath)
      items.push({
        text: displayTitle(basename(entry, '.md')),
        link: `/${relativePath.replace(/\\/g, '/').replace(/\.md$/, '')}`,
      })
    }
  }

  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stat = statSync(fullPath)
    if (!stat.isDirectory() || excludeDirs.has(entry)) continue

    const children = scanDirectory(fullPath, docsPath)
    if (children.length) {
      items.push({
        text: displayTitle(entry),
        collapsed: true,
        items: children,
      })
    }
  }

  return items
}

export function generateSidebar(docsPath: string): SidebarItem[] {
  const entries = sortNames(readdirSync(docsPath))
  const sidebar: SidebarItem[] = []

  const rootFiles = entries
    .filter((entry) => {
      const fullPath = join(docsPath, entry)
      return statSync(fullPath).isFile() && extname(entry) === '.md' && !excludeFiles.has(entry)
    })
    .map((entry) => ({
      text: displayTitle(basename(entry, '.md')),
      link: `/${basename(entry, '.md')}`,
    }))

  if (rootFiles.length) {
    sidebar.push({ text: '阅读指南', collapsed: true, items: rootFiles })
  }

  for (const entry of entries) {
    const fullPath = join(docsPath, entry)
    if (!statSync(fullPath).isDirectory() || excludeDirs.has(entry)) continue

    const children = scanDirectory(fullPath, docsPath)
    if (children.length) {
      sidebar.push({
        text: displayTitle(entry),
        collapsed: true,
        items: children,
      })
    }
  }

  return sidebar
}
