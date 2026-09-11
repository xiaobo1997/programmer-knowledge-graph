---
title: Queue与Deque与PriorityQueue
date: 2026-09-09
type: concept
tags: [Java, 集合]
wordCount: 2918
readMinutes: 9
---

# Queue/Deque 与 PriorityQueue

> **一句话摘要**：队列家族按「语义」三分——**Queue 的 FIFO（先进先出）、Deque 的双端（两头都可进出）、PriorityQueue 的按优先级出队（二叉堆实现，与入队顺序无关）**；ArrayDeque 是双端场景的性能王牌（循环数组），PriorityQueue 的「堆顶出队」支撑 TopN/调度类需求；本篇讲清三者的语义边界与选型，并发阻塞队列归 16/25 篇。

> **本文核心**：机制链 = **Queue 两组 API（抛异常 add/remove vs 返回值 offer/poll）→ Deque 双端语义（ArrayDeque 循环数组实现：头尾 O(1) 缓存友好，替代 Stack 与 LinkedList）→ PriorityQueue 二叉小顶堆（出队取最小，比较器定序，插入/出队 O(log n)）→ 非阻塞（本篇）与阻塞（BlockingQueue，25 篇）的分界**——队列选型 = 出队规则（FIFO/双端/优先级）× 并发形态。

前置阅读：[集合框架总览](./11_集合框架总览-入门.md)。生产者消费者的完整工程（阻塞队列+线程池）见[线程池与异步编程](./25_线程池与异步编程-入门.md)。

## 1. 背景：为什么队列要分这么多

「队列」在业务里至少有三种语义：**排队**（先来先服务 FIFO）、**插队/两端操作**（浏览器前进后退、撤销栈）、**VIP 优先**（任务调度按优先级）。三种语义对应三个类：ArrayDeque（FIFO 与双端通吃）、PriorityQueue（优先级出队）。而**出队规则就是队列的灵魂**——数据结构课的堆（heap）在工程里的第一个落地就是 PriorityQueue。

## 2. 核心机制：三种队列的实现与 API

```mermaid
flowchart TD
    F[Queue 两组 API] --> T1[抛异常组: add/remove/element]
    F --> T2[返回值组: offer/poll/peek<br/>满返回false 空返回null 工程首选]
    D[Deque 双端] --> D1[ArrayDeque: 循环数组<br/>头尾 O1 缓存友好]
    D1 --> D2[替代 Stack(历史遗留)与 LinkedList]
    P[PriorityQueue] --> H[二叉小顶堆: 数组存储<br/>父<=子 出队取堆顶最小]
    H --> H1[offer: 上浮 O log n]
    H --> H2[poll: 下沉 O log n]
    H --> H3[默认小顶 Comparator 可改大顶/自定义序]
```

- **两组 API 的取舍**：容量受限（有界队列）时 `add` 满了抛异常、`offer` 满了返回 false——**工程代码用返回值组**（失败是可处理的业务事件而非异常）；`element/peek` 看队头同理（空队列 element 抛、peek 返回 null）。
- **ArrayDeque 的循环数组**：head/tail 两个下标在数组里循环移动——两端操作都是 O(1) 且内存连续（缓存友好）；作为 Stack 替代（`push/pop` 即 addFirst/pollFirst）与 LinkedList 队列替代（官方推荐）。初始容量机制与 ArrayList 同族（预估容量免扩容）。
- **PriorityQueue 的堆机制**：完全二叉树用数组存储（父 i、子 2i+1/2i+2）——小顶堆（默认最小在顶）；offer 上浮（与父比较交换）、poll 下沉（与较小子交换）——插入出队都是 O(log n)，peek O(1)。**Comparator 决定「优先级」的定义**（默认自然序小者先出；大顶堆用 `Comparator.reverseOrder()`）。
- **PriorityQueue 的边界**：非线程安全；不支持 null；**遍历顺序不是优先级顺序**（堆只保证堆顶，迭代是无序的）——「按优先级遍历」必须逐个 poll，这是它最常被误解的点。

## 3. 落地实践：队列场景选型

```text
排队处理(FIFO):        ArrayDeque + offer/poll
撤销/历史(双端):       ArrayDeque push/pop
TopN/最优先任务:       PriorityQueue(Comparator 定序)
定时调度按时间:        PriorityQueue(按执行时间排序) 或 DelayQueue
生产者消费者(并发):    BlockingQueue 系(16/25 篇)
滑动窗口最大值:        ArrayDeque 单调队列(算法场景)
```

三纪律：① **有界需求用返回值组 API**；② **堆的 Comparator 一致性**（与业务优先级定义严格对齐，方向反了就是「每次取最不重要」的事故）；③ **队列容量治理**——无界队列（默认的 PriorityQueue/LinkedBlockingQueue）在消费端故障时会把内存撑爆，「有界 + 拒绝策略」是队列治理的标配思想（25 篇线程池同款纪律）。

## 4. 生产视角：队列事故的形态

- **PriorityQueue 无界堆积 OOM**：任务生产快于消费、队列无上限——堆内存被任务对象撑爆。整改：有界化（容量 + 满 时策略：阻塞/丢弃/落库），与线程池的队列纪律同源。
- **Comparator 方向反了**：想要「最紧急先出」用了默认自然序（小顶）但比较器写成大值优先——出队顺序与业务预期相反，且不报错（结果错比报错更危险）。
- **迭代 PriorityQueue 期望有序**：`for (Task t : pq)` 拿到的顺序是数组存储序——任务调度逻辑基于错误顺序。正解：逐个 poll。
- **Stack 类的历史残留**：`java.util.Stack` 继承 Vector（全 synchronized + 允许下标访问破坏栈语义）——官方文档自己推荐 Deque 替代；新代码见 Stack 即整改。

## 5. 主流系统怎么做：队列的生态延伸

| 场景 | 主流选择 | 机制要点 |
|---|---|---|
| 生产者消费者 | ArrayBlockingQueue/LinkedBlockingQueue | 阻塞语义（16/25 篇） |
| 延迟任务 | DelayQueue / 时间轮（Netty HashedWheelTimer） | 到期出队的两种机制 |
| 调度按优先级 | PriorityQueue / ScheduledExecutorService | 内存堆 vs 调度器 |
| 高性能事件队列 | Netty/Disruptor（环形缓冲） | 零竞争设计的专用队列（超 JDK 通用件范畴） |

规律：**JDK 队列覆盖「单机、通用」；专用场景（延迟海量/极低竞争）进入专用结构**——先 JDK 后专用，按瓶颈引入。

## 6. 典型场景

- **任务调度**（调度级）：PriorityQueue 按执行时间排序——小型调度器的核心结构。
- **TopK 问题**（算法级）：容量为 K 的小顶堆流式维护——「流式数据取前 K」的标准解。
- **浏览历史/撤销栈**（交互级）：ArrayDeque 双端——前进后退天然映射。

## 7. 与相邻概念的区别

- **Queue vs Deque**：Queue 单端（一头进一头出）语义；Deque 双端扩展（Queue 的子接口）——「语义收窄是好事」：参数声明 Queue 表达「我只按队列用你」。
- **PriorityQueue vs TreeSet**：都能「按序取出」——堆只保证堆顶（出队序），TreeMap 全序（遍历也有序）；只需「逐个取最优先」用堆（O(log n) 且常数小），需要「有序遍历/范围」用树。
- **ArrayDeque vs LinkedBlockingQueue**：非阻塞 vs 阻塞（满/空时挂起）——单线程/线程封闭用前者，生产者消费者用后者（25 篇）。
- **本篇 vs 线程池（25 篇）**：线程池内部的工作队列就是本篇的 BlockingQueue——队列语义在线程池场景的完整展开在后篇。

## 8. 常见误区与不适用

- **「PriorityQueue 遍历是有序的」**：堆只保证堆顶——排序需求用 `poll` 循环或先 `sorted()`；这是 PriorityQueue 第一误解。
- **「PriorityQueue 可以更新已有元素的优先级」**：不支持高效 decrease-key（移除重加 O(n)+O(log n)）——动态优先级场景（Dijkstra 大图）需要索引堆或换 TreeSet/专用库。
- **「ArrayDeque 需要传容量很小」**：循环数组也会扩容（2 倍）——已知吞吐给足初始容量（且它要求容量为 2 的幂内部自动处理）。
- **「队列无界省事」**：无界 = 把「背压问题」转嫁为「内存问题」——容量与满策略是队列设计的必答题。
- **不适用**：跨进程/跨服务队列（MQ——仓库 RocketMQ/Kafka 系列）；持久化队列（同前）；分布式任务调度（调度平台）——本篇全部是单机内存队列。

## 9. 你们可能会问

- **为什么 ArrayDeque 比 Stack/LinkedList 快？** 循环数组：无节点分配、内存连续缓存友好、两端操作纯下标运算——Stack 的 synchronized 与 LinkedList 的节点分配都是纯开销。
- **PriorityQueue 怎么实现「大顶堆」？** 构造器传 `Comparator.reverseOrder()` 或自定义比较器反向——堆的方向完全由 Comparator 定义，「优先级」是业务语义不是固定方向。
- **remove(Object) 在堆里是什么复杂度？** O(n)（线性查找）+ O(log n)（调整）——按内容删除是堆的弱项；「按 ID 取消任务」场景考虑换 IndexedPriorityQueue/TreeMap。
- **DelayQueue 是什么？** 元素实现 Delayed 接口的阻塞优先队列——到期（延迟归零）才能被 poll；延迟任务的最小 JDK 实现（生产级调度看 ScheduledExecutor/时间轮）。
- **单调队列是什么？** 队列内保持单调性的手工技巧（滑动窗口最大值）——它不是 JDK 类，是用 ArrayDeque 的算法模式；算法与工程的交界案例。

## 10. 一句话总结 + 5W 速记卡 + 自测三问

**🎯 核心带走**：

- **核心一句话**：Queue 三语义三实现——FIFO/双端用 ArrayDeque（循环数组两端 O(1)），优先级用 PriorityQueue（二叉堆，只保堆顶不保遍历序）；有界化 + 返回值组 API 是工程纪律。
- **链条复述**：两组 API（异常组/返回值组）→ ArrayDeque 循环数组替代 Stack/LinkedList → 堆的上浮下沉 → Comparator 定优先级方向 → 有界与背压。
- **失效点与边界**：堆遍历无序；不支持高效改优先级；单机内存队列（跨进程归 MQ）。

**5W 速记卡**：

| 维度 | 内容 |
|---|---|
| What | 三种队列语义 + 循环数组 + 二叉堆 + 两组 API |
| Why | 出队规则（FIFO/双端/优先级）是队列业务的灵魂 |
| When | 任务调度、TopK、撤销栈、滑动窗口、缓冲 |
| Where | 堆（数组/节点）单机内存 |
| How | 按出队规则选类 → 返回值组 API → 有界化 → Comparator 方向复核 |

💡 **实战提示**：offer/poll 替代 add/remove；堆遍历无序；无界队列是 OOM 预备役；Stack 换 ArrayDeque。

**开放问题**:Disruptor 类「无锁环形缓冲」证明了通用队列在极端场景的天花板——JDK 未来的虚拟线程时代，阻塞队列的实现会向「挂起队列」（虚拟线程友好）演进出新的家族成员吗？

**决策（何时用）**：单机队列语义推荐 ArrayDeque 起步 + PriorityQueue 补优先级；并发生产消费推荐 BlockingQueue（25 篇）；推荐「队列必须有界」进团队编码规范。

**Trade-off（代价与反方案）**：ArrayDeque 用「预分配数组」换「两端 O(1) 零节点分配」；PriorityQueue 用「O(log n) 出队 + 遍历无序」换「优先出队」；有界队列用「可能拒绝/阻塞」换「内存安全」——队列的每一项选择都在为「出队规则 × 并发 × 内存」定价。

**演进视角**：从 Stack/Vector（1.0 全同步历史包袱）到 Collections 框架的 Deque（Java 6 补位）再到并发队列家族（5/7 持续增强）——队列家族的演进史是「语义分化 + 并发专业化」；通用件稳定，专业件持续生长，与集合框架总演进一致。

---

**下篇预告**：并发集合的正主——下一篇[并发集合与线程安全容器](./16_并发集合与线程安全容器-入门.md)讲 ConcurrentHashMap 的锁演进与 CopyOnWrite 的读写权衡。

---

## 上下游地图

从系统架构的上下游看：**集合总览** 为本篇提供了地基——出队规则 的机制向上游承接、向下游 **阻塞队列(篇16)、线程池(篇25)** 输出任务编排；架构上它是这条知识链上不可跳过的一环，跳读时建议先回上游补齐语境。

```mermaid
flowchart LR
    U0[集合总览]
    --> ME[本篇: 出队规则]
    ME --> DN0[阻塞队列(篇16)]
 DN1[线程池(篇25)]
```

---

## 📌 数据与事实声明

Deque/ArrayDeque 循环数组、PriorityQueue 堆实现、两组 API 语义为 JDK 官方文档与源码公开内容；Stack 的官方替代建议出自其 Javadoc；DelayQueue 为 java.util.concurrent 公开文档。以官方文档为准。

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 文档 | Java 官方教程：Queue/Deque | docs.oracle.com |
| 图书 | Java 核心技术 卷I（队列章节） | Pearson（2022） |
| 文档 | Netty HashedWheelTimer / Disruptor（对照） | 各官方文档 |
| 系列文章 | 并发集合（16 篇）/ 线程池（25 篇） | 本仓库同系列 |
