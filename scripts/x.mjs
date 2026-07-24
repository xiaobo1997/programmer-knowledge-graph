#!/usr/bin/env node
/* eslint-disable */
import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(cmd, opts = {}) {
  console.log(`\n\x1b[36m$ ${cmd}\x1b[0m`)
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts })
    return true
  } catch (e) {
    return false
  }
}

function clean() {
  for (const p of ['docs/.vitepress/dist', 'docs/.vitepress/cache']) {
    const full = resolve(ROOT, p)
    if (existsSync(full)) {
      execSync(`rm -rf "${full}"`, { cwd: ROOT })
    }
  }
}

// 完整 build 流程（dev / build / deploy 都复用）
function fullBuild() {
  clean()
  const ok1 = run('npm run toc:sync')
  if (!ok1) process.exit(1)
  const ok2 = run('npm run meta:inject')
  if (!ok2) process.exit(1)
  const ok3 = run('npm run docs:build')
  if (!ok3) process.exit(1)
  const ok4 = run('npm run docs:verify')
  if (!ok4) process.exit(1)
}

// 智能端口处理：如果 5175 占用，自动找下一个
function findFreePort(preferred = 5175) {
  let port = preferred
  while (port < 5200) {
    try {
      execSync(`lsof -i:${port} -P -n`, { stdio: 'ignore' })
      port++
    } catch {
      return port
    }
  }
  return preferred
}

// 检测 dist 是否需要重建（如果不存在或比源文件旧）
function distStale() {
  const distIndex = resolve(ROOT, 'docs/.vitepress/dist/index.html')
  if (!existsSync(distIndex)) return true
  // 简单判断：dist 文件是否比 docs/ 任意 .md 新
  try {
    const distMtime = execSync(`stat -f %m "${distIndex}" 2>/dev/null || stat -c %Y "${distIndex}"`, { encoding: 'utf-8' }).trim()
    const srcNewer = execSync(
      `find docs -name '*.md' -newer "${distIndex}" -type f 2>/dev/null | head -1`,
      { cwd: ROOT, encoding: 'utf-8' }
    ).trim()
    return !!srcNewer
  } catch {
    return true
  }
}

const COMMANDS = {
  // === 核心命令 ===

  // dev: 智能启动 — sync + 自动 build（如需）+ dev server
  dev: {
    desc: '本地 dev（sync + 智能 build + dev server）',
    run: async () => {
      // sync-toc 总是先跑（数据驱动，让分类、总目录、ArticleMeta 同步）
      run('npm run toc:sync')
      if (distStale()) {
        console.log('\x1b[33m检测到 dist 缺失或过期，先 build...\x1b[0m')
        fullBuild()
      } else {
        console.log('\x1b[32mdist 是新的，直接起 dev server\x1b[0m')
      }
      const port = findFreePort(5175)
      const child = spawn(npmCmd, ['run', 'docs:dev', '--', '--host', '127.0.0.1', `--port`, String(port)], {
        cwd: ROOT,
        stdio: 'inherit',
      })
      process.on('SIGINT', () => child.kill('SIGINT'))
      await new Promise(() => {})
    },
  },

  // build: 同步 + 完整 build + 验证
  build: {
    desc: 'sync + 清理 + build + 验证',
    run: () => {
      fullBuild() // fullBuild 内部已经跑 toc:sync + meta:inject
      console.log('\n\x1b[32m✓ 构建成功 + 验证通过\x1b[0m')
      console.log('\x1b[36m本地预览：http://127.0.0.1:5175/programmer-knowledge-graph/\x1b[0m')
    },
  },

  // 部署：build + git add + commit + push
  deploy: {
    desc: 'build + git add + commit + push（commit message: 剩余所有参数）',
    run: () => {
      fullBuild()
      run('git add -A')
      const status = execSync('git status --short', { cwd: ROOT, encoding: 'utf-8' }).trim()
      if (!status) {
        console.log('\n\x1b[33m没有改动，跳过 commit\x1b[0m')
        return
      }
      // 收集所有剩余参数作为 commit message（不用引号）
      const msgParts = process.argv.slice(3).filter((arg) => !arg.startsWith('--'))
      const msg = msgParts.length ? msgParts.join(' ') : 'chore: 更新站点'
      run(`git commit -m "${msg.replace(/"/g, '\\"')}"`)
      run('git push origin master')
      console.log('\n\x1b[32m✓ 已推送\x1b[0m')
      console.log('\x1b[36m查看 CI：npm run x -- check\x1b[0m')
    },
  },

  // === 辅助 ===

  check: {
    desc: '看 GitHub Actions 最新状态',
    run: async () => {
      const token = process.env.GITHUB_TOKEN || readFileSync(resolve(process.env.HOME, '.hermes/github-token'), 'utf-8').trim()
      try {
        const url = 'https://api.github.com/repos/xiaobo1997/programmer-knowledge-graph/actions/runs?per_page=3'
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        for (const r of (data.workflow_runs || []).slice(0, 3)) {
          const color = r.conclusion === 'success' ? '\x1b[32m' : r.conclusion === 'failure' ? '\x1b[31m' : '\x1b[33m'
          console.log(`${color}${r.conclusion || r.status}\x1b[0m  ${r.name}  (${r.head_sha?.slice(0, 7)})  ${r.updated_at}`)
        }
      } catch (e) {
        console.error('检查失败：', e.message)
      }
    },
  },
}

const cmd = process.argv[2]
if (!cmd || cmd === '--help' || cmd === '-h' || !COMMANDS[cmd]) {
  console.log(`
\x1b[36m用法：npm run x -- <command> [args]\x1b[0m

可用命令：
${Object.entries(COMMANDS).map(([k, v]) => `  \x1b[33m${k.padEnd(10)}\x1b[0m ${v.desc}`).join('\n')}

\x1b[36m快捷工作流：\x1b[0m
  \x1b[33mdev\x1b[0m     sync + 智能 build + dev server（最常用）
  \x1b[33mbuild\x1b[0m   sync + build + verify
  \x1b[33mdeploy\x1b[0m  build + commit + push（剩余参数作为 commit message）
  \x1b[33mcheck\x1b[0m   看 Actions 状态

\x1b[36m示例：\x1b[0m
  npm run x -- dev
  npm run x -- build
  npm run x -- deploy feat: 新增 MySQL 索引优化文章      ← 不需要引号
  npm run x -- check
`)
  process.exit(cmd === '--help' || cmd === '-h' ? 0 : 1)
}

console.log(`\x1b[35m▶ ${cmd}: ${COMMANDS[cmd].desc}\x1b[0m`)
await COMMANDS[cmd].run()