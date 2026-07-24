# 示例代码仓库链接规范

> 文档和示例代码分离的规则。

## 原则

**文档只放「为什么、怎么做、踩过什么坑」——认知本身。**

完整可运行的项目代码放独立仓库。文档里需要演示时，**贴链接**，**不贴大段代码**。

## 链接格式

```
完整仓库：https://github.com/xiaobo1997/programmer-code-examples

某文件：
https://github.com/xiaobo1997/programmer-code-examples/blob/main/<path>/<file>

某目录：
https://github.com/xiaobo1997/programmer-code-examples/tree/main/<path>

某 commit：
https://github.com/xiaobo1997/programmer-code-examples/blob/<sha>/<path>
```

## 链接放在文章哪里

- **行内引用**：解释一个概念时，立刻给链接
  > Spring Boot 的自动装配是通过 `@SpringBootApplication` 触发的。
  > 完整示例见 [programmer-code-examples/spring-boot-autoconfig](https://github.com/xiaobo1997/programmer-code-examples/tree/main/spring-boot-autoconfig)。

- **「参考」章节**：文章末尾统一列出
  ```markdown
  ## 参考
  
  - [示例代码：spring-boot-autoconfig](https://github.com/...)
  - [示例代码：jvm-tuning-demo](https://github.com/...)
  ```

## 什么时候在文档里写代码块

- ✅ **允许**：< 20 行的关键代码片段（重点说明）
- ✅ **允许**：配置文件示例（yaml / json / properties）
- ✅ **允许**：命令片段
- ❌ **不允许**：完整的方法实现
- ❌ **不允许**：完整类文件
- ❌ **不允许**：完整项目结构

## 怎么写「完整可运行」代码示例

放示例代码仓库时，要保证：

- 仓库根目录有 README.md 说明项目用途、运行方法
- 至少一个 demo 入口（如 `main()` 或测试用例）
- `package.json` / `pom.xml` / `go.mod` 写清依赖
- `.gitignore` 写好（不要把 build 产物提交）

## 文档 → 示例代码的工作流

1. 写文章时，发现需要完整 demo
2. 在示例代码仓库新建子目录（按文章 slug 命名）
3. 写完整代码 + README
4. commit 并 push
5. 回到文档仓库，把链接加到文章里
6. 写 `docs/changes/YYYY-MM-DD-链接到示例代码-xxx.md`

## 示例代码仓库待建

`xiaobo1997/programmer-code-examples` 还没有建。本规范是预留规则。

---

详见 [docs/changes/2025-07-20-classification-restructuring.md](../changes/2025-07-20-classification-restructuring.md) 和 [docs/decisions/0004-separate-code-repo.md](../decisions/0004-separate-code-repo.md)。
