---
---
title: "10 Trade-off与生产演进"
type: reference
tags: [AI, RAG, 整合层, L4-Demo]
date: 2026-09
wordCount: 3500
readMinutes: 11
---
---\n\n# §10 Trade-off 与生产演进

**5W 速记卡**：
- **What**：5 个维度的 Trade-off 分析 + 生产演进路径
- **Why**：理解取舍才能做决策，不是所有高级方案都值得用
- **Who**：要做生产级 RAG 系统的工程师
- **When**：架构设计阶段（选型前必读）
- **Where**：分块/检索/向量化/LLM/框架 五个维度


**自测三问**：
1. 本文核心机制：每个决策都有「本 demo 选择」vs「替代方案」vs「为什么」
2. 失效点：为高级而高级（rerank 不是免费的，GraphRAG 成本高）
3. 与上篇衔接：trade-off ← 架构亮点（决策依据）


---

## 一句话摘要

5 维度展开 + 演进路径。

> **系列**：从零开始写一个 RAG 生产系统（整合层 demo 工程）

---

## 10.1 为什么这样实现

**分块用递归分块**：
- 固定大小：简单但可能切断语义
- 递归分块：段落 → 句子 → 固定大小，兼顾语义 + 精度

**检索用混合检索**：
- 向量检索：语义相似，但有漏检
- 关键词检索：精确匹配，但无语义
- 混合：互补提升精度

**生成用 LLM API**：
- 本地模型：隐私好，但精度低
- API：精度高，但有成本/网络依赖
- 选 API：生产优先精度

## 10.2 原理

**RAG 核心原理**：
1. **检索**：从知识库找到相关上下文
2. **增强**：将上下文拼进 prompt
3. **生成**：LLM 基于上下文生成回答

**为什么能减少幻觉**：
- LLM 有知识库上下文可参考
- 不再靠「记忆」回答
- 回答可溯源

## 10.3 实现

**代码结构**：
```
rag-production-system/
├── docs/           # 原始文档
├── chunks/         # 分块结果
├── vectors/        # 向量存储
├── index/          # 关键词索引
└── pipeline.py     # 全链路编排
```

**核心模块**：
- `loader.py`：文档加载
- `chunker.py`：分块
- `embedding.py`：向量化
- `vector_store.py`：向量存储
- `retriever.py`：检索
- `reranker.py`：重排
- `generator.py`：生成
- `pipeline.py`：全链路编排

## 10.4 替代方案

| 决策 | 本 demo | 替代方案 | 替代为什么 |
|---|---|---|---|
| 向量化 | OpenAI API | BGE 本地 | 隐私/成本 |
| 向量存储 | ChromaDB | Milvus | 规模/运维 |
| 检索 | 混合检索 | 纯向量 | 速度 |
| 重排 | Cross-encoder | 轻量重排 | 延迟 |
| LLM | OpenAI GPT | Claude/本地 | 生态/隐私 |
| 框架 | 无（从零） | LangChain | 速度/生态 |
\n## 10.5 生产路径

**V1 白盒 → V2 换组件 → V3 服务化 → V4 生产级**：

| 阶段 | 改什么 | 不改什么 | 状态 |
|---|---|---|---|
| V1 | 从零手写全链路 | 骨架 | ✅ 本 demo |
| V2 | 换向量化/检索/重排 | 流程 | 🔜 |
| V3 | API 化 + Web 界面 | 核心算法 | 🔜 |
| V4 | 多用户 + 并发 + 安全 | 架构 | 🔜 |

**骨架不动，血肉换新**——每次只调一个变量。

## 10.6 学习型 demo 的 trade-off

**本 demo 定位**：学习载体，不是生产系统

**刻意简化的**：
- 多轮对话：学习目的，先理解单轮
- 评估闭环：后续 V2 接入 RAGAS
- 权限控制：生产必备，demo 简化
- 审计日志：合规要求，demo 简化

**为什么手写**：
- 理解每个环节的「为什么」
- 以后用框架能看懂底层
- 遇到问题能排查

## 10.7 生产演进要点

1. **代码重构**：模块化 + 类型注解 + 错误处理
2. **测试覆盖**：单元测试 + 集成测试 + RAGAS 评估
3. **部署上线**：Docker + K8s + 可观测
4. **持续迭代**：监控 + 告警 + 自动扩缩

## 10.8 总结

本 demo 的核心 trade-off：
- **理解 vs 速度**：手写慢但理解深
- **精度 vs 延迟**：重排提升精度但增加延迟
- **成本 vs 效果**：API 精度高但有成本
- **可迁移 vs 便利**：从零不绑定框架但需自己补齐

**生产路径**：V1 白盒 → V4 生产级，骨架不动血肉换新。

---

## 数据与事实声明

- OpenAI text-embedding-3-small：行业认知，2026 年实测
- ChromaDB star：行业认知，2026 年实测
- Milvus star：行业认知，2026 年实测
- RAGAS：行业认知

## 参考资料

1. [LangChain](https://github.com/hwchase17/langchain)
2. [LlamaIndex](https://github.com/run-llama/llama_index)
3. [RAGFlow](https://github.com/infiniflow/ragflow)
4. [Dify](https://github.com/langgenius/dify)
5. [awesome-rag](https://github.com/hamelrahman/awesome-rag)
6. [RAG 论文](https://arxiv.org/abs/2005.11401)