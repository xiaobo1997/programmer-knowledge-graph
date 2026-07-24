import { readdirSync, statSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

const excludeFiles = new Set(['index.md'])
const excludeDirs = new Set(['.vitepress', 'node_modules', 'public', 'superpowers', 'about', 'changes', 'conventions', 'decisions'])
const collator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'base' })

// 目录名 → 显示名映射
const titleMap: Record<string, string> = {
  // 9 大类（按工程师工作场景划分）
  backend: '后端开发',
  frontend: '前端开发',
  data: '数据 & 中间件',
  devops: 'DevOps & 云原生',
  ai: 'AI & 大模型',
  architecture: '架构 & 性能',
  practice: '工程实践',
  reading: '读书笔记',
  career: '个人成长',
  // 二级子目录
  cicd: 'CICD 工具',
  // 三级子目录
  advanced: '进阶',
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

/**
 * 生成多 sidebar 映射：每个分类目录对应一个独立侧栏，只显示该分类文章
 * key 是路径前缀（如 '/devops/'），value 是该分类下的 SidebarItem[]
 *
 * 效果：
 * - 在 /devops 下的页面，侧栏只显示 devops 分类的文章
 * - 在 /reading-notes 下的页面，侧栏只显示读书笔记的文章
 * - 在 /readme 等根页面，侧栏显示全部
 */
export function generateSidebarMap(docsPath: string): Record<string, SidebarItem[]> {
  const entries = sortNames(readdirSync(docsPath))
  const map: Record<string, SidebarItem[]> = {}

  // 根路径：用默认侧栏（全部）
  const rootSidebar: SidebarItem[] = []
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
    rootSidebar.push({ text: '阅读指南', collapsed: true, items: rootFiles })
  }
  for (const entry of entries) {
    const fullPath = join(docsPath, entry)
    if (!statSync(fullPath).isDirectory() || excludeDirs.has(entry)) continue

    const children = scanDirectory(fullPath, docsPath)
    if (children.length) {
      rootSidebar.push({
        text: displayTitle(entry),
        collapsed: true,
        items: children,
      })
    }
  }
  map['/'] = rootSidebar
  map['/readme/'] = rootSidebar

  // 每个分类目录：独立侧栏
  for (const entry of entries) {
    const fullPath = join(docsPath, entry)
    if (!statSync(fullPath).isDirectory() || excludeDirs.has(entry)) continue

    const dirItems: SidebarItem[] = []
    const children = scanDirectory(fullPath, docsPath)
    if (children.length) {
      dirItems.push({
        text: displayTitle(entry),
        collapsed: false,
        items: children,
      })
    }

    if (dirItems.length) {
      // key 用前缀路径（VitePress 会自动匹配 /devops/* 和 /devops/）
      map[`/${entry}/`] = dirItems
    }
  }

  return map
}
