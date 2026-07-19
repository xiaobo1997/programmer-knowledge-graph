/* eslint-disable */
const { readdirSync, readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const readingTime = require('reading-time')

function walk(root) {
  const out = []
  const stack = [root]
  while (stack.length) {
    const dir = stack.pop()
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const p = join(dir, e.name)
      if (e.isDirectory()) stack.push(p)
      else out.push(p)
    }
  }
  return out
}

function getBodyForStats(text) {
  if (text.startsWith('---')) {
    const close = text.indexOf('\n---', 3)
    if (close > 0) return text.slice(close + 4)
  }
  return text
}

function inject(text, words, minutes) {
  if (text.startsWith('---')) {
    const close = text.indexOf('\n---', 3)
    if (close > 0) {
      const head = text.slice(0, close)
      const body = head.slice(4)
      const tail = text.slice(close)
      const lines = body.split('\n')
      let hasWord = false
      let hasRead = false
      const kept = []
      for (const line of lines) {
        if (/^wordCount\s*:/.test(line)) { kept.push(`wordCount: ${words}`); hasWord = true; continue }
        if (/^readMinutes\s*:/.test(line)) { kept.push(`readMinutes: ${Math.max(1, Math.round(minutes))}`); hasRead = true; continue }
        kept.push(line)
      }
      if (!hasWord) kept.push(`wordCount: ${words}`)
      if (!hasRead) kept.push(`readMinutes: ${Math.max(1, Math.round(minutes))}`)
      return `---${kept.join('\n')}${tail}`
    }
  }
  return `---\nwordCount: ${words}\nreadMinutes: ${Math.max(1, Math.round(minutes))}\n---\n${text}`
}

const ROOT = 'docs'
const SKIP = new Set(['docs/index.md', 'docs/readme.md'])
const SKIP_DIRS = ['docs/superpowers', 'docs/node_modules', 'docs/.vitepress']
const files = walk(ROOT).filter((p) => {
  if (!p.endsWith('.md')) return false
  if (SKIP.has(p)) return false
  for (const d of SKIP_DIRS) if (p.startsWith(d)) return false
  return true
})

let updated = 0
for (const p of files) {
  const original = readFileSync(p, 'utf8')
  const statsBody = getBodyForStats(original)
  const stats = readingTime(statsBody, { wordsPerMinute: 320 })
  const next = inject(original, stats.words, stats.minutes)
  if (next !== original) {
    writeFileSync(p, next, 'utf8')
    updated++
  }
}
console.log(`已为 ${updated} 篇文章注入 wordCount / readMinutes`)
