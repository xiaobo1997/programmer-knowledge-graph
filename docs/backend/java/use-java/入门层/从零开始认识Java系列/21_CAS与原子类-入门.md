---
title: CAS与原子类
date: 2026-09-09
type: concept
tags: [Java, 并发]
wordCount: 3022
readMinutes: 9
---

# CAS 与原子类

> **一句话摘要**：CAS（Compare-And-Swap）= 「值还是我读到的旧值就换成新值，否则失败重试」的 CPU 原子指令——**无锁并发的基石**：Atomic 家族（原子读改写）、LongAdder（分散累加热点分离）、ConcurrentHashMap（CAS 空桶插入）全部踩在它上面；代价是自旋重试的 CPU 消耗与 ABA 问题——本篇讲穿「无锁 = 检测冲突而非阻止冲突」的设计哲学。

> **本文核心**：机制链 = **CPU 的 cmpxchg 指令（比较期望值与内存值，相等则交换）→ JDK 的 Unsafe/VarHandle 封装 → Atomic 家族（incrementAndGet 等）→ 自旋重试 = 失败循环再试 → ABA 问题（值回到旧值但中间变过——引用型用 AtomicStampedReference 版本戳解决）→ 高竞争热点分离：LongAdder 的 Cell 数组**——无锁 vs 加锁的本质：乐观（假设无冲突失败重试）vs 悲观（先锁住再操作）。

前置阅读：[JMM 与 volatile](./19_JMM与volatile-入门.md)（CAS 的可见性地基）、[synchronized 与锁升级](./20_synchronized与锁升级-入门.md)（锁的对照系）。

## 1. 背景：无锁路线的哲学

锁的路线是**悲观**：「我要改，你们都别动」（阻塞等待）；CAS 的路线是**乐观**：「我直接改，改之前确认没被人动过，动了我就重试」。三条优势：**无阻塞**（失败者不挂起，立刻知道结果）、**无死锁**（没有持有-等待关系）、**细粒度**（单变量级别）。两条代价：**自旋消耗**（高竞争下反复失败重试烧 CPU）、**只能管单变量**（多变量原子性 CAS 组合不了——要么循环重试整段逻辑，要么退回锁）。无锁不是万能，是「单变量原子操作」域的精准武器。

## 2. 核心机制：CAS 指令、ABA 与 LongAdder

```mermaid
flowchart TD
    CAS[CAS 机制: compareAndSwap] --> M1[CPU 原子指令: cmpxchg<br/>内存值==期望值? 换新值 : 失败]
    M1 --> AT[Atomic 家族] --> A1[AtomicLong: incrementAndGet<br/>CAS 自旋循环 do while]
    A1 --> SPIN[高竞争: 自旋重试率飙升<br/>吞吐反而塌 -> 热点问题]
    SPIN --> AD[LongAdder: 分散累加<br/>base + Cell[] 数组按线程散列<br/>sum 时汇总 -- 写分散读汇总]
    ABA[ABA 问题] --> AB1[值 A->B->A: CAS 看不出中间变化<br/>数值型无碍 引用型有碍(对象被换回同一引用)]
    AB1 --> FIX[AtomicStampedReference: 版本戳<br/>或直接用不可变对象+AtomicReference 换整]
```

- **CAS 的原子性来源**：CPU 指令级原子（cmpxchg 带 lock 前缀锁缓存行）——单条指令无交错可能；JDK 通过 Unsafe/VarHandle 封装（`compareAndSwapObject/Int/Long`）。
- **自旋结构**：AtomicLong 的 `incrementAndGet` 本质是 `do { 旧值=读; 新值=旧值+1 } while (!CAS(地址, 旧值, 新值));`——CAS 失败（被别人抢先）就循环重试。低竞争一次成功；高竞争下大量线程互相「抢跑」，重试率飙升——**热点变量的无锁瓶颈**。
- **ABA 问题**：CAS 只比对「值相等」，不关心中间历史——值从 A→B→A，CAS 以为没变过。数值型无碍（数值语义只看最终值）；**引用型有碍**（栈顶引用 A→弹出压回又是 A，但链表结构已变——操作基于过时的结构假设）。解法：`AtomicStampedReference`（值+版本戳双比对）或「不可变对象 + AtomicReference 整体替换」（新对象地址必不同，天然防 ABA）。
- **LongAdder 的热点分离**：高竞争下 AtomicLong 的所有线程挤在一个变量上自旋——LongAdder 把计数拆成 `base + Cell[] 数组`：无竞争写 base，有竞争按线程散列写不同 Cell，`sum()` 时汇总——**用「写分散、读汇总」把热点摊平**（代价是 sum 非精确瞬时值）。CHM 的 size 计数是同款思想（16 篇）；「热点分离」是无锁设计对抗竞争的核心手筋。

## 3. 落地实践：CAS 家族的选型

```text
单变量原子操作:
  计数:            AtomicLong / 高竞争用 LongAdder
  引用赋值:        AtomicReference
  布尔开关:        AtomicBoolean
  字段级(避免装箱): AtomicIntegerFieldUpdater(反射操作已有类字段)
复合结构:
  原子换引用:      AtomicReference<Config> + 不可变对象
  带版本引用(ABA): AtomicStampedReference
累加器:           LongAdder/DoubleAdder(统计) LongAccumulator(自定义聚合)
```

三条纪律：① **自旋体只做轻活**（CAS 循环内做耗时操作 = 竞争放大器）；② **引用 CAS 用不可变对象整体替换**（防 ABA + 天然线程安全）；③ **统计计数高竞争直接 LongAdder**（AtomicLong 在 8+ 线程竞争下吞吐显著劣化——LongAdder 的设计动机）。

## 4. 生产视角：无锁事故的形态

- **CAS 自旋的热点雪崩**：AtomicLong 做全局 QPS 计数、千线程高频递增——CPU 打满但吞吐不涨（全在重试）。整改：LongAdder 或分片计数。
- **ABA 引发的结构损坏**：无锁栈的 CAS 弹栈——线程 1 读到头结点 A 被挂起；线程 2 弹 A 又压回 A（值同但链后继变了）；线程 1 恢复 CAS 成功——链表被改坏。低概率、难复现、危害大——引用 CAS 必须审视 ABA。
- **CAS 失败后不重试的静默丢失**：`compareAndSet` 返回 false 被忽略——更新静默丢失（「调用即可靠」的错觉）。CAS 的返回值必须处理（重试或上报）。
- **LongAdder 的 sum 误用**：把 `sum()` 当精确实时值做业务判断（如限流阈值判断）——汇总非精确瞬时值，且无 happens-before 快照语义。业务精确计数用 AtomicLong，统计趋势用 LongAdder。

## 5. 主流系统怎么做：CAS 的生态应用

| 场景 | 载体 | 机制要点 |
|---|---|---|
| 原子计数 | AtomicLong/LongAdder | 自旋 vs 分散累加 |
| 并发容器 | ConcurrentHashMap 空桶 CAS | 初始化/空桶插入无锁（16 篇） |
| 无锁栈/队列 | AtomicReference + CAS | Treiber 栈（注意 ABA） |
| AQS 状态 | state 的 CAS | 抢锁即 CAS 改状态（22 篇） |
| 配置发布 | AtomicReferenc`e<Config>` | 不可变对象整体替换 |

规律：**CAS 是并发包的「指令级地基」**——Atomic 家族、AQS 的 state、CHM 的空桶插入、FutureTask 的状态机，全部踩在 CAS 上。

## 6. 典型场景

- **全局计数/统计**（监控级）：LongAdder 的主场（QPS/错误数）。
- **配置引用热替换**（发布级）：AtomicReference + 不可变 Config——volatile 语义 + 原子换引用的组合拳（19 篇场景 3 的无锁实现）。
- **惰性初始化**（模式级）：CHM computeIfAbsent 内部 / AtomicReference 的 compareAndSet(null, instance)。

## 7. 与相邻概念的区别

- **CAS vs 锁**：乐观重试 vs 悲观阻塞——竞争低 CAS 占优（无挂起）、竞争高且临界区长锁占优（自旋烧 CPU）；临界区多变量时锁是唯一解。
- **AtomicLong vs LongAdder**：精确瞬时值 + 低竞争 vs 统计趋势 + 高竞争——「读精确」与「写吞吐」的定价交换。
- **AtomicXXXFieldUpdater vs Atomic 字段**：不改变类结构给「已有类的 volatile 字段」加原子操作（反射访问）——省内存（不必每个对象包 Atomic 包装类）但反射开销；框架类场景。
- **本篇 vs AQS（22 篇）**：CAS 是单次原语；AQS 用 CAS + 队列构建「可阻塞的锁语义」——原语与框架的关系。

## 8. 常见误区与不适用

- **「CAS 是原子的所以无锁逻辑也原子」**：CAS 只保证「单变量单次比较交换」——两个 CAS 组成的逻辑段没有原子性（中间可插入）；复合逻辑要么循环重试整体、要么加锁。
- **「AtomicLong 计数不会错」**：单次 increment 原子没错；但 `if (count.get() < max) count.incrementAndGet()` 是两步——检查与递增间可插入（需要「原子递增至阈值」用 `incrementAndGet` 返回值判断或 LongAdder+外部判断）。
- **「无锁一定比锁快」**：高竞争 + 长自旋的无锁比短临界区锁慢——「无锁 vs 锁」按竞争强度与临界区长度定价（20 篇的对照）。
- **「volatile 够了就不用 Atomic」**：volatile 无原子性——「需要原子读改写」时 volatile 单独不够（19 篇决策树）。
- **不适用**：多变量原子性（锁或不可变整体替换）；临界区含 IO；长临界区（自旋灾难）。

## 9. 你们可能会问

- **CAS 底层指令是什么？** x86 的 `lock cmpxchg`（lock 前缀锁缓存行保证指令原子）——「锁缓存行」与「锁总线」的现代实现是前者（代价小）。
- **AtomicLong 的 incrementAndGet 源码结构？** `do { old = get(); } while (!compareAndSet(old, old+1)); return old+1;`——教科书的 CAS 自旋循环；读懂它就读懂了无锁范式。
- **LongAdder 为什么 sum 不精确？** 分散在 base+Cell 数组中的值无全局锁汇总——「无精确瞬时快照」是无锁设计的代价；文档明示「sum 非原子」。
- **VarHandle 是什么，和 Unsafe 什么关系？** JDK 9 引入的「安全版 Unsafe」——标准化变量句柄（普通读/volatile 读/CAS 模式），替代裸 Unsafe 的推荐方式。
- **怎么观测 CAS 竞争？** JMC/JFR 无直接 CAS 事件；间接信号：CPU 高但业务吞吐不涨（自旋烧 CPU）+ 压测对比「AtomicLong vs LongAdder」的吞吐差。

## 10. 一句话总结 + 5W 速记卡 + 自测三问

**🎯 核心带走**：

- **核心一句话**：CAS = CPU 原子的「比较交换 + 失败重试」——无锁范式（乐观并发）的地基；Atomic 家族单变量原子、LongAdder 热点分离、ABA 用版本戳或不可变替换免疫。
- **链条复述**：cmpxchg 原子指令 → 自旋循环 → Atomic 家族 → 高竞争热点问题 → LongAdder 分散累加 → ABA 与版本戳 → 「无锁 vs 锁」按竞争定价。
- **失效点与边界**：多变量原子性不行；高竞争长自旋是反模式；LongAdder 的 sum 非精确。

**5W 速记卡**：

| 维度 | 内容 |
|---|---|
| What | CAS 指令 + Atomic 家族 + ABA + LongAdder |
| Why | 乐观并发在低竞争/单变量域的零阻塞优势 |
| When | 计数、引用热替换、无锁容器、监控统计 |
| Where | CPU 指令（lock cmpxchg）+ 堆变量 |
| How | 按竞争强度与变量数选型 → 返回值必处理 → 引用用不可变替换 |

💡 **实战提示**：高竞争计数用 LongAdder；CAS 返回值必须处理；引用 CAS 配不可变对象；自旋体内禁耗时操作。

**开放问题**：硬件事务内存（HTM/TSX）曾 promised 「代码块级原子性」——如果 TMT 普及，CAS 自旋与锁的权衡会合并成「事务化编程」吗？

**决策（何时用）**：单变量原子操作推荐 Atomic 家族；高竞争统计推荐 LongAdder；推荐「CAS 返回值必处理」与「引用 CAS 用不可变替换」进并发规范。

**Trade-off（代价与反方案）**：CAS 用「自旋重试的 CPU」换「零阻塞与零死锁」；LongAdder 用「sum 近似」换「写吞吐」；版本戳用「额外内存」换「ABA 免疫」；无锁与锁的抉择按「竞争强度 × 临界区长度 × 变量数」三因子定价——没有免费的并发。

**演进视角**：从 Unsafe 的内部 API 到 VarHandle 的标准化（JDK 9）——CAS 能力正在从「内部 hack」走向「公开契约」；Valhalla 的值类型若支持 CAS 特化，无锁范式的性能地板还会再降。乐观并发的思想自 Herlihy 的无锁理论（1990s）以来从未改变，变化的只是实现工具的正规化程度。

---

**下篇预告**：AQS 与 JUC 锁——下一篇[AQS 与 JUC 锁](./22_AQS与JUC锁-入门.md)讲 ReentrantLock/读写锁背后的队列同步器骨架。

---

## 上下游地图

从系统架构的上下游看：**JMM** 为本篇提供了地基——无锁范式 的机制向上游承接、向下游 **AQS(篇22)** 输出原子地基；架构上它是这条知识链上不可跳过的一环，跳读时建议先回上游补齐语境。

```mermaid
flowchart LR
    U0[JMM]
    --> ME[本篇: 无锁范式]
    ME --> DN0[AQS(篇22)]
```

---

## 📌 数据与事实声明

CAS 指令与 Unsafe/VarHandle 为 JDK 官方文档；Atomic 家族/LongAdder 机制（Cell 分散）为源码与官方 Javadoc 公开内容；ABA 与 AtomicStampedReference 为并发文献公开案例（Java 并发编程实战第 15 章）；「高竞争 AtomicLong 劣化」为 LongAdder 设计文档（Javadoc）自述动机。以 JDK 源码为准。

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 图书 | Java 并发编程实战（第 15 章原子变量与非阻塞同步） | Addison-Wesley |
| 文档 | java.util.concurrent.atomic 官方文档 | docs.oracle.com |
| JEP | VarHandle（JDK 9，JEP 193） | openjdk.org/jeps/193 |
| 系列文章 | AQS 与 JUC 锁（下一篇） | 本仓库同系列 |
