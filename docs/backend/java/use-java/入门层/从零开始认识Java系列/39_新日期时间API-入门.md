---
title: 新日期时间API
date: 2026-09-09
type: concept
tags: [Java, 日期时间]
wordCount: 3264
readMinutes: 10
---

# 新日期时间 API

> **一句话摘要**：java.time（JSR-310）是对老 Date/Calendar 的全面替代——**不可变设计 + 职责分离（LocalDate 只管日期/LocalTime 只管时间/LocalDateTime 合体/Instant 时间线瞬间/ZonedDateTime 带时区）**；它解决老 API 的三宗罪（可变性线程不安全/职责混乱/时区处理缺失）；金融账务的刚需落点：Instant（时间线）/ZoneId（时区）/Period 与 Duration（两种时间差）的分工。

> **本文核心**：机制链 = **老 API 三宗罪（Date 可变线程不安全/月份从 0 起/时区缺失）→ java.time 的类型分离哲学（日期/时间/时刻/时区 各归各类）→ Instant（UTC 时间线上的一个点——机器时间）与 LocalDateTime（墙上时间——人类时间，无时区语义）的分界 → 时区规则（ZoneId/ZoneRules 的夏令时处理）→ Period（年月日差）vs Duration（秒纳秒差）**——「机器时间与人类时间的分离」是整个 API 的设计灵魂。

前置阅读：[不可变设计](./6_字符串与常量池-入门.md)（String 的同款哲学）。跨机房时钟公理见[分布式时钟](../../../../../architecture/system-design/distributed-theory/入门层/从零开始认识分布式理论系列/9_分布式时钟-入门.md)。

## 1. 背景：老 Date/Calendar 的三宗罪

`java.util.Date`（1970 年代设计语言的角度看都不现代）：① **可变**——`date.setMonth(3)` 直接改对象，共享即事故（线程不安全）；② **职责混乱**——Date 同时表达「日期、时间、时区」，月份从 0 起（一月是 0），年份从 1900 起；③ **时区处理缺失**——Calendar 才有时区且 API 晦涩。JSR-310（Joda Time 作者主导，JDK 8 落地）重造：**不可变 + 职责分离 + 时区一等公民**——新日期 API 常被称为「JDK 8 最好的新特性」，因为它直接消灭了一整类账务事故。

## 2. 核心机制：类型分离与机器/人类时间的分界

```mermaid
flowchart TD
    JAVA[java.time 类型分离] --> INST[Instant: UTC 时间线的一个点<br/>机器时间 无时区 系统间传递用它]
    JAVA --> LD[LocalDate/Time/DateTime: 墙上时间<br/>无时区语义 人类日历视角]
    JAVA --> ZDT[ZonedDateTime/OffsetDateTime: 墙上时间+时区/偏移<br/>人类时间+机器定位]
    JAVA --> PER[Period(年月日差) vs Duration(时分秒差)]
    LD -.atZone 绑定时区.-> ZDT
    ZDT -.toInstant.-> INST
    RULE[时区规则 ZoneId] --> R1[夏令时: 同一时区不同日期偏移不同<br/>LocalDateTime 无时区 过渡时刻会歧义]
    RULE --> R2[亚洲无夏令时≠无时区问题: 历史规则变更/跨区计算]
```

- **机器时间 vs 人类时间的设计灵魂**：**Instant** 是「UTC 时间线上的一个绝对点」（纳秒精度、无时区无日历——机器间的时刻传递标准）；**LocalDateTime** 是「墙上挂钟显示的时间」（没有时区，同一时刻在不同时区显示不同）；**ZonedDateTime** = LocalDateTime + ZoneId（「东京的 2026-09-09 14:00」）。**核心纪律：系统间传递时刻用 Instant（或带偏移的 OffsetDateTime）；展示与日历计算用 LocalDate(ZonedDateTime)**——混用是时区事故的起点。
- **夏令时（DST）的歧义时刻**：夏令时切换时存在「不存在的时刻」（春季跳表：2:30 不存在）与「重复的时刻」（秋季回拨：1:30 出现两次）——LocalDateTime 无时区语义无法区分；解法：`atZone(ZoneId)` 让时区规则裁决歧义。中国无夏令时 ≠ 无时区问题——历史规则（1986-1991 中国曾有夏令时）与跨区计算仍会踩中。
- **Period vs Duration 的分界**：Period 是「人类日历的差」（3 年 2 个月——受日历规则影响，加在 LocalDate 上才完整）；Duration 是「物理时间的差」（720 小时——秒纳秒级，不受日历影响）。「下个月的今天」用 `plusMonths(1)`（LocalDate 自己处理月末：1 月 31 + 1 月 = 2 月 28）；「30 天后」用 `plusDays(30)`——**业务语义选 API，不是随手 plus**。
- **线程安全与不可变**：全部类型不可变——共享无风险、运算返回新对象（`date.plusDays(1)` 不改原值——「以为 plus 改了自己」与 BigDecimal 同款新人坑，第 10 篇呼应）。

## 3. 落地实践：账务与时区的工程模板

```java
// 1. 系统间传递: Instant (UTC 时间线)
Instant paidAt = Instant.now();
entity.setPaidAt(paidAt);                     // DB 存 UTC(或 epoch millis)

// 2. 展示: 转换到业务时区
LocalDateTime beijingView = paidAt.atZone(ZoneId.of("Asia/Shanghai")).toLocalDateTime();

// 3. 日历计算: 业务语义选 API
LocalDate nextDue = LocalDate.now().plusMonths(1);      // 下月同日(月末自动钳制)
Duration elapsed = Duration.between(startTime, Instant.now());  // 物理时长

// 4. 账务日切: 显式时区的日边界
LocalDateTime dayStart = LocalDate.now(ZoneId.of("Asia/Shanghai")).atStartOfDay();

// 5. 解析格式化: 全线程安全(DateTimeFormatter 不可变 可全局共享)
DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyyMMdd HH:mm:ss");
LocalDateTime.parse("20260909 14:00:00", FMT);
```

五条纪律：① **DB 与内部传递统一 UTC（或 epoch millis），展示层才转时区**；② **时刻传递用 Instant/OffsetDateTime，不用 LocalDateTime**（无时区的时刻是有歧义的）；③ **DateTimeFormatter 全局共享**（不可变线程安全——SimpleDateFormat 的 ThreadLocal 包装时代结束）；④ **时区用 ZoneId 区域名**（"Asia/Shanghai"），不用固定偏移（+08:00 在夏令时区会错）；⑤ **日切/账期计算显式指定业务时区**。

## 4. 生产视角：日期时间事故的形态

- **时区错配的对账差异**：一台机器默认时区变化（容器未配 TZ）——`LocalDateTime.now()` 跨机器产生 8 小时偏差，日切数据错日。根治：now 一律带时区或全链路 Instant；容器 TZ 显式配置。
- **SimpleDateFormat 的串号**：共享实例并发 format——日期错乱（ThreadLocal 包装是旧解药，java.time 是新解药）。
- **夏令时的歧义解析**：`LocalDateTime.parse("2026-03-08T02:30:00").atZone(美东时区)`——该时刻不存在，ZonedDateTime 解析的偏移选择有讲究（gap 规则）；跨国业务（美/欧）必须测试 DST 边界。
- **「月初/月末」计算的边界**：`plusMonths` 的月末钳制（1/31 + 1 月 = 2/28）符合直觉但与业务「自然月」定义可能不一致——账期的「月」定义要与产品对齐并落文档。
- **老 Date 的边界混用**：新旧转换的 `date.toInstant()`、`Timestamp.toLocalDateTime()`——老接口边界处的精度与时区损耗（Timestamp 的纳秒截断）是过渡期暗坑。

## 5. 主流系统怎么做：日期时间的生态采纳

| 层 | 惯例 | 机制要点 |
|---|---|---|
| DB 存储 | DATETIME/TIMESTAMP 存 UTC | JDBC 4.2+ 直接支持 java.time 类型 |
| JSON | ISO-8601 字符串（默认） | Jackson java.time 模块 |
| 前端展示 | ISO 字符串 + 前端时区转换 | 展示层才有时区 |
| 账务日切 | 显式业务时区 + 日切表 | 日边界是业务定义不是物理定义 |
| 分布式 | Instant/epoch millis | 时钟公理（理论系列时钟篇） |

规律：**「存储 UTC、展示转区、账务显式时区」三段式**是行业收敛的标准答案；时区规则的复杂度（夏令时/历史变更）由 ZoneRules 数据库（IANA tzdata）承载——升级 tzdata 是运维清单项。

## 6. 典型场景

- **账务日切**（金融级）：显式时区的日边界 + 流水归属日——资金对账的时间地基。
- **跨国业务时刻**（全球级）：Instant 传递 + 双时区展示（用户时区 + 业务时区）。
- **周期任务与账期**（日历级）：plusMonths/Period 的日历语义计算。

## 7. 与相邻概念的区别

- **Instant vs LocalDateTime**：时间线上的点 vs 墙上的显示——「同一 Instant 在东京和伦敦是两个 LocalDateTime」；跨机器用前者、给人看用后者。
- **ZonedDateTime vs OffsetDateTime**：完整时区规则（含夏令时历史/未来）vs 固定偏移——ZDT 服务本地业务、ODT 服务协议交换（ISO 标准偏好 ODT 的确定性）。
- **Period vs Duration**：日历差 vs 物理差——「一个月」与「30 天」不是同一个数。
- **本篇 vs 分布式时钟篇**：java.time 管「单机的类型正确」；分布式时钟篇管「跨机器的时序正确」（逻辑时钟/HLC）——两层互补（类型正确 ≠ 时序正确）。

## 8. 常见误区与不适用

- **「LocalDateTime.now() 拿到的就是当前时间」**：拿到的是「JVM 默认时区的墙上时间」——容器时区变化它就变；「当前时刻」的可靠表达是 `Instant.now()`。
- **「中国没有夏令时不用管时区」**：历史夏令时、跨国业务、tzdata 更新都在时区问题射程内——时区纪律是全或无。
- **「Date 和 LocalDate 随便互转」**：老转换需经 Instant/ZoneId 桥接（`date.toInstant().atZone(zone).toLocalDate()`）——转换点的时区语义要显式。
- **「Duration 可以算两个日期差几天」**：Duration 是物理时长（LocalDateTime/Instant 之间）；两个 LocalDate 的差用 `Period.between(a, b).getDays()` 或 `ChronoUnit.DAYS.between`——语义选类。
- **不适用**：极高精度时间测量（系统.nanoTime 单调时钟——时钟篇）；历史日期的非格里高利历（Chronology 接口存在但业务罕见）。

## 9. 你们可能会问

- **为什么 Instant 打印出来是 UTC？** Instant 就是 UTC 时间线（toString 按 UTC 格式）——它的 toString 不是「错误显示」，是「机器时间的本色」；给人看请转换时区。
- **DB 的 TIMESTAMP 和 java.time 怎么对应？** TIMESTAMP WITH TIME ZONE ↔ OffsetDateTime；TIMESTAMP（无时区）↔ LocalDateTime——DB 列类型的选择决定时区语义，建表期定好。
- **怎么处理「用户没填时区」的输入？** 默认业务时区显式声明（不靠机器默认）；用户时区从前端采集并随数据存档（历史展示不漂移）。
- ** Sommer 时间（夏令时）测试怎么做？** 用固定 ZoneId + 历史夏令时边界时刻做单元测试（美东 3 月第二个周日 2 点跳变）——DST 边界用例进跨国业务的测试模板。
- **老代码逐步迁移 java.time 的路径？** 边界处转换（框架已支持 java.time 的先改入口）→ 内部全面 java.time → 老类型只存边界——「边界桥接」渐进迁移。

## 10. 一句话总结 + 5W 速记卡 + 自测三问

**🎯 核心带走**：

- **核心一句话**：java.time = 不可变 + 类型分离（Instant 机器时间 / LocalDate 人类时间 / ZonedDateTime 时区裁决）——系统传递 Instant、展示转时区、账务显式时区、Period/Duration 按业务语义选。
- **链条复述**：老 API 三宗罪 → 类型分离哲学 → 机器/人类时间分界 → 夏令时歧义与时区规则 → Period/Duration 分工 → 工程五纪律。
- **失效点与边界**：LocalDateTime 无时区语义；Duration 不是日历差；单机类型正确 ≠ 分布式时序正确。

**5W 速记卡**：

| 维度 | 内容 |
|---|---|
| What | 类型分离 + 机器/人类时间 + 时区规则 |
| Why | 老 Date 的可变/混乱/无时区是账务事故温床 |
| When | 账务日切、跨国业务、日期计算、时区排查 |
| Where | DB（UTC）、服务内（java.time）、展示层（转区） |
| How | UTC 存储 → 显式 ZoneId → 业务语义选 API → formatter 全局共享 |

💡 **实战提示**：now 带 ZoneId 意识；内部传 Instant；ZoneId 不用固定偏移；月末语义与产品对齐；DST 边界测试。

**开放问题**：跨服务的时间语义正在向「事件溯源 + 单调时钟」演进——java.time 的「人类时间」类型群会与「机器时间线」类型（Instant）进一步分化成两套独立体系吗？

**决策（何时用）**：一切日期时间代码默认 java.time（老 Date 只在边界桥接）；资金/账务强制 UTC 存储 + 显式业务时区；推荐「时区三纪律」进账务系统评审清单。

**Trade-off（代价与反方案）**：UTC 存储用「展示层转换成本」换「全局一致性」；类型分离用「选型思考成本」换「语义清晰」；ZoneId 区名用「tzdata 更新依赖」换「夏令时正确」；不可变设计用「运算产生新对象」换「线程安全与可预测」——时间 API 的现代设计证明：把「容易做对」内建到类型里，比文档里写一百条纪律有效。

**演进视角**：Date（1995 的仓促设计）→ Calendar（补丁）→ Joda Time（社区正解）→ java.time（JSR-310 吸收 Joda 进标准）——「先有错误标准、社区造正确轮子、标准吸收轮子」是 Java 演进的最佳路径模型（虚拟线程同款路线）；时间 API 的教训与重生，是理解「为什么 Java 8 是分水岭」的最好注脚。

---

**下篇预告**：语法现代化的集大成——下一篇[Java 17 新特性](./40_Java17新特性-入门.md)讲 record/sealed/switch 表达式/文本块。

---

## 上下游地图

从系统架构的上下游看：**对象与类** 为本篇提供了地基——时间类型分离 的机制向上游承接、向下游 **Java 17(篇40)、金融实战** 输出账务地基；架构上它是这条知识链上不可跳过的一环，跳读时建议先回上游补齐语境。

```mermaid
flowchart LR
    U0[对象与类]
    --> ME[本篇: 时间类型分离]
    ME --> DN0[Java 17(篇40)]
 DN1[金融实战]
```

---

## 📌 数据与事实声明

java.time 类型语义（Instant/LocalDate/ZonedDateTime/Period/Duration）为 JSR-310 与 JDK 官方文档；夏令时规则由 IANA tzdata 承载（官方记录）；JDBC 4.2 的 java.time 支持为 JDBC 规范；「Date 三宗罪」为公开技术共识（JSR-310 设计文档背景）。以官方文档为准。

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 规范 | JSR-310: Date and Time API | jcp.org |
| 文档 | java.time 官方教程（Date-Time） | docs.oracle.com |
| 图书 | Java 核心技术 卷II（日期时间章节） | Pearson（2022） |
| 系列文章 | 分布式时钟（时序公理） | 本仓库 distributed-theory/ |
