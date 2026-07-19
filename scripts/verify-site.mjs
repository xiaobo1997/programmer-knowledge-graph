import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'docs/.vitepress/dist')

const checks = [
  ['首页', 'index.html'],
  ['总目录', 'readme.html'],
  ['读书笔记 README', 'reading-notes/README.html'],
  ['全栈 README', 'fullstack/README.html'],
  ['DevOps README', 'devops/README.html'],
  ['Agent README', 'agent/README.html'],
  ['技术地图 README', 'roadmap/README.html'],
]

const failures = []
for (const [label, relativePath] of checks) {
  const path = resolve(dist, relativePath)
  if (!existsSync(path) || statSync(path).size === 0) {
    failures.push(`${label}: ${relativePath}`)
  }
}

const indexPath = resolve(dist, 'index.html')
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, 'utf8')
  if (!html.includes('程序员的长期知识图谱') && !html.includes('程序员的') && !html.includes('工程师知识花园')) {
    failures.push('首页未包含预期站点标题')
  }
}

if (failures.length) {
  console.error('站点验证失败：')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`站点验证通过：${checks.length} 个关键产物均存在`)
