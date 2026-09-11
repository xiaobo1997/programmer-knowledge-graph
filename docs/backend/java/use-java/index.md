---
title: Java 语言
date: 2026-09-02
aside: false
wordCount: 2038
readMinutes: 6
type: overview
---

# ▥ Java 语言

> JVM 生态核心语言：从对象与内存布局，到并发与虚拟线程。本系列覆盖 Java 语言本体（use-java）完整知识面，Spring Boot 生态独立成系列（见 ecosystem/spring-boot）。

## 系列结构（L1-L4 从点到面）

| 层级 | 内容 | 规模 |
|---|---|---|
| 入门层 | [从零开始认识 Java 系列](./入门层/从零开始认识Java系列/0_系列导读-全景)——知识面全覆盖（认知生态 / 语法核心 / 集合框架 / 并发编程 / JVM / IO 网络 / 现代特性，7 组 41 篇） | 42 文件（0_导读 + 41 正文） |
| 特性层 | [深入理解 X 系列](./特性层/深入理解集合源码系列/index)——单点纵向深挖（[集合源码](./特性层/深入理解集合源码系列/index) / [并发](./特性层/深入理解并发系列/index) / [JVM](./特性层/深入理解JVM系列/index) / [新特性](./特性层/深入理解新特性系列/index)，各 2-3 篇，大纲已定） | 4 子系列 11 篇 |
| 专题层 | [XX 深度](./专题层/JVM调优与排障实战/index)——多点横向组合拳（[JVM 调优排障](./专题层/JVM调优与排障实战/index) / [高并发实战](./专题层/高并发编程实战/index) / [Java 工程实践](./专题层/Java工程实践/index)，各 3 篇，大纲已定） | 3 专题 9 篇 |
| 整合层 | [跨专题收束（Java 应用性能演进之路）](./整合层/index) | 1 篇 |

## 入门层规划（41 篇 · 7 组，文章陆续落盘）

### 第 1 组 认知与生态（2 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 1 | Java 全景与运行机制 | 语言定位/发展简史/JDK-JRE-JVM/字节码/一次编译到处跑 |
| 2 | Java 版本演进与 LTS 节奏 | 8→11→17→21→25 每个大版本核心变化/升级路径/选型 |

### 第 2 组 语法核心（8 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 3 | 对象与类 | 类与对象/构造器/this-static/包/内存布局直觉 |
| 4 | 继承与多态 | 继承/重写与隐藏/多态与动态绑定/组合优于继承 |
| 5 | 接口与抽象类 | 接口演进（default/static/private）/抽象类/函数式接口预告 |
| 6 | 字符串与常量池 | String 不可变/StringBuilder/StringBuffer/常量池演进/intern |
| 7 | 异常体系与最佳实践 | checked/unchecked/自定义/try-with-resources/异常反模式 |
| 8 | 泛型 | 泛型类方法/类型擦除/通配符与边界/桥方法 |
| 9 | 注解与反射 | 注解定义/元注解/反射 API/动态代理初识 |
| 10 | 枚举与金额精度 | enum 用法/EnumMap-EnumSet/单例最佳实践 + BigDecimal/浮点误差/舍入模式（金融刚需） |

### 第 3 组 集合框架（6 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 11 | 集合框架总览 | Collection/Map 五大接口/快速失败机制/选型决策 |
| 12 | ArrayList 与 LinkedList | 动态数组/链表/扩容机制/随机访问 vs 插入/Vector 对比 |
| 13 | HashMap 原理与演进 | hash 扰动/冲突链/红黑树化/扩容/Java 8 演进 |
| 14 | Map/Set 家族对照 | LinkedHashMap-TreeMap-Hashtable / HashSet-LinkedHashSet-TreeSet 底层 |
| 15 | Queue/Deque 与 PriorityQueue | ArrayDeque/优先级队列/双端队列/场景选型 |
| 16 | 并发集合与线程安全容器 | ConcurrentHashMap 设计/并发 Queue/CopyOnWrite/同步包装器演进 |

### 第 4 组 并发编程（9 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 17 | 线程基础与生命周期 | 创建 4 方式/状态机/上下文切换/为什么并发难 |
| 18 | 线程协作与阻塞队列 | wait-notify/join/yield/中断机制/生产者消费者 BlockingQueue 四种 |
| 19 | JMM 与 volatile | 内存模型/可见性/有序性/happens-before/volatile 语义 |
| 20 | synchronized 与锁升级 | 监视器/偏向→轻量→重量/可重入 |
| 21 | CAS 与原子类 | CAS 原理/ABA/Atomic 家族/LongAdder |
| 22 | AQS 与 JUC 锁 | AQS 骨架/ReentrantLock/读写锁/公平性 |
| 23 | 并发工具类 | CountDownLatch/CyclicBarrier/Semaphore/Exchanger |
| 24 | ThreadLocal | 原理/内存泄漏/线程池场景/传递方案 |
| 25 | 线程池与异步编程 | Executor 框架/7 参数/拒绝策略/异常处理/CompletableFuture |

### 第 5 组 JVM（7 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 26 | 运行时内存区域 | 堆/栈/方法区/直接内存/各区域 OOM 长相 |
| 27 | 对象的一生 | 创建流程/内存布局/对象头/指针压缩/TLAB/逃逸分析 |
| 28 | 垃圾回收算法 | 可达性分析/引用类型/标记清除-复制-标记整理/分代理论 |
| 29 | GC 收集器全景 | Serial→CMS→G1→ZGC 演进/停顿与吞吐/选型 |
| 30 | 类加载机制 | 加载-验证-准备-解析-初始化/双亲委派/打破场景 |
| 31 | 编译与执行 | javac/字节码/解释 vs JIT/分层编译/C1-C2 |
| 32 | JVM 调优与排查工具 | 常用参数全解/GC 日志/jps-jstat-jmap-jstack/Arthas |

### 第 6 组 IO 与网络（3 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 33 | IO 体系与序列化 | 字节流字符流/装饰器/File/NIO 对比起点/Serializable |
| 34 | NIO 与 IO 多路复用 | Buffer-Channel-Selector/epoll/多路复用模型 |
| 35 | 网络编程与 HTTP | Socket/Java HttpClient/HTTP 要点/连接池（RPC 专题地基） |

### 第 7 组 现代特性（6 篇）

| # | 篇目 | 一句话定位 |
|---|---|---|
| 36 | Lambda 与函数式接口 | lambda 语法/函数式接口/方法引用/变量捕获 |
| 37 | Stream 流式编程 | 创建/中间-终端操作/Collectors/并行流 |
| 38 | Optional 与新 API | Optional 用法与反模式/集合工厂方法/var |
| 39 | 新日期时间 API | java.time/LocalDate-DateTime/Instant/格式化/时区（账务刚需） |
| 40 | Java 17 新特性 | record/sealed/switch 表达式/文本块（旧文 17 亮点改造） |
| 41 | Java 21 与虚拟线程 | 虚拟线程/pattern matching/25 展望 |

## 阅读路径

- 新手：从 [0_系列导读-全景](./入门层/从零开始认识Java系列/0_系列导读-全景) 开始，按 1-41 顺序读入门层（7 组顺读，知识面全覆盖）
- 进阶：按兴趣进 [特性层](./特性层/深入理解集合源码系列/index) 深挖（集合源码 / 并发 / JVM / 新特性）
- 实战：读 [专题层](./专题层/JVM调优与排障实战/index) + [整合层](./整合层/index)（运行时性能演进）

## ⚡ 速查卡（入门层 41 篇精选）

| 机制 | 一句话结论（为什么） | 哪里会坏 | 篇目 |
|---|---|---|---|
| 运行链路 | 字节码+JVM+JIT，「越跑越快」的骨架 | 版本混装/NoClassDefFound | [篇1](./入门层/从零开始认识Java系列/1_Java全景与运行机制-入门.md) |
| HashMap | 扰动散列+8树化+2倍扩容（高低位拆分） | 并发用它=丢数据；键可变=失踪 | [篇13](./入门层/从零开始认识Java系列/13_HashMap原理与演进-入门.md) |
| JMM | happens-before 定义「写必可见」契约 | volatile 管不了复合操作 | [篇19](./入门层/从零开始认识Java系列/19_JMM与volatile-入门.md) |
| 线程池 | 有界资源治理（7 参数是旋钮） | 无界队列+Executors 禁用 | [篇25](./入门层/从零开始认识Java系列/25_线程池与异步编程-入门.md) |
| ThreadLocal | 反向存储+弱引用键；remove 是铁律 | 池化串号+内存泄漏 | [篇24](./入门层/从零开始认识Java系列/24_ThreadLocal-入门.md) |
| OOM 分诊 | 五区域五种 OOM 长相，信息即分诊台 | 盲目调大 -Xmx 掩盖真凶 | [篇26](./入门层/从零开始认识Java系列/26_运行时内存区域-入门.md) |
| Stream | 声明式惰性流水线；并行是条件加速 | 并行共享状态=数据错乱 | [篇37](./入门层/从零开始认识Java系列/37_Stream流式编程-入门.md) |
| 虚拟线程 | 阻塞卸载载体——线程成本模型终结 | pinned 钉住+ThreadLocal 乘数 | [篇41](./入门层/从零开始认识Java系列/41_Java21与虚拟线程-入门.md) |

> 金句：内存直觉挂语法（3-10），语义承诺选集合（11-16），三难定价并发（17-25），机制先于参数调 JVM（26-32）。

## 📌 数据与事实声明

本页为系列大纲与导航页；篇目定位与机制描述为公开资料与本仓库系列的机制级概括，随正文落盘持续校准。
