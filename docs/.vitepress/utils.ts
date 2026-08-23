import { readdirSync, statSync, existsSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

const excludeFiles = new Set(['index.md'])
const excludeDirs = new Set(['.vitepress', 'node_modules', 'public', 'superpowers', 'about', 'changes', 'conventions', 'decisions'])
const collator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'base' })

// 目录名 → 显示名映射
const titleMap: Record<string, string> = {
  // 子目录（侧栏展示的中文名）
  'rest': 'REST 设计',
  'spring-boot': 'Spring Boot 实战',
  'java': 'Java 实战',
  'ecosystem': '语言生态',
  'system-design': '系统设计',
  'service-governance': '服务治理',
  'engineering': '工程治理',
  'java17特性': 'Java 17 新特性',
  '1.17的亮点': 'Java 17 亮点速览',
  'docker': 'Docker 基础',
  'kubernetes': 'Kubernetes 实战',
  'github-actions': 'GitHub Actions',
  'llm-agent': 'LLM Agent',
  'rag': 'RAG 检索增强',
  'backend-roadmap': '后端路线',
  'cloud-native': '云原生',
  '凤凰架构': '《凤凰架构》',
  '薪资谈判': '薪资谈判',
  'tech-lead': 'Tech Lead 转型',

  // 11 大类（按工程师工作场景划分）
  backend: '后端开发',
  frontend: '前端开发',
  data: '数据存储',
  middleware: '中间件',
  devops: 'DevOps & 云原生',
  ai: 'AI & 大模型',
  architecture: '架构 & 性能',
  practice: '工程实践',
  reading: '读书笔记',
  career: '个人成长',
  biz: '业务知识',
  // 二级子目录
  cicd: 'CICD 工具',
  // 三级子目录
  advanced: '进阶',
  // 业务知识子主题
  '互联网金融信贷': '互联网金融信贷',
  '国内支付': '国内支付',
  '跨境支付': '跨境支付',
  '业务从零开始学习': '业务从零开始学习',
  '跨境支付清结算体系': '跨境支付清结算体系',
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
  let dirIndexLink: string | undefined // 本目录 index.md 的链接（如有）

  // 1. 先收集本目录下的 .md 文件
  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stat = statSync(fullPath)
    if (stat.isFile() && extname(entry) === '.md' && !excludeFiles.has(entry)) {
      const relativePath = relative(docsPath, fullPath)
      // README.md 当作目录索引
      const isIndex = basename(entry, '.md') === 'index'
      const linkPath = isIndex
        ? `/${relativePath.replace(/\\/g, '/').replace(/index\.md$/, '')}`
        : `/${relativePath.replace(/\\/g, '/').replace(/\.md$/, '')}`
      if (isIndex) {
        // 记录本目录 index.md 的链接，子目录分组会用作 heading link
        dirIndexLink = linkPath
      } else {
        items.push({
          text: displayTitle(basename(entry, '.md')),
          link: linkPath,
        })
      }
    }
  }

  // 2. 再递归子目录（作为分组）
  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stat = statSync(fullPath)
    if (!stat.isDirectory() || excludeDirs.has(entry)) continue

    const children = scanDirectory(fullPath, docsPath)
    if (children.length) {
      // 子目录有 index.md 时，把目录也变成可点击的 link（VitePress 支持 text + link + items）
      const subIndexMd = existsSync(join(dirPath, entry, 'index.md'))
      let dirLink: string | undefined
      if (subIndexMd) {
        const rel = relative(docsPath, join(dirPath, entry))
        dirLink = `/${rel.replace(/\\/g, '/')}/`
      }
      items.push({
        text: displayTitle(entry),
        link: dirLink,
        collapsed: false,
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

  // 每个一级分类：递归构建侧栏
    for (const entry of entries) {
      const fullPath = join(docsPath, entry)
      if (!statSync(fullPath).isDirectory() || excludeDirs.has(entry)) continue

      // 该分类下的所有 sidebar（包含分类首页 + 子目录 + 子目录下的所有嵌套内容）
      const dirItems = buildSidebarTree(fullPath, docsPath)

      // 空分类也注册 sidebar（用分类首页作 heading，不被跳过）
      const topGroup: SidebarItem = {
        text: displayTitle(entry),
        collapsed: false,
        items: dirItems.length > 0 ? dirItems : [
          { text: displayTitle(entry), link: `/${entry}/` },
        ],
      }
      map[`/${entry}/`] = [topGroup]
      map[`/${entry}`] = [topGroup]

      if (dirItems.length === 0) continue

      // 递归为每个深层路径注册同一份 sidebar
      registerSidebarPaths(topGroup, map)
    }

    return map
  }

  /**
   * 递归为每个深层路径注册 sidebar
   * 当前 group（含一级分类 heading + 子树）赋给所有子目录路径
   */
  function registerSidebarPaths(group: SidebarItem, map: Record<string, SidebarItem[]>): void {
    for (const item of group.items || []) {
      if (!item.link || !item.items) continue
      const link = item.link
      if (!link.startsWith('/') || !link.endsWith('/')) continue
      map[link] = [group]
      map[link.slice(0, -1)] = [group]
    }
    // 对每个 group 的子项递归（而不是对 group 本身递归，避免无限循环）
    for (const item of group.items || []) {
      if (!item.items) continue
      // 给 item 子项的 sidebar 也赋同一份 group
      for (const sub of item.items) {
        if (!sub.link || !sub.items) continue
        const subLink = sub.link
        if (!subLink.startsWith('/') || !subLink.endsWith('/')) continue
        map[subLink] = [group]
        map[subLink.slice(0, -1)] = [group]
      }
    }
  }

  /**
   * 构建指定目录下的所有 sidebar 项（递归）
   * - 收集所有 .md 文件作为 link（跳过 index.md）
   * - 收集所有子目录作为 group（递归）
   */
  function buildSidebarTree(dirPath: string, docsPath: string): SidebarItem[] {
    const entries = sortNames(readdirSync(dirPath))
    const items: SidebarItem[] = []

    // 1. 收集 .md 文件
    for (const entry of entries) {
      const fullPath = join(dirPath, entry)
      const stat = statSync(fullPath)
      if (!stat.isFile() || extname(entry) !== '.md' || excludeFiles.has(entry)) continue
      if (basename(entry, '.md') === 'index') continue
      const relativePath = relative(docsPath, fullPath)
      const linkPath = `/${relativePath.replace(/\\/g, '/').replace(/\.md$/, '')}`
      items.push({
        text: displayTitle(basename(entry, '.md')),
        link: linkPath,
      })
    }

    // 2. 收集子目录作为 group
    for (const entry of entries) {
      const fullPath = join(dirPath, entry)
      const stat = statSync(fullPath)
      if (!stat.isDirectory() || excludeDirs.has(entry)) continue

      const childItems = buildSidebarTree(fullPath, docsPath)
      if (childItems.length === 0) continue

      let dirLink: string | undefined
      if (existsSync(join(dirPath, entry, 'index.md'))) {
        const rel = relative(docsPath, join(dirPath, entry))
        dirLink = `/${rel.replace(/\\/g, '/')}/`
      }

      items.push({
        text: displayTitle(entry),
        link: dirLink,
        collapsed: false,
        items: childItems,
      })
    }

    return items
  }
