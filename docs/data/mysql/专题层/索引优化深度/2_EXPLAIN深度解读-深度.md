---
title: EXPLAIN 深度解读：把执行计划读成故事
type: deep-dive
tags: [数据存储, MySQL, EXPLAIN, 索引优化, 专题层]
date: 2026-09-08
wordCount: 2709
readMinutes: 8
---

# EXPLAIN 深度解读：把执行计划读成故事

> EXPLAIN 的十二列输出不是十二个孤立的字段，而是一条完整的叙事：**访问哪张表 → 用什么路径访问 → 预估多少行 → 拿到行之后还要做什么**。这篇把关键字段读成连贯故事，再用 EXPLAIN ANALYZE 把「计划」和「事实」对上账。

## 一句话摘要

EXPLAIN 的核心叙事链是 **`type`（访问路径等级）→ `key/rows`（用哪棵树、估多少行）→ `Extra`（拿到行之后的附加动作）**：type 从 system/const/eq_ref/ref/range/index/ALL 逐级变差，rows 是估算不是事实，Extra 里 `Using index`（覆盖）与 `Using filesort / Using temporary`（额外排序/临时表）是最该背下来的三个标记。**8.0 的 EXPLAIN ANALYZE 把估算换成真实执行统计，是「计划 vs 现实」对账的终极工具**。

## 🎯 本文核心

**核心一句话：执行计划是一条四段叙事——顺序（谁驱动谁）→ 路径（type 等级）→ 量（rows × filtered）→ 后续动作（Extra 标记）；rows 是估算不是事实，断点定位靠 EXPLAIN ANALYZE 对账真实执行。**

阅读链：id/select_type 定顺序 → type 定路径等级（乘上行数量级一起读）→ key/rows/filtered 定量与过滤位置 → Extra 定附加动作 → ANALYZE 对账。全文一句话可重构：「先读故事找断点，再对账定结论」——十二列不是十二个字段，是一句话的四个从句。

## 前置阅读

- 本目录篇 1《索引失效排查手册》：失效分类——EXPLAIN 是它的判定仪表盘
- 特性层《深入理解索引系列》篇 2：回表与覆盖——`Using index` 的机制来源

## 目标导向

本文是什么：EXPLAIN 字段级解读 + 真实执行对账方法。功能是什么：把看执行计划从「查表背字段」变成「读故事找断点」。能得到什么：type 等级的量级感、rows 与 filtered 的联合读法、Extra 高频标记的处置动作。为什么用：慢查询分析、上线前计划 diff、优化器行为评审，必看。

## 一、叙事主线：一条 SQL 的执行计划怎么读

```mermaid
flowchart LR
    A["看 id/select_type<br/>谁先执行"] --> B["看 type<br/>用什么路径摸到行"]
    B --> C["看 key/rows/filtered<br/>走哪棵树 估多少行 选后剩多少"]
    C --> D["看 Extra<br/>拿到行后还要做什么"]
    D --> E["EXPLAIN ANALYZE<br/>对账真实耗时"]
    style B fill:#ffd3a5
    style D fill:#ffaaa5
    style E fill:#a8e6a3
```

四段各答一个问题：**顺序**（多表谁驱动谁）、**路径**（全扫还是走树、树的哪一等）、**量**（估多少行、过滤后剩多少）、**后续**（回表？排序？建临时表？）。断点就在四段之中——先把故事读完，再动手改。

## 二、type 等级：一条「由好到坏」的谱系

| type | 含义 | 量级感 |
|---|---|---|
| const / system | 主键或唯一键等值，最多一行 | 微秒级 |
| eq_ref | 被驱动表按主键/唯一键等值关联 | 每次一行，理想 JOIN |
| ref | 普通索引等值 | 数行到数千行 |
| range | 索引范围扫描 | 千到万级，关注范围宽度 |
| index | 扫整棵索引树（比全表好的有限） | 索引全量 |
| **ALL** | 全表扫描 | 大表事故级 |

两条读法：一是**量级感**——从 ref 掉到 ALL 通常是数量级的恶化，从 range 掉到 index 却未必显著；二是 **JOIN 语境**——驱动关系是执行计划的架构骨架：谁驱动谁，决定每张表被访问的次数；被驱动表出现 ALL 几乎总意味着关联列缺索引。type 不是绝对分：小表 ALL 无伤大雅，大表 range 也可能因范围过宽而慢——**等级要乘上行数量级一起读**。谱系一眼版：

```mermaid
flowchart LR
    C["const / eq_ref<br/>单行定位"] --> R["ref / range<br/>小范围"] --> I["index<br/>扫整棵索引"] --> A["ALL<br/>全表扫描"]
    style C fill:#a8e6a3
    style R fill:#ffd3a5
    style A fill:#ff8b94
```

## 三、rows / filtered：估算与真实之间

- `rows`：优化器估算「这条路径要摸多少行」——**基于统计信息的猜测**，不是事实
- `filtered`：存储引擎返回的行里，预计有多少比例满足其余 WHERE 条件（百分比）——`rows × filtered%` 才是「预计交给上层的结果行数」。这个数字背后是引擎与 Server 层的上下游分工：引擎按索引交行，剩余条件在 Server 层过滤——filtered 偏低就是「本该下推进索引的活被留在了上游」。

两个高价值对账动作：**① rows 与真实行数对账**（`EXPLAIN ANALYZE` 的 actual rows）——偏差一个数量级说明统计过期，`ANALYZE TABLE` 后复查；**② filtered 异常低时看覆盖**——filter 在引擎外做，说明本该下推或覆盖的列没进索引，计算被搬到了 Server 层。

8.0 的直方图（`ANALYZE ... UPDATE HISTOGRAM`）能显著改善非索引列的选择性估算——对「统计失真类误判」是官方正解。

## 四、Extra：拿到行之后的附加动作

| 标记 | 含义 | 处置 |
|---|---|---|
| `Using index` | 覆盖索引，不回表 | 理想态，保持 |
| `Using index condition` | ICP 下推，减少回表 | 次优，可向覆盖演进 |
| `Using where` | Server 层再过滤 | 结合 filtered 看是否该进索引 |
| **`Using filesort`** | 需要额外排序 | 大结果集事故高发——建排序索引或限流 |
| **`Using temporary`** | 需要临时表（GROUP/DISTINCT/派生表） | 检查分组列索引与派生表改写 |
| `Using join buffer` | JOIN 无可用索引，用缓冲块硬关联 | 被驱动表补索引 |

filesort 不一定是「文件排序」——内存排序也叫这个名，但 **量大必然溢出磁盘**；temporary 同理。两者的共同治理思路：**让分组/排序列进入检索路径**（联合索引把 ORDER BY 列排在等值列之后），或用 LIMIT 缩小参与排序的行集。

## 五、EXPLAIN ANALYZE：从「计划」到「对账」

8.0.18 起的 `EXPLAIN ANALYZE` 真实执行并输出每步 actual time / actual rows / loops——三个高价值用法：

1. **估算 vs 真实对账**：estimated rows 偏一个数量级 → 统计问题，先 ANALYZE 再看
2. **时间花在哪一段**：树形输出逐行看 actual time 累计，断点一目了然（「90% 时间在 filesort」比「查询慢」有用一万倍）
3. **循环放大识别**：loops 巨大的行 = 被反复执行的子路径，JOIN 优化第一目标

**Trade-off 视角**：ANALYZE 会真执行语句——只读查询随便跑，DML 请包事务回滚或改用 `EXPLAIN FORMAT=TREE` 看结构。这是「信息收益 vs 执行风险」的显式取舍，工具链上下游各守各的边界：业内默认对线上 DML 不裸跑 ANALYZE。

## 六、典型场景：三组高频组合速查

- **`ref + rows=1 + Using index`**：教科书级好计划——等值 + 覆盖，无动作需要
- **`range + Using filesort + rows 大`**：范围扫完再排序——把排序列并入索引尾（等值列在前），或加 LIMIT 缩量
- **`ALL + Using join buffer`**：被驱动表裸奔——关联列补索引，一次补齐

## 业内惯例

> 💡 **实战提示**
> - 什么时候用哪个工具：日常看计划用 EXPLAIN（零风险）→ 疑似统计失真用 ANALYZE TABLE + 复查 → 要真实耗时定案用 EXPLAIN ANALYZE（只读随便跑，DML 包事务回滚）——三级工具按风险递进选择
> - 慢查询归因口诀「type 定级、Extra 定动作、ANALYZE 定断点」：三步走完，改写方向基本唯一
> - Extra 三个红色标记按治理优先级排：Using temporary（改造成本最高）> Using filesort（加排序列索引）> Using join buffer（补被驱动表索引）
> - 计划 diff 门禁盯三列：type 掉档、rows 骤增、新增 filesort/temporary——三项任一异常即拦截发布

- **上线门禁内嵌计划 diff**：发布平台自动比对变更 SQL 前后计划（type/rows/Extra 三项），异常即拦截——业内把「计划评审」前置成流水线环节
- **慢日志 + 计划归档联动**：慢查询触发时自动抓 EXPLAIN ANALYZE 存档，复盘有据可查
- **直方图按需给非索引列**：高价值过滤列建直方图，例行维护纳入 ANALYZE 计划——不必全表铺，按查询画像选列
- **FORMAT=TREE 进代码评审**：树形比表格直观，评审讨论以 TREE 输出为准——工具跟着人走

## 你们可能会问

**Q1：rows 估算准不准，到底信不信？**
统计新鲜时量级可信（用于判断数量级），精确值不可信（别拿它算容量）。要精确看 ANALYZE 的 actual rows——「估算找方向，对账定结论」。

**Q2：type=ALL 一定要优化吗？**
看量级与频率：小维表全扫是合理计划；大表高频 ALL 是事故预备役。「优化 ALL」之前先问「这张表多大、这条查询多频」——脱离量级谈等级是评审常见误区。

**Q3：Using filesort 有排序索引了还在？**
常见原因：排序方向混合（`ORDER BY a ASC, b DESC` 在 8.0 前无法用单一索引）、排序列不在索引内、或 WHERE 打断最左前缀。逐条对照联合索引列序排查，8.0 的 descending index 是混合方向的官方解。

## 七、自测三问

1. EXPLAIN 四段叙事各回答什么问题？
2. rows 和 filtered 怎么联合读？两者都是事实吗？
3. `Using index` / `Using filesort` / `Using temporary` 分别意味着什么、怎么处置？

## 开放问题

- 优化器代价模型在 8.0 后持续演进（直方图、学习型估计的社区讨论），EXPLAIN 输出的语义稳定性与工具链的适配是长期拉扯。
- EXPLAIN ANALYZE 的真实执行特性让「只读验证」与「写操作验证」必须分流，未来若出现沙箱级 dry-run，计划评审流程会再进化。

## 🎯 核心带走

- **核心一句话**：执行计划 = 四段叙事（顺序/路径/量/后续动作）；rows 是估算，断点定位靠 ANALYZE 对账真实执行
- **阅读链**：select_type → type 等级 × 行数量级 → rows × filtered → Extra 红色三标记 → ANALYZE
- **哪里会坏**：把 rows 当事实、ALL 脱离量级谈优化、filesort 大结果集溢盘、DML 裸跑 ANALYZE
- **边界**：本篇是「怎么读」；失效的「怎么修」在本目录篇 1，代价模型的机制推导在特性层索引系列

## 📌 数据与事实声明

- 写于 2026-09-08，字段语义以 MySQL 8.0 为基准；EXPLAIN ANALYZE 自 8.0.18 引入、直方图为 8.0 能力（官方口径）
- type 量级感与处置建议为业内经验归纳
- 免责：字段与行为细节以 dev.mysql.com 官方文档为准

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 官方文档 | EXPLAIN Output Format / EXPLAIN ANALYZE | dev.mysql.com/doc/refman/8.0/en/explain-output.html |
| 实战书 | 《高性能 MySQL（第 4 版）》查询优化章 | 公开出版 |
| 社区沉淀 | 各大厂公开的执行计划解读实践文章 | 技术社区公开文章 |
