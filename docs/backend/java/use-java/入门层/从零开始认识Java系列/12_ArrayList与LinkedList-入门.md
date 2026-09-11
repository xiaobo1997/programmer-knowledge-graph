---
title: ArrayList与LinkedList
date: 2026-09-09
type: concept
tags: [Java, 集合]
wordCount: 2931
readMinutes: 9
---

# ArrayList 与 LinkedList

> **一句话摘要**：ArrayList（动态数组）与 LinkedList（双向链表）的经典对决，真实答案一边倒——**ArrayList 的连续内存 + 缓存友好在绝大多数场景碾压 LinkedList**：随机访问 O(1) vs O(n)、尾部追加均摊 O(1)、LinkedList 唯一赢面是「迭代中段插删 + 已定位位置」；本篇讲扩容机制（1.5 倍增长）与「教科书结论的工程修正」。

> **本文核心**：机制链 = **ArrayList = 数组 + size：容量与个数分离 → 满了 1.5 倍扩容（数组复制搬迁，O(n) 均摊到每次 add 就是均摊 O(1)）→ 中间插删 O(n)（搬移后续元素）→ 连续内存的缓存局部性是性能暗红利 → LinkedList = 双向链表：节点独立分配（每个节点额外两个引用开销）→ 理论插删 O(1) 但定位 O(n) + 缓存不友好**——扩容可预估、插删看位置、内存看局部性。

前置阅读：[集合框架总览](./11_集合框架总览-入门.md)。数组与内存的底层联动见[对象的一生](./27_对象的一生-入门.md)。

## 1. 背景：教科书结论的工程修正

教科书结论：「LinkedList 插删快，ArrayList 随机读快」。工程真相：

1. **「插删快」需要「已定位」**——LinkedList 在第 i 位插入前要先遍历定位（O(n)），定位后改指针 O(1) 的收益被定位成本吃掉大半；
2. **缓存局部性是隐形的大头**——ArrayList 连续内存对 CPU 缓存友好（预取有效），LinkedList 每个节点独立堆分配（地址跳跃，缓存命中率低）——实测遍历性能 ArrayList 常领先数倍；
3. **LinkedList 每个节点是一个对象**（prev/item/next 三引用）——同样的数据量内存开销数倍于 ArrayList。

行业共识：**默认 ArrayList；LinkedList 的现实使用场景其实非常窄**（已用迭代器定位的中段高频插删/纯队列语义——后者 ArrayDeque 更优）。

## 2. 核心机制：扩容与两个结构的代价模型

```mermaid
flowchart TD
    AL[ArrayList: Object[] + size] --> G1[add 尾部: 满则 grow<br/>新容量 = 旧容量 x 1.5 数组复制搬迁]
    G1 --> G2[均摊 O(1): 搬迁成本摊到历次 add]
    AL --> G3[中间插删: System.arraycopy 搬移后段 O n]
    G3 --> G4[预估容量: new ArrayList n 免多次扩容]
    LL[LinkedList: 双向链表] --> L1[节点: item + prev + next 三引用]
    L1 --> L2[头尾插删 O1 定位 O n<br/>get i 从近端折半找]
    L2 --> L3[内存开销 x3 引用 + 缓存不友好]
```

- **扩容机制**：ArrayList 满时扩到 1.5 倍（`oldCapacity + (oldCapacity >> 1)`）并 `Arrays.copyOf` 搬迁——单次扩容 O(n)，但按均摊分析，每 n 次 add 才触发一次搬迁，均摊每次 O(1)。**预估容量构造**（`new ArrayList<>(10000)`）则完全消除扩容搬迁——批量导入场景的第一优化。
- **中间插删的真实代价**：ArrayList 中间插入要 `arraycopy` 搬移后段所有元素——O(n)；LinkedList 定位 O(n) + 改指针 O(1)——两者都逃不掉 O(n)，**LinkedList 并没有「插删 O(1)」的免费午餐**（除非用迭代器在已定位位置操作）。
- **LinkedList 的节点开销**：每个元素额外 prev/next 两个引用 + 一个节点对象头——百万级元素时内存差距显著；GC 压力也随节点数上升（对象越多扫描越贵）。
- **ArrayDeque 才是队列正解**：需要双端队列语义时，ArrayDeque（循环数组）在头尾操作 O(1) 且缓存友好——「用 LinkedList 当队列/栈」是教科书时代的残留习惯（Java 官方文档也推荐 ArrayDeque）。

## 3. 落地实践：List 使用的工程纪律

1. **默认 ArrayList + 容量预估**：知道规模就传初始容量（数据库查询结果集、批量导入）。
2. **批量删除用 removeIf**：内部优化过的一致性处理，避免手写遍历删除的坑。
3. **遍历删除三选一**：`iterator.remove()` / `removeIf` / 倒序下标——正序 for+remove 是错误（跳元素 + fail-fast）。
4. **两个 List 的差集/交集**：小集合转 Set 做查找（O(n+m)），别双重循环 O(n×m)。
5. ** sublist 视图纪律**：需要独立子列表就 `new ArrayList<>(list.subList(a,b))`——视图联动语义太坑。
6. **不可变出口**：对外返回 `List.copyOf(list)` 或 `Collections.unmodifiableList`——防御外部篡改。

## 4. 生产视角：List 事故的形态

- **未预估容量的批量导入超时**：百万行导入，默认容量 10 起步——扩容搬迁 20 次（每次全量复制），加上 GC 压力，超时点不在 SQL 在扩容。整改一行：`new ArrayList<>(预计行数)`。
- **LinkedList 当队列导致内存翻倍**：消息缓冲用 LinkedList——节点三引用 + 对象头的开销让堆占用数倍于 ArrayDeque 方案，GC 扫描压力同步上涨。
- **Arrays.asList 的坑**：返回的 List 不支持 add/remove（定长视图）——把它当普通 List 传给会修改的下游，运行时 UnsupportedOperationException。
- **迭代中修改的业务事故**：遍历订单列表剔除某状态订单用 `list.remove(order)`——跳元素 + 可能 fail-fast，剔除结果不完整且无报错（倒序或 removeIf 才对）。这类「不报错但结果错」比抛异常更危险。

## 5. 主流系统怎么做：List 的生态扩展

| 场景 | 主流选择 | 机制要点 |
|---|---|---|
| 不可变列表 | List.of / Guava ImmutableList | 防篡改 + 免拷贝（内部结构紧凑） |
| 并发读多写少 | CopyOnWriteArrayList | 写时复制整数组，读完全无锁（第 16 篇） |
| 高频读写并发 | ConcurrentLinkedDeque / 加锁 ArrayList | 按「读多还是写多」与一致性要求选 |
| 大数据量流式 | 不进内存：流式/分页 | 百万级集合本身就是设计错误信号 |

规律：**List 问题的解法常在「要不要全部进内存」**——集合规模失控时的正确动作是改流式/分页，不是换实现。

## 6. 典型场景

- **查询结果承载**（通用级）：ArrayList + 初始容量——绝大占比的日常形态。
- **去重后的保序列表**（组合级）：LinkedHashSet 去重再回 ArrayList——组合而非硬选 LinkedList。
- **滑动窗口/栈/队列**（结构级）：ArrayDeque——LinkedList 的队列语义被 ArrayDeque 全面替代。

## 7. 与相邻概念的区别

- **ArrayList vs Vector**：Vector 全方法 synchronized（历史遗留，单线程白白加锁）——现代代码不用 Vector；并发需求直接并发容器。
- **ArrayList vs ArrayDeque**：位置访问 vs 双端操作——两个不同的语义承诺；「LinkedList 当 Deque」的替代答案是 ArrayDeque 不是 ArrayList。
- **List.of vs Arrays.asList**：真不可变 vs 定长视图——「不可变」与「不可增删但可 set」是两种语义。
- **本篇 vs ConcurrentHashMap（16 篇）**：单线程 List 的优化空间有限（选对实现+容量即到顶）；并发的收益空间在并发容器——瓶颈在哪去哪。

## 8. 常见误区与不适用

- **「LinkedList 插入删除快」**：前提是已定位——含定位全程并不快；多数场景是「理论快、实测慢」。
- **「ArrayList 扩容很慢要避免」**：扩容均摊 O(1)，只有「明确大规模」才值得预估容量——微场景的容量执念是过度优化。
- **「遍历删除要用 LinkedList」**：正确解法是 removeIf/迭代器——换实现不解决「正序 remove 跳元素」的逻辑错误。
- **「subList 是复制」**：是视图——父子联动是语义不是 bug，误用才是 bug。
- **不适用**：超大规模（内存集合本身是错）；原语高频（特化库）；强实时并发（并发容器）。

## 9. 你们可能会问

- **1.5 倍是怎么来的？** 增长过慢（如 1.1 倍）则扩容频繁，过快（如 2 倍以上）则内存浪费——1.5 是均衡点；HashMap 用 2 倍是因为哈希扩容要求 2 的幂（位运算取模）。
- **为什么 ArrayList 不能存基本类型？** 泛型擦除（第 8 篇）——只能存引用，int 自动装箱成 Integer；原语场景用特化库（Eclipse Collections 的 IntList）。
- **copyOf 和 unmodifiableList 差在哪？** copyOf 真复制一份不可变（原表后续变化不影响）；unmodifiable 是视图（原表变化它跟着变）——「不可变」与「不可改」的语义差异。
- **LinkedList 还有存在价值吗？** 已定位位置的迭代中插删（用 ListIterator.add）与教学价值——新代码的场景几乎都能被 ArrayList/ArrayDeque/CopyOnWriteArrayList 覆盖。
- **怎么实测两个实现的差距？** JMH 基准（预热+多轮），对比「遍历/尾部插入/中段插入」三操作——自己跑一遍比背十篇结论牢固（数据随 JDK 版本变化）。

## 10. 一句话总结 + 5W 速记卡 + 自测三问

**🎯 核心带走**：

- **核心一句话**：ArrayList = 数组 + 1.5 倍均摊扩容 + 缓存友好——默认答案；LinkedList = 节点三引用 + 定位 O(n) + 缓存不友好——现实使用面极窄；队列语义正解是 ArrayDeque。
- **链条复述**：容量与个数分离 → 满则 1.5 倍搬迁（均摊 O(1)）→ 预估容量免搬迁 → 中间插删两者都 O(n) → 缓存局部性让 ArrayList 遍历碾压。
- **失效点与边界**：迭代器已定位的中段插删 LinkedList 成立；原语批量走特化；超大规模走流式。

**5W 速记卡**：

| 维度 | 内容 |
|---|---|
| What | 扩容机制 + 两个结构代价模型 + ArrayDeque 替代论 |
| Why | 选错 List 实现的代价是内存翻倍与隐性超时 |
| When | 集合选型、批量导入、遍历删除、内存治理 |
| Where | 堆（数组或节点） |
| How | 默认 ArrayList → 容量预估 → removeIf 删除 → 不可变出口 |

💡 **实战提示**：批量导入传初始容量；正序 for+remove 是 bug；Arrays.asList 是视图；subList 拷贝后再用。

**开放问题**：Valhalla 值类型若让 ArrayList`<int>` 无装箱成真，「数组 vs 集合」的性能边界会重画——届时 LinkedList 的最后场景会消失吗？

**决策（何时用）**：新代码默认 ArrayList；队列/栈语义用 ArrayDeque；推荐「换实现前先跑 JMH」作为性能优化纪律（直觉在集合领域常错）。

**Trade-off（代价与反方案）**：ArrayList 用「中间插删 O(n) + 扩容搬迁」换「随机读 O(1) + 缓存友好」；LinkedList 用「节点内存 + 缓存劣势」换「已定位插删 O(1)」；预估容量用「一点内存」换「零扩容搬迁」——所有权衡都以基准实测收口，不以背诵收口。

**演进视角**：JDK 对 ArrayList 的优化（惰性初始化/扩容位移计算）持续微调，但「数组为主力」的结构自 1.2 未变——被演进淘汰的是 LinkedList 的使用率（教科书仍在教，工程已弃用），这本身就是一个值得记住的「教材滞后」案例。

---

**下篇预告**：Java 集合的顶梁柱——下一篇[HashMap 原理与演进](./13_HashMap原理与演进-入门.md)讲哈希扰动、红黑树化与扩容的完整机制。

---

## 上下游地图

从系统架构的上下游看：**集合总览** 为本篇提供了地基——扩容机制 的机制向上游承接、向下游 **HashMap(篇13)** 输出默认容器纪律；架构上它是这条知识链上不可跳过的一环，跳读时建议先回上游补齐语境。

```mermaid
flowchart LR
    U0[集合总览]
    --> ME[本篇: 扩容机制]
    ME --> DN0[HashMap(篇13)]
```

---

## 📌 数据与事实声明

ArrayList 扩容（1.5 倍）、LinkedList 结构、ArrayDeque 推荐为 JDK 官方文档与源码公开内容；缓存局部性导致的性能差距为公开基准讨论的共识量级（以自身 JMH 为准）；Effective Java 相关条目为第 3 版。以官方文档为准。

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 图书 | Java 核心技术 卷I（ArrayList/LinkedList 章节） | Pearson（2022） |
| 文档 | JDK 源码：ArrayList.grow / ArrayDeque | github.com/openjdk/jdk |
| 文档 | Java 官方教程：ArrayDeque 推荐 | docs.oracle.com |
| 系列文章 | HashMap 原理与演进（下一篇） | 本仓库同系列 |
