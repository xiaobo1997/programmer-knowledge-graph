---
title: LLM Agent 入门：什么是 Agent
author: xiaobo
level: 入门
tags: [Agent, LLM]
wordCount: 359
readMinutes: 1
---

# LLM Agent 入门：什么是 Agent

> Agent 不是更聪明的聊天机器人，而是**能行动的智能体**。

## 什么是 Agent

一个 LLM Agent 由三部分组成：

1. **大脑**：LLM，负责推理和决策
2. **工具**：外部函数/API，让 Agent 能"动手"
3. **记忆**：对话历史 + 长期知识库

## 一个最小例子

```python
def get_weather(city: str) -> str:
    """查询城市天气"""
    return f"{city}今天晴，25℃"

agent = Agent(
    model="claude-sonnet",
    tools=[get_weather],
)

agent.run("深圳今天天气怎么样？")
# → Agent 决定调用 get_weather("深圳")
# → 得到结果，回复用户
```

## Agent 和 Chatbot 的区别

| 维度 | Chatbot | Agent |
|---|---|---|
| 输入 | 文本 | 任意 |
| 输出 | 文本 | 文本 + 行动 |
| 工具 | 无 | 多个外部函数 |
| 推理 | 单轮 | 多步循环 |
| 状态 | 无 | 有记忆 |

## ReAct 模式

最常见的 Agent 推理模式：

1. **Thought**：分析当前情况，决定下一步
2. **Action**：调用工具
3. **Observation**：拿到工具结果
4. 重复 1-3 直到能给出最终答案

## 常见踩坑

- **工具太多**：模型选错工具的概率上升。一般 3-10 个工具最稳
- **循环失控**：必须设最大步数，否则可能跑飞
- **错误处理**：工具调用失败时让模型重试或换路径

## 总结

Agent = LLM + 工具 + 记忆。理解这个公式，就理解了 80% 的 Agent 系统。下一步可以学 Function Calling、RAG、记忆机制。

## 参考

- ReAct 论文：https://arxiv.org/abs/2210.03629
- OpenAI Function Calling 文档