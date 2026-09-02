---
title: Java 语言
date: 2026-09-02
aside: false
wordCount: 1517
readMinutes: 5
---

# ▥ Java 语言

> JVM 生态核心语言：从对象与内存布局，到并发与虚拟线程。本系列覆盖 Java 语言本体（use-java）完整知识面，Spring Boot 生态独立成系列（见 ecosystem/spring-boot）。

## 系列结构（L1-L4 从点到面）

| 层级 | 内容 | 规模 |
|---|---|---|
| 入门层 | 从零开始认识 Java 系列——知识面全覆盖（认知生态 / 语法核心 / 集合框架 / 并发编程 / JVM / IO 网络 / 现代特性，7 组 41 篇） | 42 文件（0_导读 + 41 正文） |
| 特性层 | 深入理解 X 系列——单点纵向深挖（集合源码 / 并发 / JVM / 新特性，各 2-4 篇，规划中） | 4 个子目录 |
| 专题层 | XX 深度——多点横向组合拳（JVM 调优排障 / 高并发实战 / Java 工程实践，规划中） | 3 个专题 |
| 整合层 | 跨专题收束（Java 应用性能演进之路） | 1 篇 |

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

- 新手：从 0_系列导读-全景 开始，按 1-41 顺序读入门层（7 组顺读，知识面全覆盖）
- 进阶：按兴趣进特性层深挖（集合源码 / 并发 / JVM / 新特性）
- 实战：读专题层 + 整合层（运行时性能演进）

## 沉淀原则

- 入门层对标权威书目 + 官方文档铺全知识面（Java 核心技术卷I / Effective Java / 深入理解 Java 虚拟机 / Java 并发编程实战 / JavaGuide）
- 入门层「多、广、覆盖全」，读到疑问再沿特性/专题/整合层深入（L1-L4 从点到面）
- 对标 Java 17 LTS（工作主线）+ 21 LTS（演进方向）；旧机制标注「历史版本视角」
- 面试问答不在此仓库沉淀（见 interview 仓库）
