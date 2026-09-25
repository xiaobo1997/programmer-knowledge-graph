---
title: Python 连接 MySQL：ORM 进阶与数据库治理
type: deep-dive
tags: [Python, MySQL, SQLAlchemy, 连接池, 事务, 特性层]
date: 2026-09-16
wordCount: 6428
readMinutes: 20
aside: false
---

# Python 连接 MySQL：ORM 进阶与数据库治理

> 入门篇讲过「怎么用 SQLAlchemy 增删改查」，本篇把 Python 侧的数据库治理挖到机制层：**连接池参数与 TCP 断连的关系、Session 生命周期与事务边界、N+1 的生成机制与消灭路径、读写分离与分库分表在 Python 生态的真实水位**。数据库治理的大部分事故不在 SQL 本身，而在「应用与数据库之间的连接层」——这正是 Python 视角与 Java 侧差异最集中的地方。

## 一句话摘要

Python 操作 MySQL 的生产姿势 = **SQLAlchemy Engine（连接池）+ Session 事务边界 + 显式加载策略 + 应用层读写分离**。核心机制链是：pymysql 驱动在 GIL 下同步执行、QueuePool 按参数守护连接生死、Session 是「工作单元」而非「连接持有者」、事务边界决定锁的持有时长。**数据库治理的本质，是把「连接、事务、加载、路由」四层各自的默认行为翻译成显式配置——默认值是给 demo 准备的，不是给生产准备的**。

## 🎯 本文核心

**核心一句话：Python 侧的 MySQL 治理 = 四层显式化——连接层（pool_size/pool_pre_ping/pool_recycle 对抗 TCP 断连）、事务层（Session 生命周期 = 事务边界 = 锁持有时长）、加载层（lazy/ selectinload / joinedload 决定查询条数）、路由层（读写分离与分片在应用层显式路由）——任何一层依赖默认值，都会在生产以「连接被杀、长事务锁表、深翻页拖库、从库读到旧数据」的形式还债。**

机制链（全文挂这条链上）：驱动与 GIL → 连接池参数逐个拆解 → 源码关键路径（一次查询的旅程）→ Session 与事务边界 → N+1 机制 → 读写分离与分库分表 → 事故复盘 → 量级演进。

## 5W 速记卡

| 维度 | 一句话 |
|---|---|
| What | SQLAlchemy Engine/Session 治理 + 连接池参数 + 加载策略 + 读写分离 |
| Why | 连接是昂贵资源、事务是锁的载体、ORM 默认行为会放大查询数 |
| When | QPS 上千、连接报错、尾延迟抖动、数据量过亿时逐层用上治理手段 |
| Where | 驱动层（pymysql）→ 池层（QueuePool）→ 会话层（Session）→ 路由层（多 Engine） |
| How | pool_pre_ping 探活、Session 按请求生命周期、selectinload 消 N+1、主从分家 |

## 一、驱动与 GIL：Python 侧的第一层约束

选驱动先理解执行模型：`pymysql` 是纯 Python 实现，SQL 解析、协议编解码全在 Python 字节码里跑，**执行期间持有 GIL**；`mysqlclient`（C 封装 libmysqlclient）在 C 层执行时释放 GIL。单请求内差异微小，但高并发下 GIL 争用会推高尾延迟——业内认知是纯 Python 驱动在多线程模型下吞吐上限更低。两条出路：一是换 C 驱动，二是换并发模型——异步驱动（`asyncmy`/`aiomysql`）配合 asyncio，把「等待数据库响应」的阻塞时间让给事件循环（详见本系列并发篇）。

业内惯例（生产中）：Web 框架同步栈用 `mysqlclient` 或 `pymysql` + SQLAlchemy 池层治理；asyncio 栈用 `asyncmy` + SQLAlchemy 2.0 的 async Engine。混用是禁忌——同步驱动放进事件循环会阻塞一切。

## 二、连接池：对抗 TCP 断连的参数科学

SQLAlchemy 的 QueuePool 四个参数，每一个都对应一类生产故障：

```python
from sqlalchemy import create_engine

engine = create_engine(
    "mysql+pymysql://user:pass@host:3306/db?charset=utf8mb4",
    pool_size=20,          # 常驻连接数：参照「并发线程数 x 每请求事务数」估算
    max_overflow=10,       # 突发可超出的临时连接，用完即还
    pool_timeout=30,       # 借不到连接最多等 30 秒（否则抛 TimeoutError）
    pool_recycle=3600,     # 连接最长存活 1 小时，到期回收重建
    pool_pre_ping=True,    # 每次借出前 PING 探活，死连接直接重建
)
```

**为什么 pool_pre_ping 与 pool_recycle 要一起上？** MySQL 服务端 `wait_timeout`（默认 8 小时，公开口径）会主动断开空闲连接，中间的负载均衡器/防火墙往往更激进（几分钟级杀空闲 TCP）——客户端不知道连接已死，借出来一用就报 `MySQL server has gone away`。`pool_recycle` 按「比最短杀手更短」的周期主动换血；`pool_pre_ping` 则在每次借出前花一次轻量 PING 校验。前者省日常开销但有窗口期，后者稳但每借一次多一次往返——生产标配是两者都开，recycle 给兜底、pre_ping 给实时。

**为什么不选「把 pool_size 调到越大越好」？** 每条 MySQL 连接在服务端是一个线程 + 会话内存（MB 级），连接数堆到数千，服务端上下文切换与内存先崩；而且数据库的并发处理能力远低于应用线程数——连接数超过数据库核心数的一个系数后（业内经验值：核心数的 2-4 倍起估），吞吐不升反降。池的正确尺寸来自「并发事务数」的估算，不是拍脑袋。**为什么不选「不开池、每次现连」？** TCP 握手 + TLS + AUTH 每次数毫秒到十毫秒级（业内认知），高并发路径上建连开销会吃掉一整个 CPU。

### 追问链：池耗尽的那一刻发生了什么？

**追问一：pool_timeout 超时之后，应用会发生什么？**——`TimeoutError: QueuePool limit of size X overflow Y reached`。这个异常不是噪音，它是整个应用层的背压信号：上游并发已经超过「池容量 × 单事务平均耗时」的吞吐上限，借连接开始排队。把 timeout 调大只是让排队更久，真正的出路是缩短事务时长（把 RPC 移出事务）或扩大池容量（配合数据库侧容量评估）。

**再深一层：为什么池满时不无限等待而是快速失败？**——无限等待意味着故障会向上游传染：数据库一旦变慢，所有线程堵在池门口，线程池跟着耗尽，整个服务雪崩——这就是连接池层面的熔断设计思想：宁可这一批请求快速失败，不让故障把进程拖死。快速失败还保留了重试的机会（配合退避），无限等待连重试的机会都没有。

**打破砂锅问到底：池的参数为什么不能「一次配好永远不动」？**——因为吞吐上限 = 池容量 / 平均事务持有时长，两个变量都在漂移：业务迭代改变事务时长，流量增长改变并发需求。池参数是活配置，监控（借出水位、排队次数、等待时长分布）才是参数调整的依据——这也是「连接池是可用性参数」的完整含义。

### 设计思想：池是一层「有界资源」的架构表达

QueuePool 的设计哲学是承认一个残酷现实：**数据库的处理能力是有限的，应用侧必须自我设限**。无限连接的天真假设（每请求一条连接）把过载保护的责任推给数据库，而数据库恰是全系统最难水平扩展的组件——池架构把保护点前移到应用进程内，用排队与快速失败把过载挡在数据库门外。上下游视角看，池是应用与数据库之间的「闸门」：上游流量形态（突发/平稳）决定了 overflow 的弹性设计，下游数据库规格决定了 pool_size 的天花板——两侧一变，池就要重估。

### 源码/关键路径：一次查询的完整旅程

一次查询在协议层的时序——每一步都在池与会话的约束之下：

```mermaid
sequenceDiagram
    participant App as Session
    participant Pool as QueuePool
    participant DB as MySQL
    App->>Pool: 借连接 - pool_pre_ping 探活
    Pool->>DB: PING
    DB-->>Pool: OK - 返回健康连接
    App->>DB: 发送 SQL - 绑定参数
    DB-->>App: 结果集物化为 Row
    Note over App: 事务保持打开 - 行锁不释放
    App->>Pool: commit 后归还连接
```

`session.execute(select(User).where(User.id == 1))` 的关键路径（SQLAlchemy 2.0）：

```text
Session.execute()
  -> Session._connection_for_bind()   # 取当前事务连接（无则 begin 开启）
  -> Engine.connect()                 # 从 QueuePool 借连接（pre_ping 在这一步）
  -> dialect 层编译语句               # SQLAlchemy 构造 SQL + 绑定参数（防注入的关键）
  -> DBAPI.cursor.execute()           # pymysql 发送 COM_QUERY，读结果集
  -> 结果行物化                       # Row 对象构造（identity map 缓存在此更新）
  -> 事务保持打开                     # 直到 commit/rollback/Session 关闭
```

两个源码级细节值得记住：**一是 Session 默认「事务即生命周期」**——2.0 风格下第一条查询就开始一个事务，直到 commit/rollback，这意味着「只读接口」也持有事务，接口里夹一段慢 RPC 就变成事实上的长事务；**二是 identity map**——同一 Session 内主键相同的对象只物化一份，重复查询命中缓存，但这也意味着 Session 越长寿，看到的数据越「陈旧」（它不会自动刷新已加载对象），这就是「每个请求开一个新 Session」惯例的机制根源。

## 三、Session 与事务边界：锁的持有时长由你决定

```python
from sqlalchemy.orm import Session

# 推荐形态：上下文管理器，异常自动回滚
with Session(engine) as session:
    with session.begin():          # 显式事务边界
        session.add(order)
        account.balance -= amount  # 这里的行锁持有多久？直到块退出
    # begin 块退出即 commit；异常即 rollback
```

事务边界的治理纪律只有三条。**第一，事务内禁 RPC**：临界区里的行锁（InnoDB 按索引加行锁）要等到 commit 才释放，事务内调用一个 500ms 的外部接口，等于让相关行被锁 500ms——并发一上来就是锁等待连锁。正确姿势是「先查外部、再开事务、事务内只碰数据库」。**第二，隔离级别要显式认知**：MySQL InnoDB 默认 REPEATABLE READ（可重复读），同一事务内两次读同一行结果一致——这对「先读再判断再写」的逻辑是保护，但也意味着长事务里看到的是越来越旧的快照；PostgreSQL 默认 READ COMMITTED，跨库迁移时这是行为差异的第一来源。**第三，死锁要重试而不是消灭**：两个事务按相反顺序更新两行必然死锁，InnoDB 会自动检测并回滚代价小的一方（公开口径），应用侧的正确响应是捕获死锁异常后带随机退避重试，而不是试图「设计一个永不死锁的流程」。

**反方案分析：为什么不选「自动提交模式跑业务」？**——autocommit 下每条语句独立成事务，多步操作失去原子性（扣款与记账可能一成一败），行锁粒度碎片化；它适合的场景只有纯读或单语句写。**反方案分析：为什么不选「手动管理 connection + 游标」绕开 ORM？**——裸驱动省掉了 ORM 的物化开销，但也丢掉了连接池治理、事务上下文、SQL 构造防注入这三层基础设施；成熟折中是「读路径复杂报表用 Core 层手写 SQL，写路径与业务对象用 ORM」——同一个 Engine，两种表达。

## 四、N+1：ORM 懒加载的生成机制与消灭路径

N+1 的机制：ORM 默认懒加载（SQLAlchemy `lazy="select"`），访问关系属性时才发 SQL——查 100 个订单（1 条 SQL），逐个访问 `order.user.name` 就发 100 条 SQL，这是「代码看着优雅、监控看着恐怖」的经典生成器：

```mermaid
flowchart TD
    A["查询订单列表 - 1 条 SQL"] --> B{"遍历访问 order.user"}
    B -->|"lazy 默认 - 每对象一条"| C["再发 100 条 SQL"]
    B -->|"selectinload 预加载"| D["第二条 IN 查询批量取回 - 共 2 条"]
    B -->|"joinedload 联表预加载"| E["一条 LEFT JOIN 取回 - 共 1 条"]
    C --> F["数据库 QPS 放大两个数量级"]
    style D fill:#a8e6a3
    style E fill:#a8e6a3
    style F fill:#ff8b94
```

选型口诀：`selectinload` 发第二条 `IN (...)` 批量查询——行数多、无重复行、适合一对多，是默认推荐；`joinedload` 一条 JOIN 取回——适合多对一，但一对多时结果集会笛卡尔式膨胀。**反方案分析：为什么不选「全部改成 joinedload 一劳永逸」？**——JOIN 的列复制让网络传输与结果物化成本随关系深度平方增长，多层关系链一加载，单条 SQL 变成千行宽表；而 selectinload 的查询条数与关系层数线性相关、每条都是走索引的批量主键查询。业内惯例是「宁可两条窄 SQL，不要一条宽 SQL」。

排查 N+1 不靠肉眼：SQLAlchemy 的 `echo=True` 只适合本地；生产用 `before_cursor_execute` 事件钩子统计单请求 SQL 条数，超过阈值告警——「单请求 SQL 条数」是比慢查询日志更早发现 N+1 的指标。

## 五、读写分离与分库分表：Python 生态的真实水位

### 读写分离：两个 Engine + 显式路由

主从复制的拓扑与读请求的路由判定——一致性等级决定读哪个库：

```mermaid
flowchart TD
    W["写请求"] --> M["主库"]
    M -->|"异步复制 - 延迟毫秒到秒级"| S1["从库 1"]
    M -->|"异步复制"| S2["从库 2"]
    R1["强一致读 - 余额/写后立读"] --> M
    R2["可容忍旧读 - 列表/报表"] --> S1
    R2 --> S2
    style M fill:#ffd3a5
    style R1 fill:#ff8b94
    style R2 fill:#a8e6a3
```

```python
write_engine = create_engine("mysql+pymysql://...master...", pool_pre_ping=True, pool_recycle=3600)
read_engines = [create_engine("mysql+pymysql://...slave1..."), create_engine("mysql+pymysql://...slave2...")]

def read_engine_for(session_hint=None):
    return random.choice(read_engines)   # 简单随机；讲究一点按负载加权
```

主从复制的延迟决定了治理红线：**写后立读必须走主库**——写入后立刻查询（创建订单后跳转详情页），如果读走了还落后的从库，用户会看到「订单不存在」。落法是写后短时间内把该会话的读强制路由主库（会话级标记 + TTL）。另外事务必须整体走主库——把一个事务的语句分散到主从上，等于放弃原子性。

**反方案分析：为什么不选「中间件代理层自动读写分离」？**——代理（ProxySQL 这类，公开开源项目）对应用透明、语言无关，但 Python 侧引入代理意味着多一跳网络 + 多一个需要治理的组件，且「写后立读」这类会话语义仍然要应用配合（代理无法替你决定业务语义）。中小规模先在应用层用两个 Engine 显式路由，规模到代理能摊薄运维成本时再上代理——工具跟着量级走，不是跟着潮流走。

### 分库分表：Python 侧没有银弹

必须如实记录生态现状：Java 侧有成熟的分片中间件，Python 侧**没有同等成熟度的透明分片中间件**——主流做法有两条：一是在代理层做（ShardingSphere-Proxy 这类语言无关的代理，Python 应用照常连 MySQL 协议）；二是应用层自定义路由（按分片键 hash 取模选 Engine），SQLAlchemy 的 HorizontalSharding 扩展（`sqlalchemy.ext.horizontal_shard`）提供会话级多 Engine 路由的原语，但分片键选择、跨片查询、扩容迁移都要自己扛。业内认知是：**能不拆就不拆**——先上索引优化、读写分离、归档冷数据、换更大规格，单表行数过亿或单库写瓶颈坐实后再动分片，因为分片的真正代价是「所有跨片操作从此要按分布重新设计」。

### 事故复盘：一次「连接被杀」的排查记录

某服务凌晨批量任务稳定报 `MySQL server has gone away`。排查路径：先看服务端 `Aborted_clients` 计数在增长——确认是服务端主动断连；再查中间链路，发现数据库前面挂的负载均衡对空闲 TCP 的回收窗口是 10 分钟，而批量任务两个阶段之间会空闲 20 分钟。复盘结论：`pool_recycle` 默认关闭（-1），空闲连接成了负载均衡的清理对象。修复动作：recycle 设 300 秒 + pre_ping 常开 + 任务空闲段改为心跳保活。教训：**连接池参数不是性能参数，是可用性参数**——它们的默认值只保证「demo 能跑」，不保证「凌晨三点不断连」。

### 事故复盘：一次「从库读到旧数据」的资损险情

一次运营后台改造后，用户反馈「充值成功但余额没变」。排查路径：先查支付回调日志——写入主库成功；再查用户看到的查询——路由到了复制延迟 3 秒的从库；最后发现改造时把「余额查询」统一挪到了读库，没给「写后立读」场景留主库路由。复盘动作：写后 N 秒内的同会话读强制走主库；余额类强一致读永久走主库；从库延迟纳入监控告警。这次复盘沉淀的判断标准：**读哪个库不是技术偏好，是业务一致性等级的表达**——每一类读都要显式回答「能容忍多旧」。

💡 **实战提示：用事件钩子量化每请求 SQL 条数**。在 `before_cursor_execute` 钩子里给当前请求计数，超过阈值（如 30 条）打日志或上报指标——N+1、循环内查询、漏预加载都会第一时间现形，比等慢查询日志早一个阶段。

💡 **实战提示：连接串永远带 charset=utf8mb4 并显式过 Alembic**。emoji 与生僻字入库报错的根源九成在连接字符集与表字符集不一致；表结构变更一律走迁移工具并在测试库演练，直接改生产表结构的回滚成本是「不可逆」三个字。

💡 **实战提示：给 Session 配「请求结束必关」的框架钩子**。Flask 用 `teardown_request`、Django 用 `request_finished` 信号统一 `session.close()`——依赖程序员「记得关」的治理都会在某个深夜失效，Session 泄漏的表现是连接池水位缓慢爬升直到排队。

## 六、什么时候用 / 什么时候不用

**什么时候用 ORM**：业务对象关系复杂、增删改频繁、需要事务工作单元与迁移工具（Alembic）配套的场景——ORM 的价值在治理与防注入，不在性能。**什么时候不用 / 少用**：复杂分析查询（多表聚合、窗口函数）用 Core 层手写 SQL 更直白；超高性能的批量写入用 `executemany`/LOAD DATA 路径。**明确推荐**：新项目默认 SQLAlchemy 2.0 风格（`select()` 语句 + `Session.begin()`），Django 项目留在 Django ORM——跨框架混用两套 ORM 是维护灾难。

**什么时候上读写分离 / 分库分表**：读 QPS 压垮单库且读容忍秒级旧数据 → 读写分离；写吞吐或单表行数到临界（业内经验参考：单表行数过亿、B+ 树层高与缓冲池命中率恶化，公开口径）→ 先归档再评估分片。反着说：读放大还很小、瓶颈在慢 SQL 时，上读写分离只会把烂 SQL 复制到多台机器。

## 七、Trade-off：每一步都在付出什么

| 选择 | 得到 | 付出 | 适用判断 |
|---|---|---|---|
| pool_pre_ping 常开 | 死连接不进业务 | 每次借连接多一次 PING | 生产默认 |
| pool_recycle 短周期 | 主动换血躲开杀手 | 重建连接的偶发开销 | 与 pre_ping 配合 |
| Session 按请求生命周期 | 数据新鲜、锁窗口短 | 对象缓存失效、多查几条 | Web 默认 |
| 事务内禁 RPC | 行锁持有时长可控 | 先查后写的编排复杂度 | 必守纪律 |
| selectinload 预加载 | 消灭 N+1 | 多一条 IN 查询 | 关系默认显式声明 |
| 读写分离 | 读吞吐线性扩展 | 复制延迟一致性问题 | 读多写少场景 |
| 代理层分片 | 应用无感知 | 多一跳 + 组件治理 | 规模摊薄成本后 |
| 应用层分片 | 无中间件依赖 | 分片键渗透所有查询 | 无合适代理时 |

贯穿全篇的设计思想：**数据库治理是把「隐式行为」翻译成「显式决策」**——ORM 的每个默认值（懒加载、事务即生命周期、池参数缺省）都是一种隐式契约，治理就是逐个决定「保持还是覆盖」，并为每个覆盖写下理由。

## 八、不同量级的思考：架构约束驱动解法

- **十万级（日请求十万量级）**：约束来源是连接数与慢 SQL，思考方式是监控驱动——这一档的核心问题是「单请求 SQL 条数与慢查询有没有被观测」，而不是「要不要读写分离」。单库 + 正确索引 + 池参数治理足够；关键动作是慢查询日志阈值（如 200ms）与单请求 SQL 条数双告警。
- **百万级（日请求百万量级）**：约束来源是读吞吐与复制延迟，思考方式是读写分离驱动——这一档的核心问题是「每类读的一致性等级划清了没有」，而不是「多加几台从库」。显式主从路由 + 写后立读走主库 + 从库延迟告警成为标配，N+1 治理从「修 bug」升格为「上线检查项」。
- **千万级及以上**：约束来源是单库写吞吐与单表 B+ 树层高，思考方式是数据分布驱动——这一档的核心问题是「分片键怎么选才能让绝大多数查询单片完成」，而不是「拆成几片」。分片键渗透业务语义（按租户还是按用户）、跨片查询退化为异构检索（同步一份到 Elasticsearch 这类检索引擎）、扩容迁移方案先于分片落地设计。
- **自下而上的演进触发器**：慢 SQL 清零但 RT 仍高 → 查锁等待与连接池排队；读库 CPU 先到顶 → 读写分离；写库 CPU 先到顶 → 先归档与批量写改造，再谈分片。每一档的升级都由上一档的可观测数据触发——没有监控的分片是赌博。到亿级：这一档的核心问题是「数据架构与业务边界是否对齐」，而不是「分片数量够不够」——分片键选错的单片热点，加多少机器都救不回来，上下游系统（缓存、检索、队列）都要随数据分布重构。

## 你们可能会问

**Q1：SQLAlchemy 和 Django ORM 怎么选？**
跟着框架走：Django 项目用 Django ORM（admin、migration 生态一体），非 Django 项目用 SQLAlchemy（Core/ORM 双层表达、异步支持成熟）。跨框架评价优劣意义不大——两者都能覆盖 L2 场景，差异在生态绑定。

**Q2：异步 SQLAlchemy 值得迁吗？**
先看并发模型：asyncio 栈（FastAPI 等）必须用 async Engine + 异步驱动，否则同步调用会阻塞事件循环；传统多线程栈（Flask/Django 同步视图）迁移收益有限——GIL 与驱动执行模型不变，只换了等待方式。迁移成本主要在生态（Alembic 异步模板、测试夹具），按「新项目直接异步、老项目按需」执行。

**Q3：批量插入一万行数据怎么做才不慢？**
`session.add_all` 逐对象物化是慢路径；快路径是 Core 层 `insert().values()` 配 `executemany`（一次网络往返批量发）——两者差一个数量级以上（业内认知）。更大量级（百万行）走 `LOAD DATA INFILE`，应用侧生成 CSV。核心判断：ORM 对象物化是为「业务对象」准备的，纯数据搬运别付对象化开销。

**Q4：怎么发现「即将变成事故」的连接问题？**
三个先行指标：池的 `checkedout()` 持续逼近 pool_size + max_overflow（排队前兆）、数据库 `Threads_running` 毛刺、`Aborted_clients` 增长。配上池的 `pool_timeout` 告警——连接排队出现的那天，就是容量评审该开的那天。

## 自测三问

1. pool_pre_ping 与 pool_recycle 分别解决什么问题？为什么生产要同时配置？
2. Session 的事务从什么时候开始、到什么时候结束？「事务内禁 RPC」保护的是什么？
3. N+1 是怎么生成的？selectinload 与 joinedload 的适用边界在哪里？

## 开放问题

- SQLAlchemy 2.0 之后的异步生态与驱动层（asyncmy/aiomysql）仍在快速演进，异步栈的池治理参数语义是否与同步版完全对齐，值得持续验证。
- Python 生态能否出现「透明分片」级别的成熟方案，取决于社区对数据库网关方向的投入——在此之前，代理层与应用层路由仍是两条主线。

## 🎯 核心带走

- **核心一句话**：Python 侧 MySQL 治理 = 连接、事务、加载、路由四层显式化——池参数对抗断连、Session 边界控制锁时长、显式预加载消灭 N+1、路由策略表达一致性等级
- **机制链**：驱动与 GIL → 连接池参数 → 查询关键路径 → 事务边界 → N+1 机制 → 读写分离 → 分片水位
- **哪里会坏**：空闲连接被中间设备静默杀掉、事务内 RPC 拖长行锁、懒加载放大查询条数、写后立读落在延迟从库
- **边界**：本篇管应用与数据库之间的连接层治理；索引设计、SQL 调优、InnoDB 内核机制在 data 域 MySQL 系列展开

## 📌 数据与事实声明

- 写于 2026-09-16，机制以 SQLAlchemy 2.0 官方文档与 pymysql 源码为准；`wait_timeout` 默认 8 小时、InnoDB 默认隔离级别 REPEATABLE READ 为官方默认值
- 建连开销、批量写入差异、单表临界行数等数字均为业内认知或公开口径的经验参考，需按实际负载实测
- 两则事故叙事已匿名化并做细节脱敏，复盘结论按通用机制呈现

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 官方文档 | SQLAlchemy 2.0（Engine/Connection Pooling/ORM Session） | docs.sqlalchemy.org |
| 官方文档 | MySQL Server System Variables（wait_timeout 等） | dev.mysql.com/doc |
| 官方源码 | sqlalchemy/sqlalchemy（pool/impl.py、orm/session.py） | github.com/sqlalchemy/sqlalchemy |
| 原理书 | 《高性能 MySQL》（连接管理与复制章） | 公开出版 |
| 系列内篇 | 上一篇《Python 连接 Redis 缓存与分布式锁》/ 下一篇《Python 消息队列集成》 | 本系列 |
