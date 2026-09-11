---
title: 从零实现 Raft（选主 + 日志复制）
date: 2026-09-11
type: demo
tags: [架构, 分布式理论, Raft, 实践, 源码]
wordCount: 1505
readMinutes: 5
---

# 从零实现 Raft（选主 + 日志复制）

> **一句话摘要**：用代码实现 Raft 的核心——选主 + 日志复制，从理论到实践的跨越。
> **本文核心**：**实现 = 状态机 + RPC + 持久化**。

前置阅读：[Raft 共识算法深度解析](./特性层/深入理解Raft系列/1_Raft共识算法深度解析-特性.md)。本篇将理论转化为可运行的代码。

## 1. 背景：为什么要实现

看懂 Raft 不等于会用 Raft——实现过程才能真正理解：

- 状态机转换的细节
- RPC 的时序关系
- 持久化的重要性

通过实现 Raft，掌握分布式共识的工程实践。

## 2. 核心机制：状态机

### 2.1 节点状态

```go
// Raft 节点状态
type Node struct {
    state        State     // Follower/Candidate/Leader
    term         int       // 当前任期
    votedFor     int       // 投票给谁
    log          []LogEntry // 日志
    commitIndex  int       // 已提交索引
    lastApplied  int       // 已应用索引
    
    // 持久化
    persist     Persister // 持久化接口
    
    // 通信
    peers       []Peer    // 邻居节点
    rpc         RPCClient // RPC 客户端
}

type State int
const (
    Follower State = iota
    Candidate
    Leader
)
```

### 2.2 核心数据结构

```go
// 日志条目
type LogEntry struct {
    Term    int         // 任期
    Command interface{} // 命令
}

// 投票请求
type VoteRequest struct {
    Term         int  // 候选人任期
    CandidateId  int  // 候选人ID
    LastLogTerm  int  // 最后日志任期
    LastLogIndex int  // 最后日志索引
}

// 投票响应
type VoteResponse struct {
    Term        int  // 当前任期
    VoteGranted bool // 是否同意
}

// AppendEntries 请求
type AppendEntriesRequest struct {
    Term         int          // 领导者任期
    LeaderId     int          // 领导者ID
    PrevLogIndex int          // 前一条日志索引
    PrevLogTerm  int          // 前一条日志任期
    Entries      []LogEntry   // 新日志条目
    LeaderCommit int          // 领导者已提交索引
}
```

## 3. 落地实践：选主实现

### 3.1 选举流程

```go
func (n *Node) startElection() {
    n.state = Candidate
    n.term++
    n.votedFor = n.id
    n.persist() // 持久化
    
    // 发送投票请求给所有节点
    for _, peer := range n.peers {
        go func(p Peer) {
            resp := p.RequestVote(VoteRequest{
                Term:         n.term,
                CandidateId:  n.id,
                LastLogTerm:  n.log[len(n.log)-1].Term,
                LastLogIndex: len(n.log) - 1,
            })
            n.handleVoteResponse(resp)
        }(peer)
    }
}

func (n *Node) handleVoteResponse(resp VoteResponse) {
    if resp.VoteGranted && n.state == Candidate {
        n.votes++
        if n.votes > len(n.peers)/2 {
            n.becomeLeader() // 获得多数票，成为Leader
        }
    }
}
```

### 3.2 心跳机制

```go
func (n *Node) sendHeartbeats() {
    for _, peer := range n.peers {
        go func(p Peer) {
            p.AppendEntries(AppendEntriesRequest{
                Term:     n.term,
                LeaderId: n.id,
                // 心跳：Entries为空
            })
        }(peer)
    }
    
    // 定时发送心跳
    time.AfterFunc(heartbeatInterval, func() {
        n.sendHeartbeats()
    })
}
```

## 4. 落地实践：日志复制实现

### 4.1 日志追加

```go
func (n *Node) replicateLog(entry LogEntry) {
    n.log = append(n.log, entry)
    n.persist() // 持久化
    
    // 复制到所有Follower
    for i, peer := range n.peers {
        go func(idx int, p Peer) {
            prevIndex := n.nextIndex[idx] - 1
            prevTerm := n.log[prevIndex].Term
            
            resp := p.AppendEntries(AppendEntriesRequest{
                Term:         n.term,
                LeaderId:     n.id,
                PrevLogIndex: prevIndex,
                PrevLogTerm:  prevTerm,
                Entries:      []LogEntry{entry},
                LeaderCommit: n.commitIndex,
            })
            
            n.handleAppendResponse(idx, resp)
        }(i, peer)
    }
}
```

### 4.2 提交规则

```go
func (n *Node) handleAppendResponse(peerIdx int, resp AppendEntriesResponse) {
    if resp.Success {
        n.nextIndex[peerIdx] = resp.NextIndex
        n.matchIndex[peerIdx] = resp.MatchIndex
        
        // 检查是否可以提交
        matchIndexes := append([]int{n.matchIndex[n.id]}, n.matchIndex...)
        sort.Ints(matchIndexes)
        median := matchIndexes[len(matchIndexes)/2]
        
        if median > n.commitIndex && n.log[median].Term == n.term {
            n.commitIndex = median
            n.applyLog() // 应用到状态机
        }
    } else {
        // 冲突：回退nextIndex
        n.nextIndex[peerIdx]--
    }
}
```

## 5. 落地实践：持久化

```go
// 持久化所有状态
func (n *Node) persist() {
    data := struct {
        Term         int
        VotedFor     int
        Log          []LogEntry
    }{
        Term:     n.term,
        VotedFor: n.votedFor,
        Log:      n.log,
    }
    n.persist.Save(data)
}

// 从持久化恢复
func (n *Node) readPersist() {
    data := n.persist.Read()
    n.term = data.Term
    n.votedFor = data.VotedFor
    n.log = data.Log
}
```

**持久化的重要性**：
- 重启后恢复状态
- 防止数据丢失
- 保证安全性

## 6. 落地实践：完整生命周期

```go
func main() {
    // 1. 初始化
    node := NewNode(id, peers, persist)
    
    // 2. 启动
    node.start()
    // - 成为Follower
    // - 等待选举超时
    
    // 3. 选举
    // - 超时 → Candidate
    // - 获得多数票 → Leader
    
    // 4. 服务
    // - 处理客户端请求
    // - 复制日志到Follower
    // - 提交日志
    
    // 5. 故障恢复
    // - Leader宕机 → 重新选举
    // - Follower重启 → 从持久化恢复
    
    // 6. 关闭
    node.shutdown()
}
```

## 7. 生产视角：实现踩坑

- **踩坑 1**：持久化不完整——重启后状态不一致
- **踩坑 2**：RPC 超时处理不当——导致脑裂
- **踩坑 3**：日志压缩不及时——日志无限增长
- **踩坑 4**：成员变更处理不当——集群不可用

**生产最佳实践**：

1. 所有状态必须持久化
2. RPC 超时设置合理
3. 定期日志压缩
4. 成员变更使用联合共识
5. 监控 Leader 切换频率

## 8. 典型场景

| 场景 | 实现要点 |
|---|---|
| 最小集群 | 3 节点即可 |
| 扩容 | 联合共识 |
| 监控 | 监控 Leader 切换 |
| 备份 | 快照 + 持久化 |

## 9. 你们可能会问

- **实现 Raft 需要多久？** 核心功能 2-3 天，完整版 2-3 周
- **为什么需要持久化？** 不持久化 = 重启后状态丢失 = 数据丢失
- **Raft 能处理网络分区吗？** 能——少数分区无法选举
- **实现 Raft 和用 etcd 有什么区别？** etcd 是成熟产品，实现是学习

## 10. 一句话总结 + 5W 速记卡 + 自测三问

**一句话总结**：实现 Raft = 状态机 + RPC + 持久化 + 选主 + 日志复制。

**5W 速记卡**：

| 维度 | 内容 |
|---|---|
| What | 状态机 + RPC + 持久化 |
| Why | 真正理解共识算法 |
| When | 实现阶段 |
| Where | 所有 Raft 实现 |
| How | 状态转换 + 日志复制 + 持久化 |

**自测三问**：

1. 你的 Raft 实现持久化了吗？
2. 日志提交的条件是什么？
3. 心跳机制怎么实现的？

---

**整合层完结**：从零实现 Raft 的完整实践已建立。

**🎯 核心带走**：

- **核心一句话**：实现 Raft = 状态机 + RPC + 持久化 + 选主 + 日志复制
- **链条复述**：初始化 → 选举 → 日志复制 → 提交 → 应用 → 故障恢复
- **失效点与边界**：持久化不完整导致数据丢失；RPC 超时导致脑裂

💡 **实战提示**：实现 Raft 是分布式系统工程师的必经之路——从理论到实践的跨越。

**开放问题**：实现 Raft 能用于生产吗？答案是：能——etcd 就是这样实现的，但需要大量测试。

**决策（何时用）**：学习用实现；生产用 etcd/成熟方案。
