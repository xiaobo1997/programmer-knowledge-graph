import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import { generateSidebar, generateSidebarMap } from './utils'

const docsPath = resolve(process.cwd(), 'docs')

export default defineConfig({
  lang: 'zh-CN',
  title: '程序员的知识图谱',
  description: '读书笔记、全栈学习、DevOps、Agent 开发等长期沉淀。',
  cleanUrls: true,
  lastUpdated: true,
  // GitHub Pages 子路径部署
  base: '/programmer-knowledge-graph/',
  head: [
    ['meta', { name: 'theme-color', content: '#173b2c' }],
  ],
  markdown: {
    html: true,
    image: { lazyLoading: true },
    config: (md) => {
      // 把 ```mermaid 代码块替换成 <MermaidBlock> 全局组件
      const defaultFenceRender = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx]
        if (token.info === 'mermaid') {
          const code = md.utils.escapeHtml(token.content)
          return `<MermaidBlock code="${md.utils.escapeHtml(token.content)}" />`
        }
        return defaultFenceRender(tokens, idx, options, env, slf)
      }
    },
  },
  // 让 MermaidBlock 组件作为全局组件被 markdown 使用
  vueTemplate: false,
  // 文档站点只扫描 docs/，openspec/ 不参与部署
  // 任何指向 ../openspec/ 的链接都是 GitHub 源码链接，不算死链
  ignoreDeadLinks: true,
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '程序员的知识图谱',
    outline: {
      level: [2, 4],
      label: '本页目录',
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '总目录', link: '/readme' },
    ],
      // 文档站点只扫描 docs/，openspec/ 不参与部署
  // 任何指向 ../openspec/ 的链接都是 GitHub 源码链接，不算死链
  ignoreDeadLinks: true,

  // 多 sidebar：每个分类目录用各自的侧栏（只显示该分类文章）
    sidebar: generateSidebarMap(docsPath),
    // Pagefind 全文搜索（构建时自动索引）
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '没有找到相关内容',
                resetButtonTitle: '清除查询',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '知识目录',
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换为浅色模式',
    darkModeSwitchTitle: '切换为深色模式',
    lastUpdatedText: '最后更新',
    docFooter: { prev: '上一篇', next: '下一篇' },
    // 「在 GitHub 上编辑」链接
    editLink: {
      text: '在 GitHub 上编辑此页',
      link: 'https://github.com/xiaobo1997/programmer-knowledge-graph/edit/master/docs/',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiaobo1997/programmer-knowledge-graph' },
    ],
  },
})
