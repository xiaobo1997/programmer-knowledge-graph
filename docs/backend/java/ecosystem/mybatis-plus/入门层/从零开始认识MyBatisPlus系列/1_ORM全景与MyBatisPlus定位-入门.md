---
title: "ORM 全景与 MyBatis-Plus 定位：从 JDBC 手写 SQL 到只增强不改变"
type: concept
tags: [MyBatis-Plus, ORM, MyBatis, JPA, L1入门层]
date: 2026-09-02
wordCount: 3185
readMinutes: 10
---

# ORM 全景与 MyBatis-Plus 定位：从 JDBC 手写 SQL 到只增强不改变

> 一句话摘要：MyBatis-Plus 是 MyBatis 的增强工具包——它不改变 MyBatis 的任何行为，只是把「单表 CRUD 的样板代码」从你手里接管过去。**理解它之前，先理解 JDBC、MyBatis、JPA 各自解决了什么问题，你才知道 MP 站在哪一层、边界在哪。**

---

## 1. 背景：为什么 Java 持久层有这么多框架

写 Java 后端，数据总得落库。你可能会问：JDBC 是 Java 官方标准，为什么大家还要用 MyBatis？为什么用了 MyBatis，还要再来一个 MyBatis-Plus？它们之间是替代关系还是叠加关系？

要回答这些问题，得把 Java 持久层这二十多年的演进看一遍——JDBC → 全自动 ORM → 半自动 MyBatis → MyBatis 增强工具。每出来一层，都是上一层的痛点没被解决。

**本篇任务**：把这条演进线讲透。读完你能回答三个问题：

1. 从 JDBC 到 MyBatis-Plus，每一层解决了什么、留下了什么
2. MyBatis-Plus 的「只增强不改变」到底是什么意思
3. 它和 JPA 这类全自动 ORM 的本质区别在哪，什么时候该用谁

---

## 2. 核心内容：持久层四层演进

### 2.1 第一层：JDBC——一切的地基，也一切的痛

JDBC（Java Database Connectivity）是 Java 访问数据库的官方标准接口。所有 ORM 框架底层都逃不开 JDBC，但直接用 JDBC 写业务代码，痛点是实打实的：

```java
// 用 JDBC 查一个用户——7 步样板代码
Connection conn = null;
PreparedStatement ps = null;
ResultSet rs = null;
try {
    conn = dataSource.getConnection();          // 1. 拿连接
    ps = conn.prepareStatement("SELECT * FROM t_user WHERE id = ?"); // 2. 预编译 SQL
    ps.setLong(1, 1L);                          // 3. 手绑参数
    rs = ps.executeQuery();                     // 4. 执行
    while (rs.next()) {                         // 5. 遍历结果集
        User u = new User();
        u.setId(rs.getLong("id"));              // 6. 手写结果映射
        u.setName(rs.getString("name"));
        // ... 每列写一行
    }
    return u;
} finally {
    rs.close(); ps.close(); conn.close();       // 7. 手关资源
}
```

一张表 7 步，十张表 70 步，而且全是复制粘贴。于是出现了两个演进方向：

- **全自动 ORM（JPA/Hibernate）**：把「表 ↔ 对象」映射做成自动化，让你基本不写 SQL
- **SQL 映射框架（MyBatis）**：保留 SQL 的显式控制，只把连接管理、参数绑定、结果映射这些样板自动化

### 2.2 第二层：JPA/Hibernate——全自动路线的天花板与代价

JPA（Java Persistence API）是规范，Hibernate 是它最流行的实现。它的思路是：**你定义实体类和表的关系，框架替你生成 SQL。**

```java
@Entity
@Table(name = "t_user")
public class User {
    @Id
    private Long id;
    private String name;
}

// 查用户——不需要写 SQL
User u = entityManager.find(User.class, 1L);
```

全自动带来的好处是开发快，但代价也很集中：

- **SQL 是框架生成的**，一旦慢查询，你要去猜框架生成了什么 SQL，还得学会控制它（N+1 查询、懒加载、缓存都是这个坑的延伸）
- **复杂查询别扭**：多表 join、动态条件、批量更新，用 Criteria API 写出来比 SQL 还难读
- **学习曲线陡**：实体状态（托管/游离/删除）、级联策略、一级二级缓存，概念一堆

国内互联网公司为什么大规模倒向 MyBatis？一句话：**SQL 是可读、可控、可优化的资产**。DBA 要审查 SQL、线上慢查询要改写 SQL，这些在「SQL 由你写」的框架里是顺理成章的；在「SQL 由框架生成」的框架里，你控制力天然弱一截。这就是「半自动」路线的土壤。

### 2.3 第三层：MyBatis——半自动路线，把 SQL 还给开发者

MyBatis 的定位一句话：**SQL 还是你写，框架只干脏活累活**——连接管理、参数绑定、结果映射、动态 SQL 拼接，这些它全包了。

```xml
<!-- MyBatis：SQL 显式写，动态条件用标签拼 -->
<select id="selectByName" resultType="com.example.User">
    SELECT * FROM t_user
    WHERE 1 = 1
    <if test="name != null">
        AND name LIKE CONCAT('%', #{name}, '%')
    </if>
</select>
```

相比 JDBC，开发效率上来了；相比 JPA，SQL 依然完全可控。但用久了，新的痛点浮出水面：

**单表 CRUD 的样板代码还是得手写。** 每张表你都要写一套 `insert / deleteById / selectById / updateById / selectList` 的 XML 或注解 SQL。表一多，这些方法高度雷同，纯属体力活。而且 `WHERE 1 = 1` 这种动态 SQL 技巧，每个团队都要重新踩一遍。

> tips：(WHERE 1=1 的来由) MyBatis 动态 SQL 里 `WHERE 1=1` 是为了让 `<if>` 拼条件时不用判断「是不是第一个条件、要不要加 AND」——老写法有性能隐患（索引利用差、无法用查询缓存），现在官方推荐 `<where>` 标签自动处理前缀 AND/OR。看见老代码里的 1=1，知道它在解决什么问题即可，新代码用 `<where>`。

### 2.4 第四层：MyBatis-Plus——只增强不改变

MyBatis-Plus（简称 MP）对 MyBatis 的定位，官方原话是 **「只增强不改变」**：

- **不改变**：MyBatis 原有的能力全部保留——XML 照写、自定义 SQL 照写、拦截器照用
- **只增强**：在 MyBatis 之上补一套「通用 CRUD + 条件构造器 + 插件」体系，把单表操作的样板消灭掉

```java
// MyBatis-Plus：继承 BaseMapper，单表 CRUD 零 SQL
public interface UserMapper extends BaseMapper<User> {
    // 不需要写任何方法！selectById / insert / updateById / deleteById
    // 这些通用方法由 MP 在启动时自动注入
}

// 业务代码里直接用
User u = userMapper.selectById(1L);                    // 按主键查
userMapper.insert(newUser);                            // 插入
List<User> list = userMapper.selectList(               // 条件查询
    new LambdaQueryWrapper<User>()
        .eq(User::getStatus, 1)
        .like(User::getName, "张"));
```

对比一下：同样一张 `t_user` 表，JDBC 要 7 步样板，MyBatis 要写一个 XML 文件加 5 个方法，MP 只需继承一个 `BaseMapper`——**单表 CRUD 的代码量降到了接近 JPA 的水平，但 SQL 的掌控力还在你手里**（需要复杂查询时随时写自定义 SQL 或 XML）。

```
演进线一句话总结：
JDBC（全手写）→ JPA/Hibernate（全自动，放弃 SQL 控制）
                → MyBatis（半自动，SQL 归你，样板归我）
                → MyBatis-Plus（在 MyBatis 之上，把单表样板也收走）
```

---

## 3. 生态对照：MP vs JPA vs 原生 MyBatis

选型时别只看框架名字，要看你的业务到底在跟什么打交道：

| 维度 | JPA/Hibernate | MyBatis | MyBatis-Plus |
|---|---|---|---|
| SQL 由谁写 | 框架生成 | 开发者写 | 单表自动生成，复杂 SQL 开发者写 |
| 单表 CRUD 效率 | 最高（几乎零代码） | 低（每表手写方法） | 高（继承 BaseMapper） |
| 复杂查询掌控力 | 弱（要学 Criteria/JPQL 控制） | 强（SQL 全显式） | 强（自定义 SQL/XML 与 MP 共存） |
| 动态 SQL | 弱（要拼 JPQL/Criteria） | 强（`<if>/<where>` 标签） | 最强（Java 条件构造器 + XML 都行） |
| 学习曲线 | 陡（实体状态/级联/缓存概念多） | 平（会 SQL 就会） | 平（会 MyBatis + 少量注解即可） |
| 团队 DBA 审 SQL | 难（SQL 藏在框架里） | 易（SQL 全在 XML） | 易（XML 保留，自动 SQL 可看日志） |
| 典型场景 | 标准 CRUD、领域模型复杂 | 复杂查询多、SQL 优化驱动 | 单表 CRUD 为主 + 偶发复杂查询 |

**选型判断**（金融/交易类业务尤其适用）：

- **项目以单表 CRUD 为主**（运营后台、账户基础资料、配置管理）→ MP 省下的代码量立竿见影
- **项目以复杂统计报表、多表关联查询为主** → 原生 MyBatis 或 MP + XML 混用，SQL 仍是主力
- **强领域模型、对象关系复杂**（继承/多态/集合映射重度使用）→ JPA 的领域建模能力更合适，但要在团队里养熟实体状态管理

> tips：(金融项目的现实) 信贷/账务系统里，对账、试算、日终批处理这类场景对 SQL 的掌控要求极高——一条 UPDATE 影响多少行、事务边界在哪，必须看得见摸得着。这也是这类系统普遍选择 MyBatis 系而非 JPA 系的底层原因：**钱相关的 SQL 要能审、能优化、能复盘**。

---

## 4. 边界辨析：MP 不做什么

理解一个工具，更要理解它的边界。MP 的「只增强」集中在**单表操作**，它明确不越界的地方有几类：

**一是复杂 SQL 不替你写。** 多表 join、子查询、窗口函数、复杂聚合，MP 的通用方法不覆盖——这些请回到 XML 或注解 SQL，用 MyBatis 原生能力写。MP 甚至为此留了接口：自定义 SQL 里可以直接接收 MP 的条件构造器，把动态条件交给 MP、把 SQL 骨架留给自己（后续系列第 12 篇展开）。

**二是强约束场景不替你兜底。** 分页、乐观锁、逻辑删除这些能力，MP 通过「插件」机制提供——但插件是**可选依赖**，而且从 3.5.9 版本起官方把插件部分拆成了需要单独引入的依赖。这意味着：依赖配错、插件没注册、拦截器顺序不对，功能就是静默不生效的。这个「版本坑」是本系列反复强调的主线之一。

**三是它不改变 MyBatis 的底层机制。** MP 生成 SQL 的方式、插件拦截的方式，全部建立在 MyBatis 的 MappedStatement、拦截器四大对象这些机制之上。所以想真正用好 MP（而不是停留在调用 API），MyBatis 原理是必修课——本系列特性层会顺着这条线往下挖。

> tips：(MP 与 MyBatis 的版本绑定) MP 3.5.x 依赖 MyBatis 3.5.x，但 starter 通常已带好兼容版本，不建议手动改 MyBatis 版本号——用错版本会出现启动报错或方法签名找不到。让 MP 管理 MyBatis 版本，你只操心 MP 版本。

---

## 5. 5W 速记卡

| W | 一句话 |
|---|---|
| What | MyBatis-Plus 是 MyBatis 的增强工具包，定位「只增强不改变」 |
| Why | 单表 CRUD 样板代码太多；不想放弃 SQL 掌控力又想要 JPA 的开发效率 |
| Where | Java 后端、Spring Boot 项目最常用（有官方 starter） |
| When | 单表 CRUD 为主的业务；复杂查询照写 SQL 与它共存 |
| Who | 会 MyBatis 的团队几乎零成本上手；金融等重 SQL 掌控场景尤其合适 |

**一句话总结**：持久层演进到 MyBatis-Plus，本质是「SQL 掌控力」和「CRUD 开发效率」这对矛盾在 Java 生态里的一次次再平衡——JDBC 全手写，JPA 全自动，MyBatis 把 SQL 还给开发者，MP 再把单表样板收走。看懂这条线，你就知道 MP 站在哪、能替你干什么、哪些事还得你自己来。

**下一篇预告**：[2_快速上手与工程集成](./2_快速上手与工程集成.md) —— 用一个 Spring Boot 3 工程把 MP 跑起来，看第一个 CRUD 和 yml 配置背后发生了什么。

---

## 📌 数据与事实声明

本文所述 MyBatis-Plus 版本特性基于 3.5.x 主线（截至 2026-09-02，最新 release v3.5.17）；「3.5.9+ 插件改为可选依赖」为官方发布说明中的版本行为，具体坐标与兼容矩阵以官方文档为准。JDBC/JPA/MyBatis 的框架定位属长期稳定的技术常识，不随版本变化。

## 📚 参考资料

| 类型 | 标题 | 来源 |
|---|---|---|
| 官方文档 | MyBatis-Plus 官方文档（快速开始/安装） | baomidou.com |
| 官方仓库 | MyBatis-Plus（baomidou/mybatis-plus） | github.com/baomidou/mybatis-plus |
| 官方文档 | MyBatis 官方文档（动态 SQL） | mybatis.org/mybatis-3/zh_CN/dynamic-sql.html |
| 官方规范 | JPA（Jakarta Persistence） | jakarta.ee/specifications/persistence |
| 书籍 | 《深入浅出 MyBatis 技术原理与实战》杨开振 | 电子工业出版社，2016-8 |
