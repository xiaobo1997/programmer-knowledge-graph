---
wordCount: 277
readMinutes: 1
---
# 深入理解读写路径系列

> HBase 特性层系列：读写路径四大机制（WAL / MemStore / Bloom Filter / BlockCache）的深度拆解——每个参数为什么是这个值、坏了什么现象、怎么调。

## 文章清单

| 篇 | 主题 | 类型 | 状态 |
|---|---|---|---|
| 0 | [系列导读](0_系列导读-全景.md) | overview | ✅ |
| 1 | [WAL 机制与持久化等级](1_WAL机制与持久化等级-深度.md) | deep-dive | ✅ |
| 2 | [MemStore 与写路径调优](2_MemStore与写路径调优-深度.md) | deep-dive | ✅ |
| 3 | [Bloom Filter 与读加速](3_BloomFilter与读加速-深度.md) | deep-dive | ✅ |
| 4 | [BlockCache 与读缓存体系](4_BlockCache与读缓存体系-深度.md) | deep-dive | ✅ |

## 系列边界

- 写侧（WAL/MemStore）与读侧（Bloom/BlockCache）各两篇，机制细节不与入门层重复
- Compaction 策略调优候选独立系列；协处理器与 Phoenix 候选生态专题
- 上游依赖：[入门层](../../入门层/从零开始认识HBase系列/0_系列导读-全景.md)（模型/架构/RowKey/LSM 的概念底座）
