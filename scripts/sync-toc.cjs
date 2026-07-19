/* eslint-disable */
const { readdirSync, readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const readingTime = require('reading-time')

const ROOT = 'docs'

const titleMap = {
  'reading-notes': '读书笔记',
  fullstack: '全栈学习',
  devops: 'DevOps',
  agent: 'Agent / AI',
  career: '个人成长',
  roadmap: '技术地图',
}

const iconMap = {
  'reading-notes': '▤',
  fullstack: '⌘',
  devops: '◈',
  agent: '✦',
  career: '◉',
  roadmap: '⬡',
}

const descMap = {
  'reading-notes': '每一本书的核心观点、个人思考、行动清单与工程连接。',
  fullstack: '前端、后端、跨端、网络、性能调优等横向技能。',
  devops: 'Linux、Docker、Kubernetes、CICD、监控、应急响应等工程交付。',
  agent: 'LLM Agent、Tool Use、RAG、记忆与多步推理。',
  career: '软技能、职业规划、薪资谈判、效率工具与心理建设。',
  roadmap: '各领域学习路径、依赖关系与里程碑。',
}

function walk(root) {
  const result = []
  for (const name of readdirSync(root)) {
    const p = join(root, name)
    if (name.startsWith('.')) continue
    const stat = require('node:fs').statSync(p)
    if (stat.isDirectory()) {
      result.push(...walk(p))
    } else if (
      name.endsWith('.md') &&
      !name.toUpperCase().endsWith('README.MD') &&
      !['index.md', 'readme.md'].includes(name)
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
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx > 0) {
      const k = line.slice(0, idx).trim()
      const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (k !== 'tags') meta[k] = v
    }
  }
  return { meta, body: text.slice(m[0].length) }
}

function titleFromHeading(body, fallback) {
  const m = body.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : fallback
}

function excerptFromBody(body) {
  const lines = body.split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    if (t.startsWith('#')) continue
    if (t.startsWith('>')) continue
    if (t.startsWith('```')) continue
    if (t.startsWith('-') || t.startsWith('*')) continue
    if (t.startsWith('|')) continue
    const cleaned = t.replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    if (cleaned.length < 5) continue
    return cleaned.length > 80 ? cleaned.slice(0, 80) + '…' : cleaned
  }
  return ''
}

function wordCountOf(text) {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = (text.match(/[a-zA-Z]+/g) || []).length
  return chinese + english
}

function main() {
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
        return {
          file: `/${rel}`,
          title: meta.title || titleFromHeading(body, rel.split('/').pop()),
          wordCount,
          readMinutes,
          excerpt: excerptFromBody(body),
        }
      })
      .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
    sections.push({
      key: dir,
      icon: iconMap[dir],
      label: titleMap[dir],
      description: descMap[dir],
      articles,
    })
  }

  // 渲染 TocOverview.vue 的内容（替换 articles 数组）
  const vuePath = 'docs/.vitepress/theme/TocOverview.vue'
  let vue = readFileSync(vuePath, 'utf8')

  const sectionsLiteral = JSON.stringify(sections, null, 2)
    .replace(/"(\w+)":/g, "$1:")
    .replace(/"/g, "'")

  // 找 const sections: Section[] = [...]\n  的位置，匹配配对中括号
  const startMarker = 'const sections: Section[] = '
  const startIdx = vue.indexOf(startMarker)
  if (startIdx < 0) {
    console.error('未找到 sections 数组，请手动维护 TocOverview.vue')
    process.exit(1)
  }
  // 找 const sections: Section[] = [...] 块结束位置
  // 从 startIdx + startMarker.length 开始找匹配的 ]
  // depth 计数：遇到 [ 加 1，遇到 ] 减 1，depth == 0 时 ] 即为结束
  let depth = 0
  let endIdx = -1
  let inString = false
  let stringCh = ''
  let i = startIdx + startMarker.length
  for (; i < vue.length; i++) {
    const ch = vue[i]
    if (inString) {
      if (ch === stringCh && vue[i - 1] !== '\\') {
        inString = false
      }
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
  vue = before + startMarker + sectionsLiteral + after
  writeFileSync(vuePath, vue, 'utf8')
  console.log(`已更新 TocOverview.vue（${sections.length} 分类 / ${sections.reduce((s, x) => s + x.articles.length, 0)} 篇文章）`)
}

main()