// VitePress 主题入口
// - 继承 DefaultTheme（保留 VPLocalSearch / VPSidebar / 暗黑模式等所有默认组件）
// - 通过 enhanceApp 注册全局组件 MermaidBlock
// - 自定义 Layout 通过 theme/Layout.vue 自动加载

import DefaultTheme from 'vitepress/theme'
import MermaidBlock from './MermaidBlock.vue'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    // 全局注册：markdown 里 ```mermaid 代码块通过 fence 规则
    // 转换成 <MermaidBlock code="..." /> 后能正确解析
    app.component('MermaidBlock', MermaidBlock)
  },
}