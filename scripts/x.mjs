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

const COMMANDS = {
  // === 核心命令 ===
  dev: {
    desc: '本地 dev server（5175）',
    run: async () => {
      clean()
      const child = spawn(npmCmd, ['run', 'docs:dev', '--', '--host', '127.0.0.1', '--port', '5175'], {
        cwd: ROOT,
        stdio: 'inherit',
      })
      process.on('SIGINT', () => child.kill('SIGINT'))
      await new Promise(() => {}) // 永远不退出
    },
  },

  build: {
    desc: '清理 + 构建 + 验证（本地用）',
    run: () => {
      clean()
      const ok1 = run('npm run toc:sync')
      if (!ok1) process.exit(1)
      const ok2 = run('npm run meta:inject')
      if (!ok2) process.exit(1)
      const ok3 = run('npm run docs:build')
      if (!ok3) process.exit(1)
      const ok4 = run('npm run docs:verify')
      if (!ok4) process.exit(1)
      console.log('\n\x1b[32m✓ 构建成功 + 验证通过\x1b[0m')
    },
  },

  // === 部署相关 ===
  deploy: {
    desc: '构建 + git add + commit + push（自动部署到 GitHub Pages）',
    run: () => {
      clean()
      run('npm run toc:sync')
      run('npm run meta:inject')
      run('npm run docs:build')
      const verifyOk = run('npm run docs:verify')
      if (!verifyOk) {
        console.error('\n\x1b[31m✗ 验证失败，不提交\x1b[0m')
        process.exit(1)
      }
      run('git add -A')
      const status = execSync('git status --short', { cwd: ROOT, encoding: 'utf-8' }).trim()
      if (!status) {
        console.log('\n\x1b[33m没有改动，跳过 commit\x1b[0m')
        return
      }
      const msg = process.argv[3] || 'chore: 更新站点'
      run(`git commit -m "${msg.replace(/"/g, '\\"')}"`)
      run('git push origin master')
      console.log('\n\x1b[32m✓ 已推送，GitHub Pages 1-2 分钟后自动部署\x1b[0m')
    },
  },

  sync: {
    desc: '只跑 sync-toc（不构建）',
    run: () => {
      run('npm run toc:sync')
    },
  },

  // === 检查工具 ===
  check: {
    desc: '检查 Actions 状态（CI 部署后用）',
    run: async () => {
      const token = process.env.GITHUB_TOKEN || readFileSync(resolve(process.env.HOME, '.hermes/github-token'), 'utf-8').trim()
      try {
        const url = 'https://api.github.com/repos/xiaobo1997/programmer-knowledge-graph/actions/runs?per_page=3'
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        for (const r of (data.workflow_runs || []).slice(0, 3)) {
          const color = r.conclusion === 'success' ? '\x1b[32m' : '\x1b[31m'
          console.log(`${color}${r.conclusion}\x1b[0m  ${r.name}  (${r.head_sha?.slice(0, 7)})  ${r.updated_at}`)
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
\x1b[36m用法：node scripts/x.js <command>\x1b[0m

可用命令：
${Object.entries(COMMANDS).map(([k, v]) => `  \x1b[33m${k.padEnd(10)}\x1b[0m ${v.desc}`).join('\n')}

\x1b[36m快捷别名：\x1b[0m
  dev    = npm run docs:dev -- --host 127.0.0.1 --port 5175
  build  = clean + sync-toc + meta-inject + docs:build + docs:verify
  deploy = build + git add/commit/push (commit message: script "deploy" <msg>)
  sync   = 只跑 sync-toc 重新生成总目录
  check  = 查看 GitHub Actions 最新状态

\x1b[36m示例：\x1b[0m
  node scripts/x.js dev
  node scripts/x.js build
  node scripts/x.js deploy "feat: 新增 MySQL 索引优化文章"
`)
  process.exit(cmd === '--help' || cmd === '-h' ? 0 : 1)
}

console.log(`\x1b[35m▶ ${cmd}: ${COMMANDS[cmd].desc}\x1b[0m`)
await COMMANDS[cmd].run()