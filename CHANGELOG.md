# Changelog

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)。

格式：`feat:` 新功能 | `fix:` 修复 | `docs:` 文档 | `refactor:` 重构 | `chore:` 杂项

---

## [Unreleased]

### Added

- **跨境支付 · 清结算体系专题（19 篇规划，已完成 0 / 1 / 2 共 3 篇）**：
  - 0_全局架构与专家视角-全景 — 系列导读，三流合一（资金流/信息流/合规流）+ 12 个跨境 vs 国内差异 + 入门误区
  - 1_跨境清结算全景-深度 — 收单侧全景，13 个时点拆解 + 四本账 + 四种商业模式 + 12 维差异表
  - 2_清算vs结算与资金权属-深度 — 6 维对比 + 5 次权属变化 + 13 时点定位 + 在途资金合规边界
  - 后续 16 篇：参与方博弈、13 个时点、多币种、MDR 拆解、四态账务、对账三层、引擎设计、外汇风险、拒付、合规演变、十大踩坑、平台演进

- **跨境支付收单系列完成（11 篇）**：系统性覆盖参与方、交易、模式、架构、通道、对账、账户、风控、实战、全局设计
  - 1_概述-10分钟入门 — 国内 vs 跨境、7站旅程、卡组织、3DS、DCC、Chargeback
  - 2_参与方全景-9类角色拆解 — 发卡行/卡组织/收单行/收单机构/商户/通道、利益分配、风险归属
  - 3_外卡支付链路-从授权到结算 — 授权/捕获/结算三阶段、3DS分支、chargeback全流程
  - 4_业务模式-费率与分润深度 — 聚合vs直连、本地vs跨境、费率结构、分润模型
  - 5_收单系统架构-模块与部署 — 6层功能架构、部署拓扑、技术栈全景
  - 6_通道管理与路由-深度 — 通道分类/属性/生命周期/路由策略/健康度
  - 7_跨境对账与结算-架构设计 — 三方对账、结算周期、换汇流程、差异处理
  - 8_多币种账户体系-设计原理 — 账户模型、状态机、换汇策略
  - 9_风控与合规-跨境监管框架 — 3DS、风控规则、拒付率、AML/KYC、制裁名单
  - 10_端到端实战-境外卡全链路 — 真实场景从头走到尾
  - 11_全局架构设计-跨境收单系统全景 — 4+1视图、技术栈、trade-off汇总、从零搭建决策清单
- **文章命名规范**：序号_主题-深度标识.md，深度标识表（入门/全景/链路/深度/实战）+ 自检3问
- **6 Loop L2 增加 Mermaid 语法检查**：全角括号→Lexical error

- **业务知识分类（biz）**：第 10 大分类，覆盖互联网金融信贷、国内支付、跨境支付收单
- **业务文章模板** `docs/conventions/biz-article-template.md`：
  - 15 section 骨架（一句话定义 → 业务价值 → 术语 → 形态 → 流程 → 架构 → 对账 → trade-off → 数据模型 → 用例 → 打法 → 视角 → 技术架构 → 前景 → 总结）
  - AI 写作指令模板（先确认再写、配图规范、质量检查清单）
  - Mermaid 配图规范（flowchart / sequence / ER / graph / state）
- **示范文章**：国内支付 `1_清结算体系.md`（407 行，15 section 全覆盖，4 张 Mermaid 图）
- **Mermaid 点击放大**：点击 SVG 图全屏放大，支持 Esc/点击关闭
- **AGENTS.md 增加业务文章写作指引**

### Changed

- 治理层从 OpenSpec 迁移到 Conventional Commits + CHANGELOG
- 规范文件移至 `docs/conventions/`，ADR 移至 `docs/adr/`
- sync-toc.cjs：walk 跳过所有 index.md（子主题首页不算文章）
- 首页 features 压缩为 1 个卡片（`interview` 仓库）/ 保留 10 个（`programmer-knowledge-graph` 仓库）

### Fixed

- Mermaid 点击放大空白问题：v-html 改用响应式 svgContent + 剥离 width="100%"
- interview 仓库 sync-toc 0 篇问题：titleMap 从 6 个旧分类更新为 33 个数字编号分类
- interview theme/index.ts 重复 import 导致 build 报错

### Technical

- MermaidBlock.vue：新增 `<Teleport>` 全屏 overlay + 暗黑模式跟随

## [0.3.0] — 2026-07-27

### Added

- 文章内容格式规范（concept/problem/deep-dive + 5W 速记卡）
- 图片规范（本地 + 外部图床双模式）

### Changed

- OpenSpec 从 `docs/` 集中到仓库根 `openspec/`

## [0.2.0] — 2026-07-26

### Added

- KnowledgeRail 改用 shields.io badge 风格
- KnowledgeRail 默认折叠 + 展开 9 个方块
- 搜索改用 VitePress local search 替代 pagefind
- RocketMQ 事务消息文章

### Fixed

- KnowledgeRail 首页按钮双斜杠 bug

## [0.1.0] — 2026-07-25

### Added

- VitePress + Vue3 技术栈
- 9 大类分类结构
- KnowledgeRail 侧栏导航
- GitHub Pages 自动部署
