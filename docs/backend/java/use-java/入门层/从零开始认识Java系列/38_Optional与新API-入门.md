---
title: Optional与新API
date: 2026-09-09
type: concept
tags: [Java]
wordCount: 3156
readMinutes: 10
---

# Optional 与新 API

> **一句话摘要**：Optional 是「可能没有的返回值」的类型化表达——**用类型系统替代「返回 null 然后祈祷调用方判空」**；它的正确定位是「返回值/链式传递」，不是字段与参数；配套的新 API 三件套——集合工厂方法（List.of 不可变）、var（局部类型推断）、文本块（多行字符串）——共同构成 Java 8/9+ 的「日常写法现代化」。

> **本文核心**：机制链 = **null 的三宗罪（NPE 随时炸/语义含混「没有 vs 没填」/判空靠纪律）→ Optional = 「可能缺席」的类型化（of/ofNullable 构造 → map/filter 链式 → orElse/orElseThrow 出口）→ 定位纪律（只作返回值，不作字段/参数/集合元素）→ 集合工厂（不可变 List.of/Set.of/Map.of）→ var（局部变量推断，右侧行拼接）→ 文本块（多行字符串的缩进管理）**——「让编译器帮你管空」是一次从纪律到类型的升级。

前置阅读：[Lambda 与函数式接口](./36_Lambda与函数式接口-入门.md)（API 同族）。null 的系统性治理（字段级）见[对象与类](./3_对象与类-入门.md)的不变量守卫。

## 1. 背景：null 是「十亿美元的错误」

Tony Hoare 对 null 发明的自嘲已成名言：null 混进「所有引用类型」导致——① NPE 随时随地（没有编译期防护）；② 语义含混（方法返回 null 是「没查到」「不该查」「查出错」？）；③ 判空靠人工纪律（漏一处就是线上 NPE）。Optional 的解法：**把「可能有值」编码进返回类型**——调用方拿到 `Optional<Order>` 编译器就「知道」必须处理缺席场景（链式 API 引导你安全解包）。

## 2. 核心机制：Optional 的用法体系与边界

```mermaid
flowchart TD
    OPT[Optional&lt;T&gt;] --> C1[构造: of 非空必填 / ofNullable 可空 / empty]
    OPT --> CH[链式中间操作] --> CH1[map: 值变换]
    CH --> CH2[flatMap: 变换返回 Optional 防嵌套]
    CH --> CH3[filter: 条件过滤]
    CH --> EX[出口: 三选一] --> E1[orElse/orElseGet: 缺席给默认]
    EX --> E2[orElseThrow: 缺席抛业务异常]
    EX --> E3[ifPresent/ifPresentOrElse: 有值才消费]
    WRONG[三大反模式] --> W1[Optional 当字段/参数]
    WRONG --> W2[get() 裸取(不加 isPresent 检查)]
    WRONG --> W3[Optional&lt;Collection&gt;(应返回空集合)]
```

- **构造纪律**：`of(x)` 断言非空（传 null 直接抛 NPE——快速失败）；`ofNullable(x)` 接受可能为空——**两者的选择就是「这个值可不可能缺席」的显式声明**。
- **orElse vs orElseGet 的经典坑**：`orElse(defaultExpr)` 的参数**无论有无值都会求值**（急切）——默认值带方法调用/重计算时必须用 `orElseGet(() -> compute())`（惰性）；「用了 orElse 导致默认逻辑总是执行」是性能与副作用双坑。
- **flatMap 防 Optional 嵌套**：`map` 的函数返回 `Optional<B>` 时会得到 `Optional<Optional<B>>`——flatMap 拍平（与 Stream 的 flatMap 同语义，36-37 篇联动）。
- **定位边界（为什么不当字段/参数）**：① 字段——Optional 不可序列化 + 两个状态的字段不如「空对象/null + 文档」清晰；② 参数——调用方负担 + 重载爆炸；**Optional 只服务「方法返回可能缺席」**（方法签名即文档：返回 Optional = 「我可能不给你东西」的显式声明）。
- **新 API 三件套**：① **集合工厂**（`List.of(1,2,3)`）——真不可变（拒绝 null、禁修改）替代 `Arrays.asList` 的定长视图与 `Collections.unmodifiable` 的包装；② **var**（JDK 10）——局部变量类型推断（仅局部、必须有初始化、「右侧行拼接」原则——`var map = new HashMap<String, List<Order>>()` 获益、`var x = getResult()` 读者懵逼则禁）；③ **文本块**（JDK 15 正式）——三引号多行字符串（JSON/SQL 模板可读性 + 缩进的 incidental whitespace 管理）。

## 3. 落地实践：Optional 的工程模板

```java
// 链式安全导航: 多级关系的一步到位
public String getCityOfLastOrder(long userId) {
    return userRepository.findById(userId)          // Optional<User>
        .flatMap(User::getLastOrder)                // Optional<Order>(flatMap 防嵌套)
        .map(Order::city)                           // Optional<String>
        .orElse("未知城市");                         // 出口给默认
}

// 出口抛业务异常: 缺席即业务错误
Order order = orderRepository.findById(id)
    .orElseThrow(() -> new BizException("ORDER_NOT_FOUND", "订单 " + id + " 不存在"));

// 配合 Stream: Optional 是 0/1 元素的流亲戚
list.stream().findFirst().map(Order::city).orElse("none");
```

四条纪律：① **领域方法返回 Optional 表示「业务上可能缺席」**（findById/findByKey——「查无」是合法业务态）；② **出口必须落定**（orElse/orElseGet/orElseThrow/ifPresent 四选一，禁止 Optional 泄漏到深层逻辑）；③ **集合返回空集合不返回 Optional**（`Collections.emptyList()`——空集合天然可遍历，Optional 反而多余）；④ **var 与文本块按可读性节制**（var 不用于「类型有业务含义」的场景；文本块用于多行常量模板）。

## 4. 生产视角：Optional 与新 API 的事故形态

- **orElse 的急切求值副作用**：`orElse(queryDefault())` ——每次都查库（哪怕有值）；性能与「默认逻辑的副作用」双炸。orElseGet 修正。
- **Optional 当字段导致的序列化崩坏**：字段 Optiona`l<String>` 不能被多数序列化框架正确处理（不可序列化）——「Optional 进 DTO 字段」的常见翻车。
- **Optional.get 裸取的 NPE 换皮**：get 在空时抛 NoSuchElementException——「判空危机换个异常名重演」。裸 get 进 code review 黑名单。
- **List.of 的不可变误用**：返回 List.of 后被下游 add——UnsupportedOperationException。区分「不可变返回」（对外防御）与「可变工作集合」（内部构建）。
- **文本块的缩进陷阱**：结束三引号的位置决定「公共缩进剥离量」——缩进错位导致字符串前后空格与预期不符（内容对不齐的 JSON 解析失败）。

## 5. 主流系统怎么做：现代写法的生态采纳

| 特性 | 生态采纳 | 机制要点 |
|---|---|---|
| Optional | Spring Data 的 findByXxx 返回 Optional | 仓库层「可能缺席」的标准化 |
| 集合工厂 | List.of 全 industry 推广 | 不可变防御的零成本化 |
| var | 团队规范分裂（提倡派/保守派） | 可读性权衡无标准答案 |
| 文本块 | SQL/JSON 模板标配 | 多行可读性 |
| 记录类（40 篇） | 与 Optional 组合的数据返回 | record + Optional 的现代返回形态 |

规律：**「现代写法」的采纳率与团队规范强绑定**——特性本身简单，一致性地用才是工程价值；规范先行比特性先行重要。

## 6. 典型场景

- **仓库层查询**（数据级）：findById 返回 Optional——Spring Data 的标准范式。
- **配置缺省**（配置级）：Optional 链取配置 + orElse 默认值——配置缺席的显式处理。
- **多行模板**（可读级）：文本块写 SQL/JSON 报文模板——可读性与维护性双升。

## 7. 与相邻概念的区别

- **Optional vs null 判空**：类型化契约 vs 人工纪律——「编译器与 API 引导」替代「记忆与 review」；但 Optional 只覆盖「返回缺席」域，字段/参数的 null 治理仍靠不变量设计（@NonNull 注解/构造器校验）。
- **Optional vs 抛异常**：缺席是「业务合法态」用 Optional；缺席是「错误」用 orElseThrow 抛业务异常——「合法缺席 vs 异常失败」的语义分界（异常篇的分界在空值域的重演）。
- **var vs dynamic**：var 是编译期推断（类型仍静态、IDE 全支持）vs 动态类型（运行期决定）——「推断」不是「动态」。
- **本篇 vs Stream（37 篇）**：Optional 可视为「0/1 元素流」——API 同源（map/filter/flatMap），语义同构（缺席 = 空流）。

## 8. 常见误区与不适用

- **「Optional 是 null 的全面替代」**：它只替代「方法返回可能缺席」——字段/参数/集合元素的 null 治理是另一战场（不变量设计 + 注解体系）。
- **「isPresent+get 等价于判空」**：语法换了思想没换——「检查再取」的命令式用法丢失 Optional 的链式价值；用 map/flatMap/orElse 系表达。
- **「Optional.ofNullable 万能」**：ofNullable 让「不可能缺席的值」也能空——「of 与 ofNullable 的选择」就是「缺席是否合法」的声明；全用 ofNullable = 放弃语义声明。
- **「var 到处用更简洁」**：右侧行拼接（var x = getResult()）丢失类型信息——var 的适用判据是「右侧类型显然或冗长」；「var 满天飞」是可读性税。
- **不适用**：高吞吐热路径的 Optional 分配（对象分配成本敏感场景回退 null + 注解）；字段与参数（定位边界）。

## 9. 你们可能会问

- **Optional 为什么设计成不可序列化？** 刻意——序列化会鼓励「Optional 当字段」的错误用法（定位边界的技术强制）；需要序列化的「可能缺席」用 null + 文档或自定义。
- **orElse(null) 合法吗？** 合法但等于「放弃 Optional 换回 null」——意味着调用方要回到判空世界；这种「Optional 包装层的半途而废」要在 API 设计期消灭。
- **var 能用在方法参数/返回值吗？** 不能——只有局部变量（成员/签名必须显式类型）；「显式边界、推断内部」的设计哲学。
- **文本块的转义怎么处理？** `\s`（保留尾空格）、`\"\"\"`（内容中的三引号）、`\`（行尾续行）——转义集很小，难点在缩进剥离规则（结束引号位置 = 基准线）。
- **怎么渐进推广这些写法？** 从新代码规范起步（CI 里 Spectral/Checkstyle 规则约束 Optional 用法与 var 边界）→ 存量遇改即迁——「新账新办法」的迁移纪律。

## 🎯 核心带走

- **核心一句话**：Optional = 「可能缺席的返回值」类型化——链式导航 + 出口四选一，只作返回值不作字段参数。
- **链条复述**：of/ofNullable 声明 → map/flatMap/filter 链 → orElse/orElseGet/orElseThrow 出口。
- **失效点与边界**：orElse 急切求值；裸 get 换皮 NPE；集合返回空集合不用 Optional。



**🎯 核心一句话**：Optional = 「可能缺席的返回值」类型化（链式 + 出口四选一，只作返回值）；新 API 三件套（不可变集合工厂/var/文本块）是「日常写法现代化」的普及件——用类型与机制替代判空纪律。

**5W 速记卡**：

| 维度 | 内容 |
|---|---|
| What | Optional 体系 + 集合工厂/var/文本块 |
| Why | null 的三宗罪用类型系统治理 |
| When | 可能缺席的返回值、不可变集合、多行模板 |
| Where | 方法返回值与局部代码 |
| How | of/ofNullable 声明 → 链式导航 → 出口四选一 → 定位纪律 |

💡 **实战提示**：orElseGet 替代带计算的 orElse；flatMap 防嵌套；裸 get 禁用；集合返回空集合；var 看右侧可读性。

**开放问题**：Kotlin 的空安全类型（类型层区分可空/非空）比 Optional 的包装式更彻底——Java 会不会在 Valhalla/Lyve 时代引入「类型级空安全」？Optional 会成为过渡方案吗？

**决策（何时用）**：领域查询返回推荐 Optional；对外集合返回推荐不可变工厂；多行模板推荐文本块；推荐「Optional 三反模式（字段/裸 get/含集合）」进 code review 清单。

**Trade-off（代价与反方案）**：Optional 用「包装分配与 API 长度」换「缺席的类型化」；不可变集合用「不可修改」换「防御零成本」；var 用「类型显式性」换「声明简洁」；文本块用「缩进规则学习」换「多行可读」——现代写法的共性是「编译器与机制多干一点，人少错一点」。

**演进视角**：Optional（8）到集合工厂（9）到 var（10）到文本块（15）到 record/sealed（17）——「日常写法现代化」是一条十年连续的演进线，每一步都在「减少样板与防御性噪音」；终点方向是「业务逻辑占满代码，机械代码归零」——40 篇的 record 与 41 篇的虚拟线程将完成这条线的最后两笔。

---

**下篇预告**：一纸官方认证的「现代 Java 数据载体」——下一篇[新日期时间 API](./39_新日期时间API-入门.md)讲 java.time 的不可变设计与账务刚需。

---

## 上下游地图

从系统架构的上下游看：**Lambda** 为本篇提供了地基——类型化缺席 的机制向上游承接、向下游 **Java 17(篇40)** 输出现代写法；架构上它是这条知识链上不可跳过的一环，跳读时建议先回上游补齐语境。

```mermaid
flowchart LR
    U0[Lambda]
    --> ME[本篇: 类型化缺席]
    ME --> DN0[Java 17(篇40)]
```

---


**自测三问**：

1. 你的领域查询返回 Optional 了吗？还是 null 加判空？
2. orElse 的默认值里有方法调用吗？
3. Optional 出现在字段或参数里了吗？

## 📌 数据与事实声明

Optional 语义、集合工厂、var（JEP 286）、文本块（JEP 378，JDK 15 正式）为 JEP 与 JLS 官方文档；「orElse 急切求值」为 Javadoc 明示行为；「null 十亿美元错误」为 Tony Hoare 公开演讲名言。以官方文档为准。

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 图书 | Effective Java 第 3 版（第 54-55 条 Optional/null） | Addison-Wesley（2019） |
| JEP | 286(var)/361(switch)/378(文本块) | openjdk.org/jeps |
| 文档 | java.util.Optional 官方文档 | docs.oracle.com |
| 系列文章 | 新日期时间 API（下一篇） | 本仓库同系列 |
