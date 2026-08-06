<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import CategoryIcon from './CategoryIcon.vue'

const COLOR_MAP: Record<string, string> = {
  backend: '#f97316',
  frontend: '#06b6d4',
  data: '#eab308',
  devops: '#0ea5e9',
  ai: '#a855f7',
  architecture: '#14b8a6',
  practice: '#64748b',
  reading: '#f59e0b',
  career: '#ec4899',
}

interface Article {
  file: string
  title: string
  wordCount: number
  readMinutes: number
  excerpt: string
  tags?: string[]
}

interface Section {
  key: string
  icon: string
  label: string
  description: string
  articles: Article[]
}

const props = defineProps<{
  filter?: string
}>()

const { site } = useData()
function joinPath(base: string, file: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const f = file.startsWith('/') ? file : '/' + file
  return b + f
}
const base = computed(() => joinPath(site.value.base || '/', ''))

const sections: Section[] = [
  {
    key: 'backend',
    icon: '⌬',
    label: "后端开发",
    description: "Java/Go/Python、数据库、消息队列、分布式、JVM 调优。",
    articles: [
      {
        file: "/backend/java/java17特性/1.17的亮点",
        title: "1.17 的亮点：Java 17 五大新特性速览",
        wordCount: 991,
        readMinutes: 3,
        excerpt: "5 个新特性 + 1 张图 + 10 行代码，5 分钟搞懂 Java 17 为什么值得升级。  这是 Java 17 新特性系列第 1 篇：亮点速览。 Java…",
        tags: ["后端","Java","LTS","新特性","速览"],
      },
    ],
  },
  {
    key: 'biz',
    icon: '◈',
    label: "业务知识",
    description: "互联网金融、支付体系、跨境收单等业务领域的全维度认知。",
    articles: [
      {
        file: "/biz/跨境支付/浅析业务/1_参与方全景与利益博弈-深度",
        title: "参与方全景与利益博弈（深度）",
        wordCount: 6732,
        readMinutes: 21,
        excerpt: "系列第 1 篇 · 深度  上一篇 0跨境支付全景与核心概念全景 讲了 12 维差异 + 5 卡组织 + 7 段链路 + 4 独有概念。本篇是第一层 · 导览与…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/17_代付Payout-资金流出",
        title: "代付Payout：资金流出的逆向全流程",
        wordCount: 431,
        readMinutes: 1,
        excerpt: "一句话定义：代付（Payout）= 收单的反向——把钱从平台打出去，而不是收进来。典型场景包括商户提现、供应商付款、分账打款、工资代发。 | 维度 | 收单（P…",
        tags: ["跨境支付","代付","Payout","资金流出","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/10_端到端实战-境外卡全链路",
        title: "端到端实战：境外 VISA 卡在中国商户的全链路走查",
        wordCount: 721,
        readMinutes: 2,
        excerpt: "一句话定义：用一个真实场景走通跨境收单的全链路——新加坡用户用 VISA 卡买 100 SGD 的 SaaS 软件，钱怎么一步步到深圳商户的账上。 | 步骤 |…",
        tags: ["跨境支付","端到端","实战","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/9_端到端实战-境外卡全链路-业务深度",
        title: "端到端实战：境外 VISA 卡在中国商户的全链路走查（业务深度）",
        wordCount: 6102,
        readMinutes: 19,
        excerpt: "系列第 9 篇 · 业务深度  上一篇 8风控与合规框架深度 讲了跨境风控三层模型 + 3DS + AML + 国际合规 8 标准。本篇是第四层 · 业务能力矩…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/13_对账引擎设计与差错自愈-实战",
        title: "对账引擎设计与差错自愈（实战）",
        wordCount: 5519,
        readMinutes: 17,
        excerpt: "系列第 13 篇 · 实战  上一篇 12结算引擎与出款调度 讲了钱怎么出去。本篇进入第四层 · 架构与系统的最后一篇——讲钱怎么对账——对账引擎从 0 到 1…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/5_多币种与汇率定价权-深度",
        title: "多币种与汇率定价权（侧重收单）",
        wordCount: 5439,
        readMinutes: 17,
        excerpt: "系列第 5 篇 · 深度  上一篇 4一笔跨境支付的 13 个时点 讲过从授权到入账的 13 个时点。本篇聚焦其中最容易被忽略的一环——币种和汇率。一笔跨境支付…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/8_多币种账户体系-设计原理",
        title: "多币种账户体系：从模型到状态机的设计原理",
        wordCount: 513,
        readMinutes: 2,
        excerpt: "一句话定义：跨境收单的账户体系 = 每个商户有多个币种子账户 + 一个分润账户 + 一个保证金账户。核心挑战不是存钱，而是汇率波动时怎么记账和怎么对账。 | 策…",
        tags: ["跨境支付","账户","多币种","数据模型","业务知识"],
      },
      {
        file: "/biz/跨境支付/清结算体系/6_多币种账户体系与头寸管理-深度",
        title: "多币种账户体系与头寸管理（侧重收单）",
        wordCount: 5529,
        readMinutes: 17,
        excerpt: "系列第 6 篇 · 深度  上一篇 5多币种与汇率定价权 讲了 5 币种 + 3 汇率策略。本篇深入跨境支付公司如何为商户设计账户——单钱包 / 多钱包 / 单…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/12_结算引擎与出款调度-深度",
        title: "结算引擎与出款调度（深度）",
        wordCount: 5528,
        readMinutes: 17,
        excerpt: "系列第 12 篇 · 深度  上一篇 11清分引擎设计与规则引擎 讲了钱怎么分（按 MDR 拆成 4 部分）。本篇讲钱怎么出去——结算引擎从 0 到 1 实现，…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/15_拒付退款与资金逆向-深度",
        title: "拒付、退款与资金逆向（深度）",
        wordCount: 5417,
        readMinutes: 17,
        excerpt: "系列第 15 篇 · 深度  上一篇 14外汇风险与汇兑损益管理 讲了外汇怎么管。本篇继续第五层 · 风险与合规——讲拒付与退款——拒付四阶段（CB / RD …",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/3_跨境参与方全景与利益博弈-深度",
        title: "跨境参与方全景与利益博弈（侧重收单）",
        wordCount: 6507,
        readMinutes: 20,
        excerpt: "系列第 3 篇 · 深度  上一篇 2清算 vs 结算与资金权属 讲过清算 / 结算的法律时点。本篇把镜头拉远——讲清这笔跨境支付从买家卡里到卖家账户里，钱经过…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/9_跨境对账三层体系-深度",
        title: "跨境对账三层体系（侧重收单）",
        wordCount: 5196,
        readMinutes: 16,
        excerpt: "系列第 9 篇 · 深度  上一篇 8跨境账务体系四态模型 讲了钱在系统里怎么记账。本篇讲钱怎么对账——通道对账（外部）/ 系统对账（内部）/ 银行对账（资金）…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/7_跨境对账与结算-架构设计",
        title: "跨境对账与结算：三方模型、换汇与差异处理",
        wordCount: 1021,
        readMinutes: 3,
        excerpt: "一句话定义：跨境对账 = 收单机构 vs 卡组织 vs 收单行 三方逐笔核对。任何一方对不平都不能结算。跨境结算比国内多两件事：换汇和外管申报。 | 维度 | …",
        tags: ["跨境支付","对账","结算","换汇","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/9_风控与合规-跨境监管框架",
        title: "跨境风控与合规：3DS、拒付率、反洗钱与制裁筛查",
        wordCount: 936,
        readMinutes: 3,
        excerpt: "一句话定义：跨境风控 = 3DS 认证（事前）+ 实时风控（事中）+ 拒付处理（事后）。合规 = AML/KYC + 制裁名单筛查 + 外管申报。风控太松 → …",
        tags: ["跨境支付","风控","3DS","拒付","AML","合规","业务知识"],
      },
      {
        file: "/biz/跨境支付/清结算体系/16_跨境合规与监管口径演变-全景",
        title: "跨境合规与监管口径演变（全景）",
        wordCount: 5970,
        readMinutes: 19,
        excerpt: "系列第 16 篇 · 全景  上一篇 15拒付、退款与资金逆向 讲了拒付与退款怎么管。本篇是第五层 · 风险与合规的最后一篇——讲跨境合规——217 号文 / …",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/7_跨境清分模型与MDR拆解-深度",
        title: "跨境清分模型与 MDR 拆解（侧重收单）",
        wordCount: 5399,
        readMinutes: 17,
        excerpt: "系列第 7 篇 · 深度  上一篇 6多币种账户体系与头寸管理 讲了商户账户和公司头寸。本篇深入「钱进来之后怎么分」——一笔支付从商户看是 2.5% 的总成本，…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/19_跨境清结算进化论与未来展望-全景",
        title: "跨境清结算进化论与未来展望（收官 · 全景）",
        wordCount: 7226,
        readMinutes: 23,
        excerpt: "系列第 19 篇 · 全景 · 收官  上一篇 18跨境清结算平台演进路线 讲了 4 阶段演进路线。本篇是清结算 19 篇专题的收官之作——讲跨境清结算进化论 …",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/18_跨境清结算平台演进路线-链路",
        title: "跨境清结算平台演进路线（链路）",
        wordCount: 5793,
        readMinutes: 18,
        excerpt: "系列第 18 篇 · 链路  上一篇 17跨境清结算十大踩坑实录 讲跨境清结算十大踩坑。本篇是第六层 · 踩坑与演进的第二篇——讲跨境清结算平台演进路线——MV…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/1_跨境清结算全景-深度",
        title: "跨境清结算全景（侧重收单）",
        wordCount: 4924,
        readMinutes: 15,
        excerpt: "系列第 1 篇 · 深度  上一篇 0全局架构与专家视角 给出了跨境清结算的整体心智模型。本篇把它展开——从「跨境 vs 国内」的 12 个本质差异，到「收单侧…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/17_跨境清结算十大踩坑实录-实战",
        title: "跨境清结算十大踩坑实录（实战）",
        wordCount: 7474,
        readMinutes: 23,
        excerpt: "系列第 17 篇 · 实战  上一篇 16跨境合规与监管口径演变 讲了跨境合规五大监管口径。本篇是第六层 · 踩坑与演进的第一篇——讲跨境清结算十大踩坑实录——…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/2_参与方全景-9类角色拆解",
        title: "跨境收单的 9 类参与者：谁在赚钱，谁在扛风险",
        wordCount: 1879,
        readMinutes: 6,
        excerpt: "一句话定义：跨境收单不是两个人（用户和商户）的事。一笔 VISA 卡交易跨越 3 个国家、经过 6 个机构、涉及 9 类参与者。搞懂每个角色干什么、赚什么钱、扛…",
        tags: ["跨境支付","收单","角色","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/13_订单生命周期-状态机与逆向",
        title: "跨境收单订单生命周期：从下单到销户的完整状态机",
        wordCount: 822,
        readMinutes: 3,
        excerpt: "一句话定义：一笔跨境订单不是「付了就是成功」。它有正向（下单→支付→结算）和逆向（取消/退款/撤销/冲正/拒付）两条路径，共 9+ 个关键状态节点。 | | 正…",
        tags: ["跨境支付","订单","状态机","退款","拒付","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/14_核心功能用例-12个场景",
        title: "跨境收单核心功能用例：12 个标准化场景",
        wordCount: 569,
        readMinutes: 2,
        excerpt: "一句话定义：跨境收单平台提供 12 个核心功能——进件、配置、支付、退款、对账、提款、发票、报表、风控、通知、汇率、查单。每个功能一个标准用例模板。 |  | …",
        tags: ["跨境支付","功能用例","产品","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/4_业务模式-费率与分润深度",
        title: "跨境收单业务模式：聚合 vs 直连，费率与分润深度拆解",
        wordCount: 1390,
        readMinutes: 4,
        excerpt: "一句话定义：跨境收单有三种主流模式——聚合收单（如 Stripe）、直连卡组织（如直接签约 VISA）、本地收单（在当地有牌照）。选哪种取决于你的交易量、技术能…",
        tags: ["跨境支付","收单","业务模式","费率","分润","业务知识"],
      },
      {
        file: "/biz/跨境支付/清结算体系/8_跨境账务体系四态模型-深度",
        title: "跨境账务体系四态模型（侧重收单）",
        wordCount: 4926,
        readMinutes: 15,
        excerpt: "系列第 8 篇 · 深度  上一篇 7跨境清分模型与 MDR 拆解 讲了钱怎么分（interchange / assessment / processor / …",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/18_多币种路径-4层币种口径",
        title: "跨境支付多币种路径：4层币种口径与换汇流转",
        wordCount: 719,
        readMinutes: 2,
        excerpt: "一句话定义：一笔跨境交易涉及 4 层币种——交易币种、清算币种、结算币种、入账币种。每一层换汇都产生汇损，理解这 4 层才能算清一笔跨境交易到底多少钱。 | 层…",
        tags: ["跨境支付","多币种","换汇","DCC","币种","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/12_支付方式与交易类型矩阵",
        title: "跨境支付能力全景：7 种支付方式 × 10 种交易类型",
        wordCount: 1033,
        readMinutes: 3,
        excerpt: "一句话定义：跨境支付不止 VISA 卡。7 种支付方式（钱包/卡/网银/BNPL/现金/转账/加密）× 3 种场景（线上/线下/O2O）× 10 种交易类型（P…",
        tags: ["跨境支付","支付方式","能力矩阵","业务知识"],
      },
      {
        file: "/biz/跨境支付/清结算体系/0_跨境清结算全局架构与专家视角-全景",
        title: "跨境支付清结算全局架构与专家视角（侧重收单）",
        wordCount: 4780,
        readMinutes: 15,
        excerpt: "系列导读（开篇第 0 篇）  清结算专题共 19 篇，本篇是系列导读。  读完本篇，再去读 118 任意一篇，都知道「为什么这篇存在」「它在全局里扮演什么角色」…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/0_跨境支付全景与核心概念-全景",
        title: "跨境支付全景与核心概念（全景）",
        wordCount: 6167,
        readMinutes: 19,
        excerpt: "系列第 0 篇 · 全景 · 系列开篇  上一篇 19跨境清结算进化论 讲了清结算专题收官。本篇是浅析业务 19 篇专题的开篇——讲跨境支付全景——国内 vs …",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/1_概述-10分钟入门",
        title: "跨境支付收单：技术人 10 分钟入门",
        wordCount: 1348,
        readMinutes: 4,
        excerpt: "一句话定义：跨境支付收单 = 让境外消费者用他们习惯的支付方式（VISA、Mastercard、本地钱包），在中国商户的网站或 App 上付款，钱最后换成人民币…",
        tags: ["跨境支付","收单","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/PROGRESS",
        title: "浅析业务进度（PROGRESS）",
        wordCount: 3213,
        readMinutes: 10,
        excerpt: "19 篇专题 · 业务入门 · 从零开始  上一篇 清结算体系进度 — 19 篇清结算专题已完成（19/19 = 100%）  本篇是浅析业务 19 篇专题的进…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/11_清分引擎设计与规则引擎-深度",
        title: "清分引擎设计与规则引擎（深度）",
        wordCount: 4552,
        readMinutes: 14,
        excerpt: "系列第 11 篇 · 深度  上一篇 10清结算系统架构与模块边界 讲了五大模块边界。本篇深入清分引擎怎么从 0 到 1 实现——规则引擎（自研 DSL vs …",
        tags: [],
      },
      {
        file: "/biz/国内支付/1_清结算体系",
        title: "清结算体系：一笔支付钱的\"后半场",
        wordCount: 3473,
        readMinutes: 11,
        excerpt: "一句话定义：清算是算账——谁该给谁多少钱；结算是转账——把钱真正打过去。清结算是支付交易的\"后半场\"，用户无感知，但占支付机构 80% 的运营成本。 你微信扫码…",
        tags: ["支付","清结算","国内支付","业务知识"],
      },
      {
        file: "/biz/跨境支付/清结算体系/PROGRESS",
        title: "清结算体系专题进度与画像深度",
        wordCount: 3955,
        readMinutes: 12,
        excerpt: "专题进度文档（与 19 篇文章同目录）  这份文档沉淀「19 篇清结算专题」的整体规划、已完成 15 篇的一句话核心、画像锚点深度统计、写作方法论沉淀，以及后续…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/10_清结算系统架构与模块边界-全景",
        title: "清结算系统架构与模块边界（全景）",
        wordCount: 4769,
        readMinutes: 15,
        excerpt: "系列第 10 篇 · 全景  上一篇 9跨境对账三层体系 讲了钱怎么对账。本篇进入第四层 · 架构与系统——讲清清结算系统怎么从 0 到 1 落地——五大模块（…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/2_清算vs结算与资金权属-深度",
        title: "清算 vs 结算与资金权属（侧重收单）",
        wordCount: 5195,
        readMinutes: 16,
        excerpt: "系列第 2 篇 · 深度  上一篇 1跨境清结算全景 讲过资金链路有 8 个关键节点。本篇聚焦其中最容易被入门读者混淆的两个时点——清算（Clearing）和结…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/11_全局架构设计-跨境收单系统全景",
        title: "全局架构设计：跨境收单系统全景与从零搭建决策清单",
        wordCount: 923,
        readMinutes: 3,
        excerpt: "一句话定义：跨境收单系统 = 接入层 + 交易层 + 通道层 + 风控层 + 结算层 + 商户层。每层独立演进、独立部署、独立故障隔离。从零搭建的核心决策：直连…",
        tags: ["跨境支付","架构设计","系统设计","技术架构","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/5_收单系统架构-模块与部署",
        title: "收单系统架构：从功能模块到部署拓扑",
        wordCount: 1482,
        readMinutes: 5,
        excerpt: "一句话定义：收单系统不是一块巨石。它至少分 6 层——接入层、交易层、通道层、风控层、结算层、商户层。每一层独立演进、独立故障隔离。 | 组件 | 职责 | 技…",
        tags: ["跨境支付","收单","系统架构","技术架构","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/4_收单系统架构全景-全景",
        title: "收单系统架构全景（全景）",
        wordCount: 6000,
        readMinutes: 20,
        excerpt: "系列第 4 篇 · 全景  上一篇 3业务模式与费率分润深度 讲了 3 大模式 + 5 项费率 + 分账模型。本篇是第三层 · 架构与系统的第一篇——讲收单系统…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/6_通道管理与路由-深度",
        title: "通道管理与路由：从原理到实践的深度拆解",
        wordCount: 1142,
        readMinutes: 4,
        excerpt: "一句话定义：通道 = 收单系统对接的「具体支付路径」。选错通道 = 多花钱、少覆盖、高故障率。通道管理 = 接入 → 测试 → 上线 → 监控 → 降级 → 下…",
        tags: ["跨境支付","通道","路由","业务知识"],
      },
      {
        file: "/biz/跨境支付/清结算体系/14_外汇风险与汇兑损益管理-深度",
        title: "外汇风险与汇兑损益管理（深度）",
        wordCount: 5459,
        readMinutes: 17,
        excerpt: "系列第 14 篇 · 深度  上一篇 13对账引擎设计与差错自愈 讲了钱怎么对账。本篇进入第五层 · 风险与合规——讲外汇风险——结算汇差 / 头寸汇差 / 调…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/2_外卡支付链路与13时点-深度",
        title: "外卡支付链路与 13 时点（深度）",
        wordCount: 5269,
        readMinutes: 16,
        excerpt: "系列第 2 篇 · 深度  上一篇 1参与方全景与利益博弈深度 讲了 9 类参与方 + 3 维度框架 + 议价权 + 风险归属。本篇是第二层 · 交易链路与时点…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/3_外卡支付链路-从授权到结算",
        title: "外卡支付全流程：一笔 VISA 卡的钱怎么到你账上",
        wordCount: 1493,
        readMinutes: 5,
        excerpt: "一句话定义：外卡支付 = 境外消费者用 VISA/Mastercard 在中国商户网站付款，钱经过 6 个机构、换一次汇，T+3~T+7 到商户账上。 很多人以…",
        tags: ["跨境支付","收单","交易流程","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/15_线上支付全流程-PC收银台与H5",
        title: "线上支付全流程：PC收银台、H5与APP内支付",
        wordCount: 548,
        readMinutes: 2,
        excerpt: "一句话定义：线上支付分三种形态——PC收银台（浏览器跳转）、H5支付（移动网页）、APP内支付（JSAPI唤起钱包）。每种形态的技术实现和用户体验完全不同。 |…",
        tags: ["跨境支付","线上支付","收银台","H5","APP","业务知识"],
      },
      {
        file: "/biz/跨境支付/浅析业务/3_业务模式与费率分润-深度",
        title: "业务模式与费率分润（深度）",
        wordCount: 5378,
        readMinutes: 17,
        excerpt: "系列第 3 篇 · 深度  上一篇 2外卡支付链路与13时点深度 讲了 4 阶段 + 13 时点 + 5 分钟定位 SOP。本篇是第二层 · 交易链路与时点的第…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/清结算体系/4_一笔跨境支付的13个时点-深度",
        title: "一笔跨境支付的 13 个时点（侧重收单）",
        wordCount: 5440,
        readMinutes: 17,
        excerpt: "系列第 4 篇 · 深度  上一篇 3跨境参与方全景与利益博弈 讲了 9 类参与方怎么博弈。本篇把它落到具体时序——讲清一笔跨境支付从买家点击支付到卖家收到人民…",
        tags: [],
      },
      {
        file: "/biz/跨境支付/浅析业务/16_POS刷卡支付-终端与卡组织",
        title: "POS刷卡支付：终端、EMV芯片与卡组织交互",
        wordCount: 429,
        readMinutes: 1,
        excerpt: "一句话定义：POS刷卡支付 = CP（Card Present）模式。和线上卡支付最大的区别是多了物理终端——POS机负责读卡、输PIN、和卡组织交互。EMV芯…",
        tags: ["跨境支付","POS","EMV","NFC","线下支付","业务知识"],
      },
    ],
  },
  {
    key: 'data',
    icon: '▥',
    label: "数据 & 中间件",
    description: "MySQL、Redis、Elasticsearch、消息队列、缓存设计。",
    articles: [
      {
        file: "/data/rocketmq/事务消息/1_transactional-message",
        title: "RocketMQ 事务消息：分布式事务的工程实践",
        wordCount: 2753,
        readMinutes: 9,
        excerpt: "在「写业务单 + 通知下游」必须强一致的链路里，事务消息是工程上最常用的解法。  这篇文章讲清楚 RocketMQ 事务消息怎么解决这个问题，包括原理、实战、踩…",
        tags: ["数据 & 中间件","分布式事务","RocketMQ","消息中间件"],
      },
    ],
  },
  {
    key: 'practice',
    icon: '⚙',
    label: "工程实践",
    description: "Git、测试、Code Review、调试、编码规范与工具链。",
    articles: [
      {
        file: "/practice/tools/1工具安装",
        title: "hermes",
        wordCount: 19,
        readMinutes: 1,
        excerpt: "curl fsSL https://raw.githubusercontent.com/NousResearch/hermesagent/main/script…",
        tags: [],
      },
    ],
  },
]

const activeKey = ref<string>(props.filter || 'all')

const visibleSections = computed<Section[]>(() => {
  if (activeKey.value === 'all') return sections
  return sections.filter((s) => s.key === activeKey.value)
})

const showFilters = computed(() => !props.filter)

const totalArticles = computed(() => sections.reduce((s, x) => s + x.articles.length, 0))
const totalWords = computed(() => sections.reduce((s, x) => s + x.articles.reduce((a, b) => a + b.wordCount, 0), 0))
const totalMinutes = computed(() => sections.reduce((s, x) => s + x.articles.reduce((a, b) => a + b.readMinutes, 0), 0))

function setActive(key: string) {
  activeKey.value = key
}
</script>

<template>
  <div class="toc-page">
    <div class="toc-stats">
      <span><strong>{{ sections.length }}</strong> 个分类</span>
      <span><strong>{{ totalArticles }}</strong> 篇文章</span>
      <span><strong>{{ totalWords.toLocaleString() }}</strong> 字</span>
      <span>预计阅读 <strong>{{ totalMinutes }}</strong> 分钟</span>
    </div>

    <div v-if="showFilters" class="toc-filters">
      <button
        type="button"
        class="toc-filter"
        :class="{ active: activeKey === 'all' }"
        @click="setActive('all')"
      >
        全部
      </button>
      <button
        v-for="s in sections"
        :key="s.key"
        type="button"
        class="toc-filter"
        :class="{ active: activeKey === s.key }"
        :style="{ '--toc-color': COLOR_MAP[s.key] || '#10b981' }"
        @click="setActive(s.key)"
      >
        <span class="filter-icon">{{ s.icon }}</span>
        <span>{{ s.label }}</span>
        <span class="filter-count">{{ s.articles.length }}</span>
      </button>
    </div>

    <div v-for="s in visibleSections" :key="s.key" class="toc-section">
      <div class="toc-section-header">
        <h2 class="toc-section-title">
          <span class="toc-section-icon">{{ s.icon }}</span>
          <span>{{ s.label }}</span>
          <span class="toc-section-count">{{ s.articles.length }} 篇</span>
        </h2>
        <p class="toc-section-desc">{{ s.description }}</p>
      </div>
      <ul class="toc-articles">
        <li v-for="a in s.articles" :key="a.file" class="toc-article">
          <a :href="joinPath(base, a.file)" class="toc-article-title">{{ a.title }}</a>
          <div class="toc-article-meta">
            <span>⏱ {{ a.readMinutes }} 分钟</span>
            <span class="dot">·</span>
            <span>{{ a.wordCount.toLocaleString() }} 字</span>
          </div>
          <p v-if="a.excerpt" class="toc-article-excerpt">{{ a.excerpt }}</p>
        </li>
      </ul>
    </div>

    <div v-if="visibleSections.length === 0" class="toc-empty">
      该分类暂无内容。
    </div>
  </div>
</template>

<style scoped>
.toc-page {
  margin: 8px 0 32px;
}
.toc-stats {
  margin: 16px 0 24px;
  padding: 14px 18px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.toc-stats strong {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.toc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 24px;
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.toc-filter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
}
.toc-filter:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.toc-filter.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
}
.filter-icon {
  font-size: 14px;
}
.filter-count {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}
.toc-filter.active .filter-count {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}
.toc-section {
  margin: 32px 0;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--vp-c-divider);
}
.toc-section:last-child {
  border-bottom: none;
}
.toc-section-header {
  margin-bottom: 12px;
}
.toc-section-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}
.toc-section-icon {
  font-size: 22px;
  color: var(--vp-c-brand-1);
}
.toc-section-count {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-weight: 400;
  margin-left: 4px;
}
.toc-section-desc {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.toc-articles {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}
.toc-article {
  padding: 12px 0;
  border-top: 1px solid var(--vp-c-divider);
}
.toc-article:first-child {
  border-top: none;
}
.toc-article-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.toc-article-title:hover {
  text-decoration: underline;
}
.toc-article-meta {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  display: flex;
  gap: 6px;
  align-items: center;
}
.toc-article-meta .dot {
  color: var(--vp-c-text-3);
}
.toc-article-excerpt {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
.toc-empty {
  text-align: center;
  padding: 48px 0;
  color: var(--vp-c-text-2);
}
</style>