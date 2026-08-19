# Changelog

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)。

格式：`feat:` 新功能 | `fix:` 修复 | `docs:` 文档 | `refactor:` 重构 | `chore:` 杂项

---

## [Unreleased]

### Added

- **跨境支付 · 清结算体系专题（19 篇规划，已完成 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 共 9 篇）**：
  - 0_全局架构与专家视角-全景 — 系列导读，三流合一（资金流/信息流/合规流）+ 12 个跨境 vs 国内差异
  - 1_跨境清结算全景-深度 — 收单侧全景，13 个时点拆解 + 四本账 + 四种商业模式 + 12 维差异表
  - 2_清算vs结算与资金权属-深度 — 6 维对比 + 5 次权属变化 + 13 时点定位 + 在途资金合规边界
  - 3_跨境参与方全景与利益博弈-深度 — 9 类参与方 + 议价权分布 + 行业博弈 + 监管意图
  - 4_一笔跨境支付的13个时点-深度 — 授权 / 清算 / 结算三阶段 + 13 时点拆解 + 5 分钟定位 SOP + 对账默契时间窗口
  - 5_多币种与汇率定价权-深度 — 5 币种转换 + 3 汇率策略（DCC/MCP/锁汇）+ 汇率点差收入占比 + 真实汇兑争议
  - 6_多币种账户体系与头寸管理-深度 — 3 账户模式（单钱包/多钱包/单账户多币种）+ 头寸 4 机制 + 备付金真实计息规则
  - 7_跨境清分模型与MDR拆解-深度 — interchange / assessment / processor / markup 4 部分 + 3 清算模式 + 拒付反向清分
  - 8_跨境账务体系四态模型-深度 — 待清算 / 待结算 / 在途 / 已结 + 双向记账（原币+本位币）+ 在途资金合规边界
  - 后续 10 篇：9 跨境对账三层 / 10 清结算系统架构 / 11 清分引擎 / 12 结算引擎 / 13 对账引擎 / 14 外汇风险 / 15 拒付退款 / 16 跨境合规 / 17 十大踩坑 / 18 平台演进

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

## [0.4.0] — 2026-08-19

### Added

- **AI 域 L1 入门层收官（14 篇完整收尾 · docs/ai/入门层/从零开始认识AI系列/）**：
  - 0_系列导读-全景 — 5W 速记卡 + 阅读路径 + 与其他 AI 域专题关系
  - 1_什么是LLM — concept，模型/训练/推理 3 概念 + 主流模型家谱
  - 2_为什么需要Agent — concept，agent vs 单纯 LLM 的 5 个差异
  - 3_Agent生态与版图 — concept，编排 / 工具 / 记忆 / 评测 / 框架 5 层全景
  - 4_Agent为什么会思考 — concept，CoT / ReAct 论文编号 + 思考链路推演
  - 5_Agent怎么动手（Function Calling）— concept，FC 三件套 + strict 模式 + tool search
  - 6_Agent怎么记事（记忆）— concept，working / episodic / semantic 三层记忆
  - 7_Agent怎么规划（规划）— concept，Plan-and-Execute / ReWOO / Reflexion / LATS 四模式
  - 8_端到端串成完整Agent调用流程 — 全景，9 步 trace + BrewTrace 实测数据
  - 9_Harness是什么 — concept，agent 操作系统层 + 检查点/容错/可观测
  - 10_MCP协议与生态 — concept，MCP 三件套 + registry/pulsemcp/glama 生态
  - 11_Prompt与Context — concept，Context Engineering + ACE / Manus 案例
  - 12_多Agent与Subagent — concept，6 种协作模式 + token 乘数 + 5 大失败模式
  - 13_收官与能力地图 — 全景，2022-2026 五年演进 timeline + 5 层能力地图 + 选型决策

- **AI 域 L2 特性层启动（5 大方向 10 篇规划 · docs/ai/特性层/深入理解Agent工程化特性系列/）**：
  - 0_系列导读-全景 — 轻量化全景（10 篇总览表 + 5 大方向 Mermaid 全景图 + 3 类阅读路径）
  - 1_四家编排引擎架构横评-深度 — LangGraph / CrewAI / AutoGen / OpenAI Agents SDK 四家架构对比 + 范式漂移（Chain → ReAct → Graph → SDK 派）+ claude-code 14w star 工程化壁垒解读

- **新增 scripts/ 工具**：
  - scripts/verify-6-loop.py — 6 Loop 一键验证（Loop 1-6 完整性/Mermaid/隐私/画像锚点/标签红线/字数），按 frontmatter type 自动适配（concept/deep-dive/overview/biz/practice）
  - scripts/fix-mermaid-fullwidth.py — Mermaid 全角标点批量修复（10 字符黑名单），可重跑、幂等

### Changed

- RocketMQ 实践类文件名 + 内容清理 SOP 后缀（遵循 2026-08-14 公开文章禁 SOP 后缀规则）：
  - `0_SpringBoot接入RocketMQSOP.md` → `0_SpringBoot接入RocketMQ.md`（frontmatter title 去「实战 SOP」、type practice-sop → practice、tags 去「实战SOP」字段）
  - `1_消费线程池选型SOP.md` → `1_消费线程池选型.md`（文件内交叉引用同步更新）
  - 删除 `场景实践/0_系列导读-全景.md`（重复，与 RocketMQ 实践类全局导读重复）

### Fixed

- 篇 13 收官与能力地图 2.1 三个拐点 timeline 子行修复：
  - L73「论文爆发：CoT / ReAct」全角冒号 → 连字符（避免 Mermaid 渲染失败）
  - L15「从"模型之争"转向"上下文与 Harness 之争"」ASCII 双引号 → 直接去除（Mermaid timeline 事件文本中 `"` 是语法杀手）
  - 教训沉淀：扫 Mermaid 必须逐行扫全部子行（含 timeline 缩进子行），不能只看主行

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
