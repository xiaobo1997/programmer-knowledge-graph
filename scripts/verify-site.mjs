import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'docs/.vitepress/dist')

// 9 大类 + 总目录 + 首页 = 11 个关键产物
const checks = [
  ['首页', 'index.html'],
  ['总目录', 'readme.html'],
  ['404', '404.html'],
  ['后端', 'backend/index.html'],
  ['前端', 'frontend/index.html'],
  ['数据', 'data/index.html'],
  ['DevOps', 'devops/index.html'],
  ['AI', 'ai/index.html'],
  ['架构', 'architecture/index.html'],
  ['工程实践', 'practice/index.html'],
  ['读书笔记', 'reading/index.html'],
  ['个人成长', 'career/index.html'],
  ['后端示例文章', 'backend/java/java17特性/1.17的亮点.html'],
  ['DevOps 子主题入口', 'devops/cicd/index.html'],
  ['读书笔记首页', 'reading/index.html'],
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