/* eslint-disable */
const { readdirSync, readFileSync, writeFileSync, statSync, mkdirSync, existsSync } = require('node:fs')
const { join } = require('node:path')
const readingTime = require('reading-time')

const ROOT = 'docs'
const VUE_PATH = 'docs/.vitepress/theme/TocOverview.vue'
const JSON_PATH = 'docs/.vitepress/theme/sections.json'
const PUBLIC_PATH = 'docs/public/sections.json'

// 11 大类：按工程师工作场景划分
const titleMap = {
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
  '跨境支付': '跨境支付',
}
const iconMap = {
  backend: '⌬',
  frontend: '⌘',
  data: '▥',
  middleware: '▣',
  devops: '◉',
  ai: '✦',
  architecture: '⬡',
  practice: '⚙',
  reading: '☰',
  career: '◐',
  biz: '◈',
}
const descMap = {
  backend: 'Java/Go/Python 等开发语言、语言生态与框架。',
  frontend: 'JS/TS、Vue/React、构建工具、Web 性能、跨端。',
  data: 'MySQL、PostgreSQL、MongoDB、Elasticsearch 等数据存储。',
  middleware: 'RocketMQ、Kafka 等消息队列，Redis 缓存及通用基础设施中间件。',
  devops: 'Kubernetes、Docker、CICD、Service Mesh、云原生等工程交付。',
  ai: 'LLM、Agent、RAG、向量数据库、Prompt 工程。',
  architecture: '系统设计、服务治理、工程治理、稳定性工程等工程化思想。',
  practice: 'Git、测试、Code Review、调试、问题排查、性能调优方法论与工具链。',
  reading: '整本书学习心得、跨领域阅读。',
  career: '软技能、Career、面试、薪资谈判、心理建设。',
  biz: '互联网金融、支付体系、跨境收单等业务领域的全维度认知。',
}

function walk(root) {
  const result = []
  for (const name of readdirSync(root)) {
    const p = join(root, name)
    if (name.startsWith('.')) continue
    const stat = statSync(p)
    if (stat.isDirectory()) {
      result.push(...walk(p))
    } else if (
      name.endsWith('.md') &&
      // 跳过任何层级的 index.md（=分类首页/子主题首页，不算文章）
      name !== 'index.md' &&
      name !== 'README.md'
    ) {
      result.push(p)
    }
  }
  return result
}

function getFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!m) return { meta: {}, body: text }
  const meta = {}
  const block = m[1]
  const lines = block.split('\n')
  let currentKey = null
  let inArray = false
  let arrayItems = []

  for (const rawLine of lines) {
    const line = rawLine
    if (inArray) {
      const itemMatch = line.match(/^\s*-\s+(.*)$/)
      if (itemMatch) {
        arrayItems.push(itemMatch[1].trim().replace(/^['"]|['"]$/g, ''))
        continue
      }
      meta[currentKey] = arrayItems
      inArray = false
      arrayItems = []
      currentKey = null
    }
    const idx = line.indexOf(':')
    if (idx > 0 && !line.trimStart().startsWith('-')) {
      const k = line.slice(0, idx).trim()
      const v = line.slice(idx + 1).trim()
      if (v === '') {
        currentKey = k
      } else if (v.startsWith('[') && v.endsWith(']')) {
        meta[k] = v
          .slice(1, -1)
          .split(',')
          .map((x) => x.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      } else {
        meta[k] = v.replace(/^['"]|['"]$/g, '')
      }
    }
  }
  if (inArray && currentKey) meta[currentKey] = arrayItems
  return { meta, body: text.slice(m[0].length) }
}

function titleFromHeading(body, fallback) {
  const m = body.match(/^#\s+(.+)$/m)
  if (m) return m[1].trim()
  return fallback
}

function excerptFromBody(body) {
  // 去掉 # 标题、代码块、链接，提取前 80 字
  const stripped = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#-]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (stripped.length > 80) return stripped.slice(0, 80) + '…'
  return stripped
}

function wordCountOf(body) {
  // 中英文混合字数：中文按 1 字，英文按词数
  const cn = (body.match(/[\u4e00-\u9fa5]/g) || []).length
  const en = (body.match(/[A-Za-z]+/g) || []).length
  return cn + Math.round(en * 0.5)
}

function buildSections() {
  const allFiles = walk(ROOT)
  const grouped = {}
  for (const f of allFiles) {
    const rel = f.replace(`${ROOT}/`, '')
    const dir = rel.split('/')[0]
    if (!titleMap[dir]) continue
    if (!grouped[dir]) grouped[dir] = []
    grouped[dir].push(f)
  }

  const sections = []
  for (const dir of Object.keys(grouped)) {
    const articles = grouped[dir]
      .map((f) => {
        const text = readFileSync(f, 'utf8')
        const { meta, body } = getFrontmatter(text)
        const rel = f.replace(`${ROOT}/`, '').replace(/\.md$/, '')
        const stats = readingTime(body)
        const wordCount = meta.wordCount ? parseInt(meta.wordCount, 10) : wordCountOf(body)
        const readMinutes = meta.readMinutes ? parseInt(meta.readMinutes, 10) : Math.max(1, Math.round(stats.minutes))
        const isTest = /\\[test\\]/.test(rel) || meta.test === 'true' || meta.test === true
                const cleanTitle = meta.title || titleFromHeading(body, rel.split('/').pop())
                return {
                  file: `/${rel}`,
                  title: isTest ? '🧪 ' + cleanTitle : cleanTitle,
                  wordCount,
                  readMinutes,
                  excerpt: excerptFromBody(body),
                  tags: Array.isArray(meta.tags) ? meta.tags : [],
                  isTest,
                }
      })
      .sort((a, b) => {
        // 标题以「§N」开头的系列：先按章节数字排序（§2 < §10，字符串序会排错）
        const ma = a.title.match(/^§(\d+)/)
        const mb = b.title.match(/^§(\d+)/)
        if (ma && mb) {
          if (ma[1] !== mb[1]) return parseInt(ma[1], 10) - parseInt(mb[1], 10)
          // 同一章节拆多篇（如 §5 上/中/下）：按文件路径排序，配合 5-1_/5-2_/5-3_ 数字前缀
          return a.file.localeCompare(b.file, 'zh-CN', { numeric: true })
        }
        return a.title.localeCompare(b.title, 'zh-CN')
      })
    sections.push({
      key: dir,
      icon: iconMap[dir],
      label: titleMap[dir],
      description: descMap[dir],
      articles,
    })
  }
  return sections
}

function renderSectionsToVue(sections) {
  const lines = ['[']
  for (const s of sections) {
    lines.push('  {')
    lines.push(`    key: '${s.key}',`)
    lines.push(`    icon: '${s.icon}',`)
    lines.push(`    label: ${JSON.stringify(s.label)},`)
    lines.push(`    description: ${JSON.stringify(s.description)},`)
    lines.push('    articles: [')
    for (const a of s.articles) {
      lines.push('      {')
      lines.push(`        file: ${JSON.stringify(a.file)},`)
      lines.push(`        title: ${JSON.stringify(a.title)},`)
      lines.push(`        wordCount: ${a.wordCount},`)
      lines.push(`        readMinutes: ${a.readMinutes},`)
      lines.push(`        excerpt: ${JSON.stringify(a.excerpt)},`)
      lines.push(`        tags: ${JSON.stringify(a.tags)},`)
      lines.push('      },')
    }
    lines.push('    ],')
    lines.push('  },')
  }
  lines.push(']')
  return lines.join('\n')
}

function main() {
  const sections = buildSections()
  const totalArticles = sections.reduce((s, x) => s + x.articles.length, 0)

  // 1. 写 sections.json（两个位置）
  const json = JSON.stringify(sections, null, 2) + '\n'
  writeFileSync(JSON_PATH, json, 'utf8')
  // public/ 让 vitepress 在 dev/prod 都能作为静态资源 serve
  if (!existsSync('docs/public')) mkdirSync('docs/public', { recursive: true })
  writeFileSync(PUBLIC_PATH, json, 'utf8')

  // 2. 替换 TocOverview.vue 的 sections 数组
  let vue = readFileSync(VUE_PATH, 'utf8')
  const startMarker = 'const sections: Section[] = '
  const startIdx = vue.indexOf(startMarker)
  if (startIdx < 0) {
    console.error('未找到 sections 数组，请手动维护 TocOverview.vue')
    process.exit(1)
  }

  // 找匹配的 ] 结束位置
  let depth = 0
  let endIdx = -1
  let inString = false
  let stringCh = ''
  for (let i = startIdx + startMarker.length; i < vue.length; i++) {
    const ch = vue[i]
    if (inString) {
      if (ch === stringCh && vue[i - 1] !== '\\') inString = false
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inString = true
      stringCh = ch
      continue
    }
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) {
        endIdx = i
        break
      }
    }
  }
  if (endIdx < 0) {
    console.error('未找到匹配的 ]，请手动维护 TocOverview.vue')
    process.exit(1)
  }

  const before = vue.slice(0, startIdx)
  const after = vue.slice(endIdx + 1)
  vue = before + startMarker + renderSectionsToVue(sections) + after
  writeFileSync(VUE_PATH, vue, 'utf8')

  console.log(`已更新 TocOverview.vue + sections.json（${sections.length} 分类 / ${totalArticles} 篇文章）`)
}

main()
