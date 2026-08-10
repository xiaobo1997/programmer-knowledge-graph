# AI 概念地图：从名词到体系

> 写给"每天被新名词淹没"的人——把今天 AI 工程领域的概念，按**为什么会出现**串成一张图。

---

## 一句话本质

> 智能（Agency）来自模型训练，不是来自代码。你能写出来的，是 **Harness（让模型能干活的基础设施）**。

过去两年冒出来的新词，**全部都在描述 Harness 的不同切面**。所以你不需要一个一个背，而是要理解"为什么要造这些词"。

---

## 第一层：模型本身（不可写，只能选/调）

| 概念 | 一句话 |
|---|---|
| **LLM** (Large Language Model) | 一个被训练出来"能说人话/写代码"的大模型。Claude、GPT、Gemini、Llama、Qwen 都是 LLM。 |
| **Token** | 模型能处理的最小文本单位。一个汉字 ≈ 1-2 个 token，一个英文单词 ≈ 1-3 个 token。**计费和窗口都按 token**。 |
| **Context** | 模型当前能"看到"的所有内容：系统提示 + 你的输入 + 历史消息 + 工具结果。 |
| **Context Window** | 模型一次能处理的最大 context 量。Claude 200K、GPT-4 128K、新模型到 1M+。**窗口越大 ≠ 越聪明**，越大反而越贵、越慢、越容易"中间忽略"。 |
| **Prompt** | 你给模型的指令。可以是 system prompt（人设/规则）、user prompt（任务）、tool prompt（工具描述）。 |

**底层事实**：模型在 cutoff 之后的世界一无所知，**不知道今天发生了什么**，**算不了精确数学**，**记不住昨天的对话**。所以下面所有概念，都是在解决这四个问题。

---

## 第二层：让模型"能干活"（核心是 Tool 和 Loop）

| 概念 | 一句话 |
|---|---|
| **Tool** | 给模型调用的函数。`search()`, `read_file()`, `run_sql()` 都是 tool。模型自己决定"要不要调、传什么参"。 |
| **Agent Loop** | `observe（看现状）→ think（想）→ act（调工具）→ observe（看结果）` 死循环，直到任务做完或步数超限。**所有 agent 都长这样**。 |
| **Agent** | 套了 Loop + Tool 的 LLM。它能自己规划多步，能根据中间结果改路线。 |
| **Workflow** | 固定流程的 LLM 调用图，决策点是写死的。**不是 agent**，是脚本。 |
| **Multi-Agent** | 多个 agent 分工，比如 planner → researcher → reviewer。**只在真有必要时用**，大多数场景单 agent + 工具就够了。 |
| **RAG** (Retrieval-Augmented Generation) | 让模型回答前先去搜你的私有资料/最新网页。解决"模型不知道/不新"的问题。 |
| **Memory** | 让 agent 跨会话"记得你"。短期（一个 session 内）靠 context，长期靠向量库/文件/数据库。 |
| **Context Engineering** | 怎么往 context 里塞正确的信息——不是越多越好，是"刚好够让模型做出好决策"。 |
| **Context Compaction** | context 满了之后做摘要压缩，保住核心、丢掉噪声。 |

**这一层解决**：模型不新、模型不记得、模型不会算、模型不会操作真实世界。

---

## 第三层：让 Agent "在生产里可靠"（这是 Harness 的本体）

这是过去一年冒出来最多新词的地方。

| 概念 | 一句话 |
|---|---|
| **Agent Harness** | 模型之外、让 agent 真正能跑起来的所有基础设施：tools + 上下文管理 + 权限 + 沙箱 + 日志 + 评测 + UI。**Claude Code 就是 harness 的范本**。 |
| **Harness Engineering** | 一种工程范式：你不是"在做 agent"，你是在"为模型造一个能干活的工作环境"。 |
| **Agent Harness Engineer** | 干这件事的工程师。和大模型训练师（做模型）是一对——一个改权重，一个改环境。 |
| **Permission / Sandbox** | 哪些工具能直接调、哪些要人工确认、哪些必须在隔离环境里跑。生产 agent 不加权限就是裸奔。 |
| **Hooks** | agent 关键节点（调工具前、拿到结果后）的回调。用来审计、注入、拦截。 |
| **Subagent** | 在主 agent 里开子 agent，每个子 agent 有自己的干净 context，干完把结论带回来。**避免主 context 被噪声淹没**。 |
| **Skill** | 可复用、可版本化、可分发的"能力包"——一份 SKILL.md 描述"什么时候用、怎么用、验收标准"，可能附带脚本和模板。**比 prompt 重，比 tool 轻**。 |
| **Eval / Evaluation** | 拿一组固定任务测 agent 成功率、工具调用次数、成本、延迟。**没 eval 的 agent 只是 demo**。 |
| **Observability / Trace** | 记录 agent 每一步的输入输出、用了什么工具、花了多少钱。**出错时复盘的唯一办法**。 |
| **Computer Use / Browser Use** | 让 agent 操控浏览器或桌面 GUI。本质是给模型加了"鼠标键盘"。**能用 API 就别用这个**。 |

**这一层解决**：模型在 demo 里很神，一上生产就翻车。

---

## 第四层：协议和生态（让不同 Agent/工具能"对话"）

| 概念 | 一句话 |
|---|---|
| **MCP** (Model Context Protocol) | Anthropic 2024 年底开源的协议。**让任意工具/数据源按统一格式接入任意 agent**。你可以理解为 agent 世界的 USB-C 协议。 |
| **MCP Server** | 暴露工具的服务端。比如一个能查你 GitHub 仓库的 server、一个能读本地文件的 server。 |
| **MCP Client** | 集成在 agent 里的客户端，能发现并调用 MCP server。 |
| **A2A** (Agent-to-Agent Protocol) | Google 推的，让不同 agent 跨厂商互相发任务和回结果。 |
| **ACP** (Agent Client Protocol) | 让 IDE / CLI / Web UI 这些"宿主应用"和背后的 agent 通信的标准。 |

**这一层解决**：每家公司自己一套接口，工具和 agent 接不上。

---

## 第五层：框架与基础设施（你听过名字的那些）

| 项目 | 一句话定位 |
|---|---|
| **LangChain** | 早期 LLM 应用全家桶。**现在很多团队已经迁出**，因为太重；但 LangSmith 还在用。 |
| **LangGraph** | LangChain 出的**有状态图编排**框架。适合需要明确步骤、回滚、可视化的场景。 |
| **LlamaIndex** | RAG 全家桶。索引、检索、引用做得比 LangChain 早。 |
| **AutoGen** (Microsoft) | 多 agent 编排框架。学术味重。 |
| **CrewAI** | 角色扮演式多 agent。**新手友好但生产慎用**——容易陷入"agent 互相客套"。 |
| **OpenAI Agents SDK** | OpenAI 2025 出的轻量多 agent 框架，主打 handoff。 |
| **Claude Code** | Anthropic 出的**终端 coding agent**。目前最被业内研究的 agent harness 范本。 |
| **Codex CLI / Cursor** | OpenAI 出的 coding agent 和 AI IDE。 |
| **OpenHands / Cline** | 开源 coding agent。 |

**这一层解决**：我不想从零写 loop，给我个能跑的开箱即用框架。

---

## 底层逻辑：为什么会有这些概念？

把所有名词压缩成一张因果链：

```
LLM 只会"续写" → 需要 Tool 才能影响真实世界 → 需要 Loop 才能多步干活
   → Loop 跑久了 context 会爆 → 需要 Context Engineering / Compaction
   → 多步任务会出错 → 需要 Eval / Trace / Hooks
   → 调工具太危险 → 需要 Permission / Sandbox
   → 每个项目都重写 Tool 累死 → 需要 MCP 标准化
   → 单 agent 有上限 → 需要 Multi-Agent / Subagent
   → 多 agent 互相不通 → 需要 A2A / ACP
   → 每次都重写 prompt → 需要 Skill
   → 这一切的集合 → Harness
   → 做 Harness 的工程师 → Harness Engineer
```

**所以你看到的所有新词，本质都是这一根链的不同环节。** 当你下次看到一个陌生名词时，问自己三句话：

1. 它在解决**这条链上**的哪一环？
2. 它是**新的解决方案**，还是**旧概念的新名字**？
3. 它在**生产里**有没有被验证？

如果三个问题都答不上来，**大概率是噪音**。

---

## 你给的四个仓库：怎么用

| 仓库 | 适合什么阶段 | 怎么用 |
|---|---|---|
| **datawhalechina/Agent-Learning-Hub** (6.5k⭐) | 中文系统学习 | 按它的 8 个 Stage 从上往下走。每完成一项打勾，**最有执行感**的一份路线图。 |
| **shareAI-lab/learn-claude-code** (73k⭐) | 想从 0 写一个 agent 出来 | 20 章节，从 50 行 loop 写到完整 harness。**边读边敲代码**，最快建立手感。 |
| **Picrew/awesome-agent-harness** (1.5k⭐) | 已经在做 agent，要扩视野 | 分类齐全的 awesome list，按 Harness Architecture / Context Engineering / Eval / Security 等 9 大类查。**当字典用**。 |
| **awslabs/mcp** (9.5k⭐) | 想给你的 agent 接工具 | AWS 官方出的 MCP server 集合。**直接照着写自己的 MCP server**。 |

**我的建议阅读顺序**：先 `learn-claude-code` 的 s01-s05（建立基本概念）→ 然后 `Agent-Learning-Hub` 的 Stage 0-3（建立体系）→ 然后 `awesome-agent-harness` 横向查（补深度）→ 最后 `awslabs/mcp` 选你需要的 server 接入。

---

## 长期信息源推荐

### 必看（一手 + 权威）

- **Anthropic Engineering Blog** — 写 harness 最深的一个团队。读 [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)、[Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)、[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)。
- **OpenAI Engineering Blog** — 模型、SDK、harness 都有。最近的 [Harness engineering](https://openai.com/index/harness-engineering/) 必看。
- **LangChain Blog** — Deep Agents、Context Engineering 实战经验丰富。
- **Cognition Blog** (Devin 团队) — Cloud Agent 基础设施怎么搭。

### 每天/每周扫（follow news）

- **Hacker News** (news.ycombinator.com) — AI 相关讨论质量最高，没有之一。
- **TLDR AI** (tldr.tech/ai) — 每天 5 分钟扫完。
- **The Rundown AI / Ben's Bites** — 商业化日报，适合看产业动向。
- **Import AI / Last Week in AI / Interconnects (Nathan Lambert)** — 学术 + 工业都讲。

### 中文圈

- **Datawhale**（就是你给的 hub 那个组织）— 教程质量稳。
- **机器之心 / 量子位** — 中文 AI 新闻最勤快。
- **赛博禅心** (yu-tiao.com) — 大模型实战 + 工具评测。
- **歸藏的 AI 工具箱** / **AI 产品榜** — 看新产品最快。

### GitHub 趋势

- **github.com/trending?since=daily** — 每天看一次 AI 分类（`topic:llm` `topic:agent` `topic:mcp`）。
- **github.com/topics/agent** — GitHub 自带的话题页。

### Twitter/X 必 follow

- **@AnthropicAI** / **@OpenAI** / **@sama** (Sam Altman) / **@karpathy** (Andrej Karpathy) / **@jxmnop** (Jack Morris) / **@hwchase17** (LangChain) / **@llaboratory** (Lance Martin)
- **@simonw** (Simon Willison) — 写 blog 速度最快，质量最高。
- **@drjimfan** (Jim Fan) — 具身 + agent 前沿。
- **@AmandaAskell** (Anthropic) — 提示词哲学。

### 论文

- **arxiv.org/list/cs.CL/recent** — NLP/LLM 论文每天更新。
- **arxiv-sanity.com** — 推荐过的版本。
- **Hugging Face Daily Papers** — 社区投票。

### 视频

- **Yannic Kilcher** (YouTube) — 论文精讲。
- **3Blue1Brown** — 深度学习可视化。
- **Andrej Karpathy** (YouTube) — 一年一两期，但每期都是神作。

### 播客

- **Latent Space** — AI 工程师圈层最硬核。
- **The TWIML AI Podcast** — 学术+工业访谈。
- **Lex Fridman Podcast** — 长访谈，嘉宾质量高。

---

## 给你的一个现实建议

AI 领域**现在最不缺的是新名词，最缺的是能写出来跑得动的人**。

- 别追名词，**挑一个具体的项目做**。可以是 learn-claude-code 的某个章节复刻、可以是一个 RAG 应用、可以是一个 MCP server。
- 每周固定扫一次 Hacker News + 一份 newsletter + 看一次 GitHub trending，**不要每天刷**。
- 看到新概念先用"它在链上哪一环"过滤一下，**70% 的噪音可以过滤掉**。
- 写下来比读进去重要。**做过的概念才是你的，没做过的全是浮云**。

---

> 整理：Mavis @ 2026-08-11
> 基于 GitHub API 实时数据 + 4 个指定仓库的 README 分析
