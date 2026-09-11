---
title: 从零开始写一个 payment-rag-agent（整合层 demo 工程）
aside: false
wordCount: 2053
readMinutes: 6
---

# 从零开始写一个 payment-rag-agent

> **系列**：从零写一个「跨境收单支付业务问答」RAG agent（整合层 demo 工程）
> **目标**：理解 RAG 怎么运作 + 提高动手能力（**不是做出产品**）
> **业务方向**：跨境收单支付业务问答小助手——客服/运营/产品/用户四类角色高频重复提问，RAG 知识库问答承接，减轻研发和人工客服压力

---

## 📋 写作确认清单

**文章主题**：从零写一个「跨境收单支付业务问答」RAG agent
**所属分类**：docs/ai/整合层/agent/从零开始写一个payment-rag-agent/
**工程名（代码）**：payment-rag-agent-from-scratch（放 program-code-example/agent/，子目录隔离多实现）
**结果类型**：CLI 工具（检索→重排→生成闭环）
**业务场景**：跨境收单支付业务问答小助手——客服/运营/产品/用户问「费率怎么算」「结算周期多长」「拒付流程是什么」「汇率按哪个算」「为什么交易失败」等业务问题，agent 从知识库检索答案生成回答，**减轻研发和人工客服的重复答疑压力**
**目标读者**：想动手复刻 RAG demo 的工程师（延续 claude-code-cli 系列定位）
**参考对象**：
- 业务方向对齐 credit-java-agent-demo 的知识问答思路（跨场景通用：贷款→跨境支付）
- 技术实现从零复刻（不依赖 LangChain4j/LlamaIndex）
- 生态全景参考 awesome-llm-apps/rag_tutorials（134K★，25 个 RAG 教程覆盖全谱系）

**代码目录（子目录隔离多实现）**：
```
program-code-example/agent/payment-rag-agent-from-scratch/
├── python/
│   ├── from-scratch/         ← 从零实现（本次主写：TF-IDF + 余弦相似度，零依赖）
│   └── framework/            ← 框架实现（LlamaIndex/LangChain，后续）
├── java/
│   ├── from-scratch/         ← 从零实现（对齐 credit-java-agent-demo）
│   └── framework/            ← 框架实现（LangChain4j，后续）
└── ts/                       ← 可选扩展
    ├── from-scratch/
    └── framework/
```

**这篇文章要讲清楚什么：**
1. RAG 完整闭环：文档加载 → 分块 → 向量化 → 存储 → 检索 → 重排 → 生成（7 环节）
2. 纯 Python 从零实现，不依赖 RAG 框架（requests 唯一外部依赖，延续 claude-code-cli 风格）
3. 业务价值：跨境支付业务问答为什么需要 RAG（四类角色高频提问、知识更新快、防 LLM 幻觉、可溯源）

**涉及能力点：**
- 跨境支付业务知识库文档构建（费率/结算/拒付/汇率/交易异常，脱敏不涉公司）
- 分块策略（chunk 大小/重叠）
- TF-IDF 向量化（纯 Python，零外部依赖）
- 余弦相似度检索（纯 Python）
- 上下文组装与生成
- 检索评估（召回率/答案质量）

**需要哪些图：**
- [x] Mermaid 系统架构图（RAG 7 环节全景）
- [x] Mermaid 流程图（查询链路：query → 检索 → 重排 → 生成）
- [x] Mermaid 端到端时序图（一次问答完整调用链）
- [x] Mermaid 数据流图（文档摄入链路）
- [x] Mermaid 业务场景图（四类角色 → 重复问题 → RAG 承接）

**预计篇幅**：8000-12000 字（demo wiki 模板），重点 §3 架构 + §5 实现方案写深 4000+

**调研数据**（2026-08-23 gh CLI / GitHub 实测）：
```
LlamaIndex 51.8K★ | RAGFlow 89K★ | GraphRAG 35.6K★ | FAISS 40.8K★
pgvector 22.7K★ | anthropic-cookbook 52K★ | openai-agents-python 28.9K★
awesome-llm-apps 134K★（rag_tutorials 25 个教程，2 天前活跃更新）
```

**全谱系方向表（RAG 生态全景，本系列覆盖哪些）：**

| 技术方向 | 要讲清楚的问题 | 本系列 | 参考（awesome-llm-apps） |
|---|---|---|---|
| 基础 RAG | 最小闭环怎么搭？7 环节各自解决什么？ | ✅ 主写（§3/§5） | rag_chain / rag-as-a-service |
| 混合检索 | 关键词（TF-IDF）+ 向量怎么融合？ | ⚠️ §6 演进点到 | hybrid_search_rag / local_hybrid_search_rag |
| 纠正型 RAG | 检索结果差怎么办？怎么自动重查/换路？ | ⚠️ §6 演进点到 | corrective_rag |
| 智能体 RAG | 检索决策交给 agent 吗？多跳检索？ | ⚠️ §6 演进点到 | agentic_rag_gpt5 / autonomous_rag |
| 知识图谱 RAG | 实体关系怎么用？（GraphRAG 路线） | ⚠️ §10 trade-off 点到 | knowledge_graph_rag_citations |
| 本地部署 | 不调 API 行吗？本地模型/向量库？ | ⚠️ §10 trade-off 点到 | deepseek_local_rag_agent / qwen_local_rag |
| 专项（失败诊断） | RAG 答错怎么诊断？ | ⚠️ §10 trade-off 点到 | rag_failure_diagnostics_clinic |

> 本系列策略：基础 RAG 写深（从零实现），6 个演进方向在 §6/§10 点到（全谱系地图），后续可按需扩展独立篇。
> 代码目录用「子目录隔离多实现」：python/from-scratch 主写，framework/java 后续按子目录补。

**技术选型倾向（§3 展开 trade-off）：**
- 检索方式：纯 Python 实现 TF-IDF + 余弦相似度（先讲透原理）
- 向量化：TF-IDF 词频向量（零依赖，讲原理）；Embedding API 放 trade-off 对比
- 分块：递归字符分块
- 业务知识库：跨境支付通用业务知识（费率/结算/拒付/汇率/交易异常，脱敏不涉公司）

---

## 📋 H2 大纲（9 段 + §10）

### §1 为什么写（11 维价值论证）
真实业务锚点：跨境支付业务问答是 RAG 典型落地场景（四类角色高频提问、知识更新快、回答需可溯源、研发答疑压力大）

### §2 调研和对参考的思考
调研方法 + 能力点拆解表（含 awesome-llm-apps 25 教程分析 + Java demo 思路）

### §3 系统架构与技术选型
- 8 类图 + 功能用例 + 技术选型 trade-off（框架 vs 从零 / TF-IDF vs 向量 / API Embedding vs 本地模型）

### §4 可以学会什么
搭闭环 / 理解分块 / 实现检索 / 组装上下文 / 评估效果

### §5 实现方案与思考（上中下三篇）
```text
§5 上：5-1_实现方案与思考-上.md（最小闭环 + 全局地图 + 知识库分块）
  5.0 最小闭环（2 文件：知识库 → 检索 → 生成）
  5.1 全局地图（自上而下：7 文件 / 5 步数据流）
  5.2 跨境支付知识库构建与分块
§5 中：5-2_实现方案与思考-中.md（向量化 + 检索）
  5.3 TF-IDF 向量化（纯 Python，白盒）
  5.4 余弦相似度检索（检查链）
§5 下：5-3_实现方案与思考-下.md（组装 + 评估 + 验收）
  5.5 上下文组装与生成（带来源）
  5.6 评估（召回率/答案质量）
  5.7 组装（命令级）+ 5.8 结果验收
```

### §6 从 demo 到生产工具的演进之路思考
演进链：能力→功能用例→技术方案→流程→落地差距（生产=RAGFlow 级产品 + 知识库问答系统演进）

### §7 项目架构和亮点
最终架构图 + 4-5 亮点

### §8 项目文档建设
README / 贡献 / 已知问题 / roadmap

### §9 数据与事实声明 + 参考资料
star 数有来源（gh CLI）+ 日期（2026-08-23）

### §10 Trade-off 与生产演进
5 维（检索质量 vs 成本 / 分块粒度 / 向量库选型 / 重排必要性 / 评估方式）

---

## 📚 学习路线（先理解门道，再写代码）

> 写作顺序不是从 §1 开始，而是先建立 RAG 全景认知，再逐段推进。
> 每一段对应一个「搞懂的问题」，搞懂了再写。

| 阶段 | 搞懂的问题 | 对应章节 |
|---|---|---|
| ① 全景 | RAG 是什么？为什么需要检索而不是直接问 LLM？ | §1 + §2 |
| ② 原理 | TF-IDF 怎么算？余弦相似度怎么衡量「相关」？ | §3（原理部分） |
| ③ 环节 | 分块/向量化/检索/生成各环节解决什么问题？ | §3 + §5 |
| ④ 动手 | 最小闭环怎么跑通？每个环节代码怎么组织？ | §5 |
| ⑤ 演进 | demo 到生产差在哪？RAGFlow/LlamaIndex 怎么做的？ | §6 + §10 |
| ⑥ 沉淀 | 文档怎么建设？参考资料怎么留？ | §8 + §9 |

**先理解的核心概念（每个都要能用自己的话讲出来）：**
- [ ] RAG 是什么、为什么需要（幻觉/时效/溯源三个痛点）
- [ ] TF-IDF 原理（词频 × 逆文档频率，为什么稀有词更重要）
- [ ] 余弦相似度（向量夹角衡量相似，范围 [-1,1]）
- [ ] 分块为什么必要（LLM 上下文有限、检索粒度）
- [ ] 上下文组装（怎么把检索结果拼进 prompt）
- [ ] 重排（粗排 vs 精排，什么时候需要）
- [ ] 评估（召回率、答案质量怎么测）

---

## 关联文档

- 四件套（需求/specs/实施计划/交付报告）→ code-example/agent/payment-rag-agent-from-scratch/
- 9 段模板 → docs/conventions/project-demo-template.md
- 姊妹系列 → [从零开始写一个claude-code-cli](../从零开始写一个claude-code-cli/0_导读-全景.md)
