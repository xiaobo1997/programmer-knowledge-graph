---
title: RAG 检索增强生成：让 LLM 用上私有知识
author: xiaobo
level: 进阶
tags: [RAG, LLM, 向量数据库]
wordCount: 462
readMinutes: 1
test: true
---


# RAG 检索增强生成：让 LLM 用上私有知识

> RAG 解决的核心问题：**让 LLM 回答它训练时没见过的信息**。

## 为什么需要 RAG

- LLM 训练数据有截止时间
- LLM 不懂你的公司内部文档
- LLM 可能产生幻觉（编造答案）

## 工作流程

```
用户问题
  ↓
Embedding（向量化）
  ↓
向量数据库检索 top-K 相关文档
  ↓
拼成 Prompt（问题 + 文档片段）
  ↓
LLM 生成最终答案
```

## 关键组件

### Embedding 模型

把文本变成稠密向量：

```python
from openai import OpenAI

client = OpenAI()
vec = client.embeddings.create(
    model="text-embedding-3-small",
    input="什么是 RAG？"
).data[0].embedding
```

### 向量数据库

| 产品 | 特点 |
|---|---|
| Chroma | 轻量、Python 原生 |
| Milvus | 大规模、生产级 |
| Qdrant | Rust 实现、快 |
| pgvector | Postgres 插件、运维简单 |

### 检索策略

- **向量检索**：基于语义相似度
- **BM25**：基于关键词
- **混合检索**：两者结合，效果最好

## 进阶技巧

### 分块策略

文档不能整篇塞进去，要切块：

- **固定大小**：每 500 字一段
- **按段落**：保留语义完整性
- **滑动窗口**：前后各重叠 100 字

### 重排序 (Rerank)

先用向量检索 top-100，再用 reranker 模型重排取 top-5：

```
检索 → 粗排 100 → rerank → 精排 5 → LLM
```

### 查询改写

用户问题往往不完整，可以先让 LLM 改写：

```python
rewritten = llm(f"改写以下问题，使其更适合检索：{user_query}")
```

## 常见坑

- **Embedding 不匹配**：检索用 A 模型，文档入库用 B 模型
- **上下文太长**：超过 LLM 上下文窗口
- **答案在文档但没被检索到**：分块不合理

## 总结

RAG 是**让 LLM 用上私有知识**的标准方案。组件不复杂（Embedding + 向量库 + LLM），但要做好需要不断调优分块、检索、重排等环节。

## 参考

- LlamaIndex 文档
- LangChain RAG 教程